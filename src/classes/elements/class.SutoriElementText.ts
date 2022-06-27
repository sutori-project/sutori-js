/**
 * Describes a text moment element.
 */
class SutoriElementText extends SutoriElement {
	/**
	 * The textual content of this element.
	 */
	Text: string;


	constructor() {
		super();
		this.ContentCulture = SutoriCulture.None;
	}


	static Parse(element: HTMLElement) {
		const result = new SutoriElementText();
		const element_ex = element as HTMLElementEx;
		result.ParseExtraAttributes(element, ['lang']);
		result.Text = element.textContent;
		result.ContentCulture = element_ex.readAttributeCulture('lang');
		return result;
	}
}