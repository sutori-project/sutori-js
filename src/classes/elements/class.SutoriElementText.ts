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
		result.Text = element.textContent;
		result.ParseExtraAttributes(element, ['lang']);

		if (element.hasAttribute('lang')) {
			const lang = element.attributes['lang'].textContent;
			result.ContentCulture = SutoriTools.ParseCulture(lang);
		}

		return result;
	}
}