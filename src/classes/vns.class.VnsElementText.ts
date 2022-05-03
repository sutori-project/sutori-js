/**
 * Describes a text moment element.
 */
class VnsElementText extends VnsElement {
	Text: string;


	constructor() {
		super();
		this.ContentCulture = VnsCulture.None;
	}


	static Parse(element: HTMLElement) {
		const result = new VnsElementText();
		result.Text = element.textContent;
		result.ParseExtraAttributes(element, ['lang']);

		if (element.hasAttribute('lang')) {
			const lang = element.attributes['lang'].textContent;
			result.ContentCulture = VnsTools.ParseCulture(lang);
		}

		return result;
	}
}