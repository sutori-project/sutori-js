/**
 * Describes a document of multimedia moments.
 */
class VnsDocument {
	Moments: Array<VnsMoment>;

	
	constructor() {
		this.Moments = new Array<VnsMoment>();
	}


	static async LoadXml(uri: string) {
		const response = await fetch(uri);
		const xml_raw = await response.text();
		const xml_parser = new DOMParser();
		const xml = xml_parser.parseFromString(xml_raw, "text/xml");
		const result = new VnsDocument();

		xml.querySelectorAll('moments moment').forEach((moment_e: HTMLElement) => {
			const moment = new VnsMoment();

			if (moment_e.hasAttribute('id')) {
				moment.ID = moment_e.attributes['id'].textContent;
			}

			if (moment_e.hasAttribute('goto')) {
				moment.Goto = moment_e.attributes['goto'].textContent;
			}

			moment_e.querySelectorAll('elements > *').forEach((element_e: HTMLElement) => {
				switch (element_e.tagName) {
					case 'text':
						moment.Elements.push(VnsElementText.Parse(element_e));
						break;
					case 'option':
						moment.Elements.push(VnsElementOption.Parse(element_e));
						break;
					case 'image':
						moment.Elements.push(VnsElementImage.Parse(element_e));
						break;
					case 'audio':
						moment.Elements.push(VnsElementAudio.Parse(element_e));
						break;
					case 'video':
						moment.Elements.push(VnsElementVideo.Parse(element_e));
				}
			});

			result.Moments.push(moment);
		});

		// load the document here.
		return result;
	}


	AddMoment(moment: VnsMoment) {
		this.Moments.push(moment);
	}
}