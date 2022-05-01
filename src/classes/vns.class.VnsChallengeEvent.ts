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


	GetElements(culture?: VnsCulture, type?: any) {
		const elements = typeof culture == 'undefined'
						 ? this.Moment.Elements.filter(e => e instanceof type)
						 : this.Moment.Elements.filter(e => e instanceof type && (e.ContentCulture == culture || e.ContentCulture == VnsCulture.All));
		return elements as Array<typeof type>;
	}


	GetText(culture?: VnsCulture) : Array<VnsElementText> {
		return this.GetElements(culture, VnsElementText);
	}


	GetOptions(culture?: VnsCulture) : Array<VnsElementOption> {
		return this.GetElements(culture, VnsElementOption);
	}


	GetImages(culture?: VnsCulture) : Array<VnsElementImage> {
		return this.GetElements(culture, VnsElementImage);
	}


	GetAudio(culture?: VnsCulture) : Array<VnsElementImage> {
		return this.GetElements(culture, VnsElementAudio);
	}


	GetVideos(culture?: VnsCulture) : Array<VnsElementImage> {
		return this.GetElements(culture, VnsElementVideo);
	}
}