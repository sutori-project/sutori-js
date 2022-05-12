/**
 * Describes information passed to client code when a challenge event occurs.
 */
class SutoriChallengeEvent {
	Owner: SutoriEngine;
	Moment: SutoriMoment;
	ElementCount: Number;


	constructor(owner: SutoriEngine, moment: SutoriMoment) {
		this.Owner = owner;
		this.Moment = moment;
		this.ElementCount = moment.Elements.length;
	}


	/**
	 * Get an array of elements of type.
	 * @param culture The SutoriCulture, default is: SutoriCulture.None
	 * @param type The type of element to return, for example SutoriElementText
	 * @returns An array of the type requested.
	 */
	GetElements(culture?: SutoriCulture, type?: any) {
		const elements = typeof culture == 'undefined'
						 ? this.Moment.Elements.filter(e => e instanceof type)
						 : this.Moment.Elements.filter(e => e instanceof type && (e.ContentCulture == culture || e.ContentCulture == SutoriCulture.All));
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