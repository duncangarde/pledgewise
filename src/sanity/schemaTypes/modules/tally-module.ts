import { defineType } from 'sanity'
import { TfiLayoutCtaCenter } from 'react-icons/tfi'

export default defineType({
	name: 'tally-module',
	title: 'Tally Form',
	icon: TfiLayoutCtaCenter,
	type: 'object',
	fields: [
		{
			name: 'formId',
			title: 'Tally Form ID',
			type: 'string',
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'label',
			title: 'Admin Label',
			type: 'string',
		},
	],
})
