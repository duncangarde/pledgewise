'use client'

import { useEffect, useRef } from 'react'

export default function TallyModule({
	formId,
	label,
	...props
}: {
	formId?: string
	label?: string
} & Sanity.Module) {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!formId) return

		const script = document.createElement('script')
		script.src = 'https://tally.so/widgets/embed.js'
		script.onload = () => {
			// @ts-expect-error - Tally is loaded globally
			if (typeof Tally !== 'undefined') {
				// @ts-expect-error
				Tally.loadEmbeds()
			}
		}

		document.body.appendChild(script)

		return () => {
			document.body.removeChild(script)
		}
	}, [formId])

		return (
		<section aria-label={label || 'Tally Form'} className="flex justify-center">
			<div ref={containerRef} className="w-full max-w-2xl">
				<iframe
					data-tally-src={`https://tally.so/embed/${formId}?hideTitle=1&transparentBackground=1&dynamicHeight=1`}
					loading="lazy"
					width="100%"
					height="415"
					frameBorder="0"
					marginHeight={0}
					marginWidth={0}
					title={label || 'Tally Form'}
				/>
			</div>
		</section>
	)
}
