/**
 * Describes a document of multimedia moments.
 */
class SutoriDocument {
	/**
	 * Arbitrary properties associated with this document.
	 */
	readonly Properties: Map<string, string>;
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
		this.Properties = new Map();
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
	static async LoadXmlFile(uri: string) : Promise<SutoriDocument> {
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

		xml.querySelectorAll('properties > *').forEach((property_e: HTMLElement) => {
			self.Properties.set(property_e.tagName, property_e.textContent);
		});

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
			const moment_ex = new HTMLElementEx(moment_e);

			self.AddMomentAttributes(moment, moment_e, ['id', 'goto', 'actor', 'clear']);
			moment.ID = moment_ex.readAttribute('id');
			moment.Goto = moment_ex.readAttribute('goto');
			moment.Actor = moment_ex.readAttribute('actor');
			moment.Clear = moment_ex.readAttributeBool('clear', false);

			moment_e.querySelectorAll(':scope > *').forEach(async (element_e: HTMLElement) => {
				switch (element_e.tagName) {
					case 'text':
						moment.Elements.push(SutoriElementText.Parse(element_e));
						break;
					case 'option':
						moment.Elements.push(SutoriElementOption.Parse(element_e));
						break;
					case 'media':
						moment.Elements.push(SutoriElementMedia.Parse(element_e));
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


	/**
	 * Serialize the loaded document into an xml.
	 * @param doc The destination document.
	 */
	SerializeToXml() : string {
		const doc = document.implementation.createDocument(null, 'document');
		const self = this;
		const root = doc.childNodes[0];

		// serialize properties.
		if (self.Properties.size > 0) {
			const props = root.appendChild(doc.createElement('properties')) as HTMLElement;
			self.Properties.forEach((value: string, key: string) => {
				const prop = props.appendChild(doc.createElement(key));
				prop.textContent = value;
			});
		}
		
		// serialize includes.
		for (var i=0; i<self.Includes.length; i++) {
			const includeElement = root.appendChild(doc.createElement('include')) as HTMLElement;
			includeElement.textContent = self.Includes[i].Path;
			if (self.Includes[i].After) {
				includeElement.setAttribute('after', 'true');
			}
		}

		// serialize the resources.
		const resources = root.appendChild(doc.createElement('resources')) as HTMLElement;
		for (var i=0; i<self.Resources.length; i++) {
			const resource = self.Resources[i];
			if (resource instanceof SutoriResourceImage) {
				const resourceElement = resources.appendChild(doc.createElement('image')) as HTMLElement;
				if (!SutoriTools.IsEmptyString(resource.ID)) resourceElement.setAttribute('id', resource.ID);
				if (!SutoriTools.IsEmptyString(resource.Name)) resourceElement.setAttribute('name', resource.Name);
				if (!SutoriTools.IsEmptyString(resource.Src)) resourceElement.setAttribute('src', resource.Src);
				if (resource.Preload === true) resourceElement.setAttribute('preload', 'true');
				// apply the attributes.
				for (const [key, value] of Object.entries(resource.Attributes)) {
					resourceElement.setAttribute(key, value);
				}
			}
		}

		// serialize the actors.
		const actors = root.appendChild(doc.createElement('actors')) as HTMLElement;
		for (var i=0; i<self.Actors.length; i++) {
			const actor = self.Actors[i];
			const actorElement = actors.appendChild(doc.createElement('actor')) as HTMLElement;
			if (!SutoriTools.IsEmptyString(actor.ID)) actorElement.setAttribute('id', actor.ID);
			actorElement.setAttribute('name', actor.Name);
			// apply the attributes.
			for (const [key, value] of Object.entries(actor.Attributes)) {
				actorElement.setAttribute(key, value as string);
			}
		}

		// serialize moments.
		const moments = root.appendChild(doc.createElement('moments')) as HTMLElement;
		for (var i=0; i<self.Moments.length; i++) {
			const moment = self.Moments[i];
			const momentElement = moments.appendChild(doc.createElement('moment')) as HTMLElement;

			// moment attributes.
			if (moment.Clear === true) momentElement.setAttribute('clear', 'true');
			if (!SutoriTools.IsEmptyString(moment.ID)) momentElement.setAttribute('id', moment.ID);
			if (!SutoriTools.IsEmptyString(moment.Actor)) momentElement.setAttribute('actor', moment.Actor);
			if (!SutoriTools.IsEmptyString(moment.Goto)) momentElement.setAttribute('goto', moment.Goto);
			// apply the attributes.
			for (const [key, value] of Object.entries(moment.Attributes)) {
				momentElement.setAttribute(key, value as string);
			}

			// serialize the elements.
			for (var j=0; j<moment.Elements.length;j++) {
				const element = moment.Elements[j];

				if (element instanceof SutoriElementText)
				{
					const text = element as SutoriElementText;
					const te = momentElement.appendChild(doc.createElement('text')) as HTMLElement;
					te.textContent = text.Text;
					if (text.ContentCulture !== SutoriCulture.None) te.setAttribute('lang', text.ContentCulture);
				}
				else if (element instanceof SutoriElementOption)
				{
					const option = element as SutoriElementOption;
					const oe = momentElement.appendChild(doc.createElement('option')) as HTMLElement;
					oe.textContent = option.Text;
					if (option.ContentCulture !== SutoriCulture.None) oe.setAttribute('lang', option.ContentCulture);
					if (option.Solver !== SutoriSolver.None) oe.setAttribute('solver', option.Solver);
					if (!SutoriTools.IsEmptyString(option.Target)) oe.setAttribute('target', option.Target);
					if (!SutoriTools.IsEmptyString(option.SolverCallback)) oe.setAttribute('solver', option.SolverCallback);
				}
				else if (element instanceof SutoriElementMedia)
				{
					const image = element as SutoriElementMedia;
					const ie = momentElement.appendChild(doc.createElement('image')) as HTMLElement;
					if (image.ContentCulture !== SutoriCulture.None) ie.setAttribute('lang', image.ContentCulture);
					if (!SutoriTools.IsEmptyString(image.ResourceID)) ie.setAttribute('resource', image.ResourceID);
					if (!SutoriTools.IsEmptyString(image.For)) ie.setAttribute('for', image.For);
				}
				else if (element instanceof SutoriElementSet)
				{
					const setter = element as SutoriElementSet;
					const se = momentElement.appendChild(doc.createElement('set')) as HTMLElement;
					if (setter.ContentCulture !== SutoriCulture.None) se.setAttribute('lang', setter.ContentCulture);
					if (!SutoriTools.IsEmptyString(setter.Name)) se.setAttribute('name', setter.Name);
					se.textContent = setter.Value;
				}
				else if (element instanceof SutoriElementTrigger)
				{
					const trigger = element as SutoriElementTrigger;
					const te = momentElement.appendChild(doc.createElement('trigger')) as HTMLElement;
					if (trigger.ContentCulture !== SutoriCulture.None) te.setAttribute('lang', trigger.ContentCulture);
					if (!SutoriTools.IsEmptyString(trigger.Action)) te.setAttribute('action', trigger.Action);
					te.textContent = trigger.Body;
				}
			}
		}

		return SutoriTools.StringifyXml(doc);
	}
}