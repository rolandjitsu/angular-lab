// Set of accessibility rules that Protractor will test for during e2e tests.
// Also check https://github.com/dequelabs/axe-core/blob/master/doc/API.md#options-parameter.

/**
 * Convert array of rules to an object of rules.
 * @param {Array<string>} rules
 * @param {boolean} enabled
 */
function toRule(rules = [], enabled = true) {
	return rules.reduce((object, key) => {
		object[key] = {enabled};
		return object;
	}, {});
}


// Rules: https://dequeuniversity.com/rules/axe.
module.exports = Object.assign(toRule(['color-contrast', 'region', 'aria-required-children', 'aria-valid-attr-value'], false), toRule([
	'aria-allowed-attr',
	'aria-required-attr',
	'aria-required-parent',
	'aria-roles',
	'aria-valid-attr',
	'button-name',
	'checkboxgroup',
	'dlitem',
	'definition-list',
	'document-title',
	'duplicate-id',
	'empty-heading',
	'heading-order',
	'html-lang',
	'image-alt',
	'list',
	'listitem',
	'link-name',
	'meta-viewport',
	'radiogroup',
	'tabindex',
	'valid-lang'
]));
