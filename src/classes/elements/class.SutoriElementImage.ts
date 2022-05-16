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
	 * Weather or not to preload this image.
	 */
	Preload: boolean;

	/**
	 * The image file uri.
	 */
	Src: string;


	constructor() {
		super();
		this.ContentCulture = SutoriCulture.None;
	}


	static Parse(element: HTMLElement) {
		const result = new SutoriElementImage();
		result.Src = element.textContent;
		result.ParseExtraAttributes(element, ['actor', 'purpose', 'lang']);

		if (element.hasAttribute('actor')) {
			result.Actor = element.attributes['actor'].textContent;
		}

		if (element.hasAttribute('for')) {
			result.For = element.attributes['for'].textContent;
		}

		if (element.hasAttribute('lang')) {
			const lang = element.attributes['lang'].textContent;
			result.ContentCulture = SutoriTools.ParseCulture(lang);
		}

		if (element.hasAttribute('preload')) {
			const preload = SutoriTools.ParseBool(element.attributes['preload'].textContent);
			result.Preload = preload;
			if (preload === true) {
				const img = new Image();
				img.src == result.Src;
			}
		}
		else {
			result.Preload = false;
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