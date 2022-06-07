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
		result.ParseExtraAttributes(element, ['actor', 'resource', 'purpose', 'lang']);

		if (element.hasAttribute('actor')) {
			result.Actor = element.attributes['actor'].textContent;
		}

		if (element.hasAttribute('resource')) {
			result.ResourceID = element.attributes['resource'].textContent;
		}

		if (element.hasAttribute('for')) {
			result.For = element.attributes['for'].textContent;
		}

		if (element.hasAttribute('lang')) {
			const lang = element.attributes['lang'].textContent;
			result.ContentCulture = SutoriTools.ParseCulture(lang);
		}

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