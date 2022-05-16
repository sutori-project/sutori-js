/**
 * Describes a load moment element that loads further moments.
 */
class SutoriElementTrigger extends SutoriElement {
	/**
	 * The body of the trigger.
	 */
	Body: string;

	/**
	 * Weather or not the content has been loaded yet.
	 */
	Action?: string;


	constructor() {
		super()
		this.ContentCulture = SutoriCulture.None;
		this.Action = null;
	}


	static Parse(element: HTMLElement) {
		const result = new SutoriElementTrigger();
		result.Body = element.textContent;
		result.ParseExtraAttributes(element, ['action']);

		if (element.hasAttribute('action')) {
			result.Action = element.attributes['action'].textContent;
		}

		return result;
	}
}