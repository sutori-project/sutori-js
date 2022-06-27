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
		const element_ex = element as HTMLElementEx;
		result.ParseExtraAttributes(element, ['id', 'name', 'src']);
		result.ID = element_ex.readAttribute('id');
		result.Name = element_ex.readAttribute('name');
		result.Src = element_ex.readAttribute('src');
		result.Preload = element_ex.readAttributeBool('preload');
		return result;
	}
}