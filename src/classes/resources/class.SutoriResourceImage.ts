/**
 * Describes an image resource.
 */
class SutoriResourceImage extends SutoriResource {
	/**
	 * The resource id for the image data.
	 */
	 Src?: string;

	/**
	 * Weather or not to preload this image resource.
	 */
	Preload: boolean;


	constructor() {
		super();
		this.ID = null;
		this.Name = 'Untitled';
		this.Attributes = new Object();
	}


	static Parse(element: HTMLElement) {
		const result = new SutoriResourceImage();
		result.ParseExtraAttributes(element, ['id', 'name', 'src']);

		if (element.hasAttribute('id')) {
			result.ID = element.attributes['id'].textContent;
		}

		if (element.hasAttribute('name')) {
			result.Name = element.attributes['name'].textContent;
		}

		if (element.hasAttribute('src')) {
			result.Src = element.attributes['src'].textContent;
		}

		return result;
	}
}