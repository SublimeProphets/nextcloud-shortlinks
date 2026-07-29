import { describe, expect, it } from 'vitest'
import { aliasSyntaxError } from '../../../src/composables/useAliasValidation'

describe('aliasSyntaxError', () => {
	it('explains spaces, invalid starts, and unsupported characters', () => {
		expect(aliasSyntaxError('hello world')).toBe('Spaces are not allowed in an alias.')
		expect(aliasSyntaxError('-hello')).toBe('The alias must start with a letter or number.')
		expect(aliasSyntaxError('hello/world')).toBe('Use only letters, numbers, hyphens, and underscores.')
		expect(aliasSyntaxError('hello-world_2')).toBe('')
	})
})
