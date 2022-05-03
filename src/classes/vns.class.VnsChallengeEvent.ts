/**
 * Describes information passed to client code when a challenge event occurs.
 */
class VnsChallengeEvent {
	Owner: VnsEngine;
	Moment: VnsMoment;
	ElementCount: Number;


	constructor(owner: VnsEngine, moment: VnsMoment) {
		this.Owner = owner;
		this.Moment = moment;
		this.ElementCount = moment.Elements.length;
	}


	/**
	 * Get an array of elements of type.
	 * @param culture The VnsCulture, default is: VnsCulture.None
	 * @param type The type of element to return, for example VnsElementText
	 * @returns An array of the type requested.
	 */
	GetElements(culture?: VnsCulture, type?: any) {
		const elements = typeof culture == 'undefined'
						 ? this.Moment.Elements.filter(e => e instanceof type)
						 : this.Moment.Elements.filter(e => e instanceof type && (e.ContentCulture == culture || e.ContentCulture == VnsCulture.All));
		return elements as Array<typeof type>;
	}


	/**
	 * Get an array of text elements.
	 * @param culture The VnsCulture, default is: VnsCulture.None
	 * @returns An array of text elements.
	 */
	GetText(culture?: VnsCulture) : Array<VnsElementText> {
		return this.GetElements(culture, VnsElementText);
	}


	/**
	 * Get an array of option elements.
	 * @param culture The VnsCulture, default is: VnsCulture.None
	 * @returns An array of option elements.
	 */
	GetOptions(culture?: VnsCulture) : Array<VnsElementOption> {
		return this.GetElements(culture, VnsElementOption);
	}


	/**
	 * Get an array of image elements.
	 * @param culture The VnsCulture, default is: VnsCulture.None
	 * @returns An array of image elements.
	 */
	GetImages(culture?: VnsCulture) : Array<VnsElementImage> {
		return this.GetElements(culture, VnsElementImage);
	}


	/**
	 * Get an array of audio elements.
	 * @param culture The VnsCulture, default is: VnsCulture.None
	 * @returns An array of audio elements.
	 */
	GetAudio(culture?: VnsCulture) : Array<VnsElementImage> {
		return this.GetElements(culture, VnsElementAudio);
	}


	/**
	 * Get an array of video elements.
	 * @param culture The VnsCulture, default is: VnsCulture.None
	 * @returns An array of video elements.
	 */
	GetVideos(culture?: VnsCulture) : Array<VnsElementImage> {
		return this.GetElements(culture, VnsElementVideo);
	}
}