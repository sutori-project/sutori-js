/**
 * Describes an image moment element.
 */
class SutoriElementImage extends SutoriElement {
	/**
	 * The associated actor id.
	 */
	Actor?: string;

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
		const result = new SutoriElementImage();
		const element_ex = new HTMLElementEx(element);
		result.ParseExtraAttributes(element, ['actor', 'for', 'resource', 'lang']);
		result.Actor = element_ex.readAttribute('actor');
		result.For = element_ex.readAttribute('for');
		result.ResourceID = element_ex.readAttribute('resource');
		result.ContentCulture = element_ex.readAttributeCulture('lang');
		return result;
	}


   /**
    * Try to get an associated actor for this element. 
    * @param document The owner document.
    */
	 GetAssociatedActor(document :SutoriDocument) : SutoriActor {
		// return null if no actor attribute is set.
		if (this.Actor == null) return null;
		// find the actor.
		return document.Actors.find(t => t.ID == this.Actor);
   }
}