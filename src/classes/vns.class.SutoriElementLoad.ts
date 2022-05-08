/**
 * Describes a load moment element that loads further moments.
 */
class SutoriElementLoad extends SutoriElement {
	Path: string;
	LoadMode: SutoriLoadMode;
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

		if (element.hasAttribute('mode')) {
			const mode = element.attributes['mode'].textContent;
			result.LoadMode = SutoriTools.ParseLoadMode(mode);
		}

		return result;
	}
}