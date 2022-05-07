/**
 * Describes an image moment element.
 */
class SutoriElementImage extends SutoriElement {
	Src: string;


	constructor() {
		super();
		this.ContentCulture = SutoriCulture.None;
	}


	static Parse(element: HTMLElement) {
		const result = new SutoriElementImage();
		result.Src = element.textContent;
		result.ParseExtraAttributes(element, ['lang']);

		if (element.hasAttribute('lang')) {
			const lang = element.attributes['lang'].textContent;
			result.ContentCulture = SutoriTools.ParseCulture(lang);
		}

		return result;
	}
}