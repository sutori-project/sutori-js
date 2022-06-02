/**
 * Describes a load moment element that loads further moments.
 */
class SutoriInclude {
	/**
	 * The uri of the xml file to load.
	 */
	Path: string;


	/**
	 * Weather to load the include after the document has loaded first.
	 */
	After: boolean;


	constructor() {
		this.Path = "";
	}


	static Parse(element: HTMLElement) : SutoriInclude {
		const result = new SutoriInclude();
		result.Path = element.textContent;
		result.After = element.hasAttribute('after') && element.attributes["after"] === true;
		return result;
	}
}