// Helper to extract tags from document type and slug
export function getTags(type: string, slug?: string): string[] {
	const tags = [type]
	if (slug) {
		tags.push(`${type}:${slug}`)
	}
	return tags
}
