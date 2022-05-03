/**
 * 
 */
class VnsMoment {
	Elements: Array<VnsElement>;
	Attributes: Object;
	ID: string;
	Goto: string;

	
	constructor() {
		this.Elements = new Array<VnsElement>();
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
	AddText(culture: VnsCulture, text: string) : VnsElementText {
		const element = new VnsElementText();
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
	AddImage(culture: VnsCulture, src: string) : VnsElementImage {
		const element = new VnsElementImage();
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
	AddAudio(culture: VnsCulture, src: string) : VnsElementAudio {
		const element = new VnsElementAudio();
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
	AddVideo(culture: VnsCulture, src: string) : VnsElementVideo {
		const element = new VnsElementVideo();
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
	AddOption(culture: VnsCulture, text: string, target: string) : VnsElementOption {
		const element = new VnsElementOption();
		element.ContentCulture = culture;
		element.Text = text;
		element.Target = target; 
		this.Elements.push(element);
		return element;
	}
}