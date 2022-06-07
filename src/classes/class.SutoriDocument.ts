/**
 * Describes a document of multimedia moments.
 */
class SutoriDocument {
	/**
	 * An array of actors.
	 */
	readonly Resources: Array<SutoriResource>;

	/**
	 * An array of actors.
	 */
	readonly Actors: Array<SutoriActor>;

	/**
	 * An array of moments.
	 */
	readonly Moments: Array<SutoriMoment>;

	/**
	 * An array of include elements scoped to the entire document.
	 */
	readonly Includes: Array<SutoriInclude>;

	/**
	 * Define a custom loader for URIs. Takes a uri and returns the loaded xml string.
	 */
	CustomUriLoader?: CallableFunction;

	
	constructor() {
		this.Resources = new Array<SutoriResource>();
		this.Actors = new Array<SutoriActor>();
		this.Moments = new Array<SutoriMoment>();
		this.Includes = new Array<SutoriInclude>();
		this.CustomUriLoader = null;
	}


	/**
	 * Load a SutoriDocument from an XML file.
	 * @param uri The uri location of the XML file to load.
	 * @returns The loaded document.
	 */
	static async LoadXml(uri: string) : Promise<SutoriDocument> {
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
		if (this.CustomUriLoader != null) {
			const custom_raw_xml = await this.CustomUriLoader(uri);
			console.log("loading moments from " + uri);
			await this.AddDataFromXml(custom_raw_xml);
		}
		else {
			const response = await fetch(uri);
			const raw_xml = await response.text();
			console.log("loading moments from " + uri);
			await this.AddDataFromXml(raw_xml);
		}
	}


	/**
	 * Append moments from a raw XML string.
	 * @param raw_xml The raw XML string to parse.
	 */
	async AddDataFromXml(raw_xml: string) {
		const xml_parser = new DOMParser();
		const xml = xml_parser.parseFromString(raw_xml, "text/xml");
		const self = this;

		const includeElements = xml.querySelectorAll('include');

		for (let i=0; i<includeElements.length; i++) {
			const includeElement = includeElements[i];
			const include = SutoriInclude.Parse(includeElement as HTMLElement);
			self.Includes.push(include);
			if (include.After === false) {
				await this.AddDataFromXmlUri(include.Path);
			}
		}

		xml.querySelectorAll('resources > *').forEach((resource_e: HTMLElement) => {
			if (resource_e.tagName == 'image') {
				self.Resources.push(SutoriResourceImage.Parse(resource_e));
			}
		});

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

			if (moment_e.hasAttribute('actor')) {
				moment.Actor = moment_e.attributes['actor'].textContent;
			}

			if (moment_e.hasAttribute('clear')) {
				moment.Clear = SutoriTools.ParseBool(moment_e.attributes['clear'].textContent);
			}

			self.AddMomentAttributes(moment, moment_e, ['id', 'goto', 'actor', 'clear']);

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

		for (let i=0; i<self.Includes.length; i++) {
			const include = self.Includes[i] as SutoriInclude;
			if (include.After === true) {
				await this.AddDataFromXmlUri(include.Path);
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
	 * Get a resource by it's id.
	 * @param id 
	 * @returns Either the found resource or undefined.
	 */
	GetResourceByID(id: string) : SutoriResource {
		return this.Resources.find(res => res.ID == id);
	}
}