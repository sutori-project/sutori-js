/**
 * Describes a document of multimedia moments.
 */
class SutoriDocument {
	Actors: Array<SutoriActor>;
	Moments: Array<SutoriMoment>;

	
	constructor() {
		this.Actors = new Array<SutoriActor>();
		this.Moments = new Array<SutoriMoment>();
	}


	/**
	 * Load a SutoriDocument from an XML file.
	 * @param uri The uri location of the XML file to load.
	 * @returns The loaded document.
	 */
	static async LoadXml(uri: string) {
		// create a new document.
		const result = new SutoriDocument();
		// load the document here.
		await result.AddDataFromXmlUri(uri);
		// return the loaded document.
		return result;
	}


	/**
	 * Append moments from an XML file.
	 * @param uri The uri location of the XML file to load.
	 */
	async AddDataFromXmlUri(uri: string) {
		const response = await fetch(uri);
		const raw_xml = await response.text();
		console.log("loading moments from " + uri);
		await this.AddDataFromXml(raw_xml);
	}


	/**
	 * Append moments from a raw XML string.
	 * @param raw_xml The raw XML string to parse.
	 */
	async AddDataFromXml(raw_xml: string) {
		const xml_parser = new DOMParser();
		const xml = xml_parser.parseFromString(raw_xml, "text/xml");
		const self = this;

		const includes = xml.querySelectorAll('include');
		for (let i=0; i<includes.length; i++) {
			const include = includes[i];
			if (include.hasAttribute('after') === false) {
				await this.AddDataFromXmlUri(include.textContent);
			}
		}

		xml.querySelectorAll('actors actor').forEach((actor_e: HTMLElement) => {
			self.Actors.push(SutoriActor.Parse(actor_e));
		});

		xml.querySelectorAll('moments moment').forEach((moment_e: HTMLElement) => {
			const moment = new SutoriMoment();

			if (moment_e.hasAttribute('id')) {
				moment.ID = moment_e.attributes['id'].textContent;
			}

			if (moment_e.hasAttribute('goto')) {
				moment.Goto = moment_e.attributes['goto'].textContent;
			}

			if (moment_e.hasAttribute('clear')) {
				moment.Clear = SutoriTools.ParseBool(moment_e.attributes['clear'].textContent);
			}

			self.AddMomentAttributes(moment, moment_e, ['id', 'goto', 'clear']);

			moment_e.querySelectorAll(':scope > *').forEach(async (element_e: HTMLElement) => {
				switch (element_e.tagName) {
					case 'text':
						moment.Elements.push(SutoriElementText.Parse(element_e));
						break;
					case 'option':
						moment.Elements.push(SutoriElementOption.Parse(element_e));
						break;
					case 'image':
						moment.Elements.push(SutoriElementImage.Parse(element_e));
						break;
					case 'audio':
						moment.Elements.push(SutoriElementAudio.Parse(element_e));
						break;
					case 'video':
						moment.Elements.push(SutoriElementVideo.Parse(element_e));
						break;
					case 'load':
						moment.Elements.push(SutoriElementLoad.Parse(element_e));
						break;
					case 'set':
						moment.Elements.push(SutoriElementSet.Parse(element_e));
						break;
					case 'trigger':
						moment.Elements.push(SutoriElementTrigger.Parse(element_e));
						break;
				}
			});

			self.Moments.push(moment);
		});

		for (let i=0; i<includes.length; i++) {
			const include = includes[i];
			if (include.hasAttribute('after') === true) {
				await this.AddDataFromXmlUri(include.textContent);
			}
		}
	}


	/**
	 * Called by AddMomentsFromXml to add extra attributes when reading moments.
	 * @param moment The target moment to manipulate.
	 * @param element The source element.
	 * @param exclude An array of keys to exclude.
	 */
	private AddMomentAttributes(moment: SutoriMoment, element: HTMLElement, exclude?: Array<string>) {
		const self = this;
		for (let i=0; i<element.attributes.length; i++) {
			 const attr = element.attributes[i];
			 if (typeof exclude !== 'undefined' && exclude.indexOf(attr.name) > -1) continue;
			 moment.Attributes[attr.name] = attr.value;
		}
	}


	/**
	 * Add an actor instance to this document.
	 * @param actor The actor instance.
	 */
	AddActor(actor: SutoriActor) {
		this.Actors.push(actor);
	}


	/**
	 * Add a moment instance to this document.
	 * @param moment The moment instance.
	 */
	AddMoment(moment: SutoriMoment) {
		this.Moments.push(moment);
	}
}