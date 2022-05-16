/**
 * Describes a load moment element that loads further moments.
 */
class SutoriElementSet extends SutoriElement {
	/**
	 * The value of the property.
	 */
	Value: string;

	/**
	 * The property name.
	 */
	Name: string;


	constructor() {
		super()
		this.ContentCulture = SutoriCulture.None;
		this.Name = null;
	}


	static Parse(element: HTMLElement) {
		const result = new SutoriElementSet();
		result.Value = element.textContent;
		result.ParseExtraAttributes(element, ['name']);

		if (element.hasAttribute('name')) {
			result.Name = element.attributes['name'].textContent;
		}

		return result;
	}
}