/**
 * Describes a text moment element.
 */
class SutoriElementText extends SutoriElement {
	/**
	 * The associated actor id.
	 */
	Actor?: string;

	/**
	 * The textual content of this element.
	 */
	Text: string;


	constructor() {
		super();
		this.ContentCulture = SutoriCulture.None;
	}


	static Parse(element: HTMLElement) {
		const result = new SutoriElementText();
		result.Text = element.textContent;
		result.ParseExtraAttributes(element, ['actor', 'lang']);

		if (element.hasAttribute('actor')) {
			result.Actor = element.attributes['actor'].textContent;
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