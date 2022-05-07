/**
 * 
 */
class SutoriMoment {
	Elements: Array<SutoriElement>;
	Attributes: Object;
	ID: string;
	Goto: string;

	
	constructor() {
		this.Elements = new Array<SutoriElement>();
		this.Attributes = new Object;
		this.ID = '';
		this.Goto = '';
	}


	/**
	 * Add a text element to this moment.
	 * @param culture The culture of the element.
	 * @param text The associated text.
	 * @returns The added element.
	 */
	AddText(culture: SutoriCulture, text: string) : SutoriElementText {
		const element = new SutoriElementText();
		element.ContentCulture = culture;
		element.Text = text; 
		this.Elements.push(element);
		return element;
	}


	/**
	 * Add an image element to this moment.
	 * @param culture The culture of the element.
	 * @param src The associated file src.
	 * @returns The added element.
	 */
	AddImage(culture: SutoriCulture, src: string) : SutoriElementImage {
		const element = new SutoriElementImage();
		element.ContentCulture = culture;
		element.Src = src; 
		this.Elements.push(element);
		return element;
	}


	/**
	 * Add an audio element to this moment.
	 * @param culture The culture of the element.
	 * @param src The associated file src.
	 * @returns The added element.
	 */
	AddAudio(culture: SutoriCulture, src: string) : SutoriElementAudio {
		const element = new SutoriElementAudio();
		element.ContentCulture = culture;
		element.Src = src; 
		this.Elements.push(element);
		return element;
	}


	/**
	 * Add a video element to this moment.
	 * @param culture The culture of the element.
	 * @param src The associated file src.
	 * @returns The added element.
	 */
	AddVideo(culture: SutoriCulture, src: string) : SutoriElementVideo {
		const element = new SutoriElementVideo();
		element.ContentCulture = culture;
		element.Src = src; 
		this.Elements.push(element);
		return element;
	}


	/**
	 * Add an option element to this moment.
	 * @param culture The culture of the element.
	 * @param text The associated text.
	 * @param text The id of the moment to target when this option is selected.
	 * @returns The added element.
	 */
	AddOption(culture: SutoriCulture, text: string, target: string) : SutoriElementOption {
		const element = new SutoriElementOption();
		element.ContentCulture = culture;
		element.Text = text;
		element.Target = target; 
		this.Elements.push(element);
		return element;
	}
}