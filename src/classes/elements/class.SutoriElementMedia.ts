/**
 * Describes an image moment element.
 */
class SutoriElementMedia extends SutoriElement {
	/**
	 * The purpose of this image. For example; avatar, background etc...
	 */
	For?: string;

	/**
	 * The resource id for the image data.
	 */
	ResourceID?: string;


	constructor() {
		super();
		this.ContentCulture = SutoriCulture.None;
	}


	static Parse(element: HTMLElement) {
		const result = new SutoriElementMedia();
		const element_ex = new HTMLElementEx(element);
		result.ParseExtraAttributes(element, ['actor', 'for', 'resource', 'lang']);
		result.For = element_ex.readAttribute('for');
		result.ResourceID = element_ex.readAttribute('resource');
		result.ContentCulture = element_ex.readAttributeCulture('lang');
		return result;
	}
}