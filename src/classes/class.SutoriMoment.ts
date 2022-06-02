/**
 * Describes a moment in time.
 */
class SutoriMoment {
	/**
	 * This moments attributes.
	 */
	Attributes: Object;

	/**
	 * The elements for this moment.
	 */
	Elements: Array<SutoriElement>;

	/**
	 * The next moment id to goto if no other navigation happens after this moment is encountered.
	 */
	Goto: string;

	/**
	 * The moment id.
	 */
	ID: string;

	/**
	 * Weather to clear the screen/terminal when this moment is encountered, set to false to layer moments.
	 */
	Clear: boolean;

	
	constructor() {
		this.Attributes = new Object;
		this.Elements = new Array<SutoriElement>();
		this.Goto = '';
		this.ID = '';
		this.Clear = true;
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


	/**
	 * Find all loader elements.
	 * @param mode The mode.
	 */
	GetLoaderElements() :Array<SutoriElementLoad> {
		const elements = this.Elements.filter(e => e instanceof SutoriElementLoad);
		return elements as Array<SutoriElementLoad>;
	}


	/**
	 * Get an array of elements of type.
	 * @param culture The SutoriCulture, default is: SutoriCulture.None
	 * @param type The type of element to return, for example SutoriElementText
	 * @returns An array of the type requested.
	 */
	 GetElements(culture?: SutoriCulture, type?: any) {
		const self = this;
		const elements = typeof culture == 'undefined'
						 ? self.Elements.filter(e => e instanceof type)
						 : self.Elements.filter(e => e instanceof type && (e.ContentCulture == culture || e.ContentCulture == SutoriCulture.All));
		return elements as Array<typeof type>;
	}


	/**
	 * Get an array of text elements.
	 * @param culture The SutoriCulture, default is: SutoriCulture.None
	 * @returns An array of text elements.
	 */
	GetText(culture?: SutoriCulture) : Array<SutoriElementText> {
		return this.GetElements(culture, SutoriElementText);
	}


	/**
	 * Get an array of option elements.
	 * @param culture The SutoriCulture, default is: SutoriCulture.None
	 * @returns An array of option elements.
	 */
	GetOptions(culture?: SutoriCulture) : Array<SutoriElementOption> {
		return this.GetElements(culture, SutoriElementOption);
	}


	/**
	 * Get an array of image elements.
	 * @param culture The SutoriCulture, default is: SutoriCulture.None
	 * @returns An array of image elements.
	 */
	GetImages(culture?: SutoriCulture) : Array<SutoriElementImage> {
		return this.GetElements(culture, SutoriElementImage);
	}


	/**
	 * Get an array of audio elements.
	 * @param culture The SutoriCulture, default is: SutoriCulture.None
	 * @returns An array of audio elements.
	 */
	GetAudio(culture?: SutoriCulture) : Array<SutoriElementImage> {
		return this.GetElements(culture, SutoriElementAudio);
	}


	/**
	 * Get an array of video elements.
	 * @param culture The SutoriCulture, default is: SutoriCulture.None
	 * @returns An array of video elements.
	 */
	GetVideos(culture?: SutoriCulture) : Array<SutoriElementImage> {
		return this.GetElements(culture, SutoriElementVideo);
	}
}