/**
 * Describes a load moment element that loads further moments.
 */
class SutoriElementLoad extends SutoriElement {
	/**
	 * The uri of the xml file to load.
	 */
	Path: string;

	/**
	 * Weather or not the content has been loaded yet.
	 */
	Loaded: boolean;


	constructor() {
		super()
		this.ContentCulture = SutoriCulture.None;
		this.Loaded = false;
	}


	static Parse(element: HTMLElement) {
		const result = new SutoriElementLoad();
		result.Path = element.textContent;
		result.ParseExtraAttributes(element, ['mode']);
		return result;
	}
}