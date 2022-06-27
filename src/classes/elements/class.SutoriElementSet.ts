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
		const element_ex = element as HTMLElementEx;
		result.ParseExtraAttributes(element, ['name']);
		result.Name = element_ex.readAttribute('name');
		result.Value = element.textContent;
		return result;
	}
}