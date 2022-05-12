/**
 * Describes a load moment element that loads further moments.
 */
class SutoriElementLoad extends SutoriElement {
	/**
	 * The uri of the xml file to load.
	 */
	Path: string;

	/**
	 * Weather to load the xml immediately, or only when this element is encountered.
	 */
	LoadMode: SutoriLoadMode;

	/**
	 * Weather or not the content has been loaded yet.
	 */
	Loaded: boolean;


	constructor() {
		super();
		this.LoadMode = SutoriLoadMode.Immediate;
		this.ContentCulture = SutoriCulture.None;
		this.Loaded = false;
	}


	static Parse(element: HTMLElement) {
		const result = new SutoriElementLoad();
		result.Path = element.textContent;
		result.ParseExtraAttributes(element, ['mode']);

		if (element.hasAttribute('mode')) {
			const mode = element.attributes['mode'].textContent;
			result.LoadMode = SutoriTools.ParseLoadMode(mode);
		}

		return result;
	}
}