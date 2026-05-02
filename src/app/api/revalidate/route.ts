import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
	try {
		const { isValidSignature, body } = await parseBody(
			req,
			process.env.SANITY_REVALIDATE_SECRET,
		)

		if (!isValidSignature) {
			return new NextResponse('Invalid signature', { status: 401 })
		}

		if (!body?._type) {
			return new NextResponse('Bad Request', { status: 400 })
		}

		const type = body._type as string
		const slug = ((body.slug as any)?.current || body.slug) as string

		// Always revalidate by tag for efficient cache invalidation
		revalidateTag(type, undefined as any)
		if (slug) {
			revalidateTag(`${type}:${slug}`, undefined as any)
		}

		// Revalidate specific paths based on document type
		switch (type) {
			case 'site':
			case 'navigation':
				// Nuclear option: revalidate entire layout for global items
				revalidatePath('/', 'layout')
				break

			case 'global-module':
				// Affects all pages
				revalidatePath('/[[...slug]]')
				break

			case 'page':
				if (slug === 'index' || slug === '/' || slug === '') {
					revalidatePath('/')
				} else if (slug) {
					revalidatePath(`/${slug}`)
				}
				break

			case 'blog.post':
				if (slug) {
					revalidatePath(`/blog/${slug}`)
					revalidatePath('/blog')
				}
				break

			case 'blog.category':
				revalidatePath('/blog')
				break

			default:
				// For unknown types, revalidate all
				revalidatePath('/[[...slug]]')
		}

		return NextResponse.json({ revalidated: true, type, slug, now: Date.now() })
	} catch (err) {
		console.error('Revalidation error:', err)
		return new NextResponse('Error revalidating', { status: 500 })
	}
}
