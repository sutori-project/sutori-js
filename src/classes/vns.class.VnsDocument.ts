/**
 * Describes a document of multimedia moments.
 */
class VnsDocument {
	Moments: Array<VnsMoment>;

	
	constructor() {
		this.Moments = new Array<VnsMoment>();
	}


	/**
	 * Load a VnsDocument from an XML file.
	 * @param uri The uri location of the XML file to load.
	 * @returns The loaded document.
	 */
	static async LoadXml(uri: string) {
		// create a new document.
		const result = new VnsDocument();
		// load the document here.
		result.AddMomentsFromXmlUri(uri);
		// return the loaded document.
		return result;
	}


	/**
	 * Append moments from an XML file.
	 * @param uri The uri location of the XML file to load.
	 */
	async AddMomentsFromXmlUri(uri: string) {
		const response = await fetch(uri);
		const raw_xml = await response.text();
		await this.AddMomentsFromXml(raw_xml);
	}


	/**
	 * Append moments from a raw XML string.
	 * @param raw_xml The raw XML string to parse.
	 */
	async AddMomentsFromXml(raw_xml: string) {
		const xml_parser = new DOMParser();
		const xml = xml_parser.parseFromString(raw_xml, "text/xml");
		const self = this;

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

			self.Moments.push(moment);
		});
	}


	/**
	 * Add a moment instance to this document.
	 * @param moment The moment instance.
	 */
	AddMoment(moment: VnsMoment) {
		this.Moments.push(moment);
	}
}