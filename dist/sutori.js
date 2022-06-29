class HTMLElementEx {
    constructor(original) {
        this.Element = original;
    }
    readAttribute(attributeName, defaultValue = null) {
        if (!this.Element.hasAttribute(attributeName))
            return defaultValue;
        return this.Element.attributes[attributeName].textContent;
    }
    readAttributeInt(attributeName, defaultValue = null) {
        if (!this.Element.hasAttribute(attributeName))
            return defaultValue;
        return parseInt(this.Element.attributes[attributeName].textContent);
    }
    readAttributeBool(attributeName, defaultValue = null) {
        if (!this.Element.hasAttribute(attributeName))
            return defaultValue;
        return SutoriTools.ParseBool(this.Element.attributes[attributeName].textContent);
    }
    readAttributeCulture(attributeName) {
        if (!this.Element.hasAttribute(attributeName))
            return SutoriCulture.None;
        return SutoriTools.ParseCulture(this.Element.attributes[attributeName].textContent);
    }
    readAttributeSolver(attributeName) {
        if (!this.Element.hasAttribute(attributeName))
            return SutoriSolver.None;
        return SutoriTools.ParseSolver(this.Element.attributes[attributeName].textContent);
    }
}
/**
 * The base class for all moment elements.
 */
class SutoriActor {
    constructor() {
        this.Attributes = new Object;
        this.ContentCulture = SutoriCulture.None;
        this.Elements = new Array();
        this.ID = null;
        this.Name = 'Untitled';
    }
    static Parse(actor_e) {
        const result = new SutoriActor();
        const actor_ex = new HTMLElementEx(actor_e);
        result.ParseExtraAttributes(actor_e, ['id', 'name', 'lang']);
        result.ID = actor_ex.readAttribute('id');
        result.Name = actor_ex.readAttribute('name');
        result.ContentCulture = actor_ex.readAttributeCulture('lang');
        actor_e.querySelectorAll(':scope > *').forEach(async (element_e) => {
            switch (element_e.tagName) {
                case 'text':
                    result.Elements.push(SutoriElementText.Parse(element_e));
                    break;
                case 'media':
                    result.Elements.push(SutoriElementMedia.Parse(element_e));
                    break;
            }
        });
        return result;
    }
    /**
     * Parse extra attributes when parsing an element.
     * @param element The source element.
     * @param exclude An array of keys to exclude.
     */
    ParseExtraAttributes(element, exclude) {
        const self = this;
        self.Attributes = new Object;
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            if (typeof exclude !== 'undefined' && exclude.indexOf(attr.name) > -1)
                continue;
            self.Attributes[attr.name] = attr.value;
        }
    }
}
/**
 * Describes information passed to client code when a challenge event occurs.
 */
class SutoriChallengeEvent {
    constructor(owner, moment) {
        this.Owner = owner;
        this.Moment = moment;
        this.ElementCount = moment.Elements.length;
    }
}
/**
 * Describes a document of multimedia moments.
 */
class SutoriDocument {
    constructor() {
        this.Properties = new Map();
        this.Resources = new Array();
        this.Actors = new Array();
        this.Moments = new Array();
        this.Includes = new Array();
        this.CustomUriLoader = null;
    }
    /**
     * Load a SutoriDocument from an XML file.
     * @param uri The uri location of the XML file to load.
     * @returns The loaded document.
     */
    static async LoadXmlFile(uri) {
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
    async AddDataFromXmlUri(uri) {
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
    async AddDataFromXml(raw_xml) {
        const xml_parser = new DOMParser();
        const xml = xml_parser.parseFromString(raw_xml, "text/xml");
        const self = this;
        xml.querySelectorAll('properties > *').forEach((property_e) => {
            self.Properties.set(property_e.tagName, property_e.textContent);
        });
        const includeElements = xml.querySelectorAll('include');
        for (let i = 0; i < includeElements.length; i++) {
            const includeElement = includeElements[i];
            const include = SutoriInclude.Parse(includeElement);
            self.Includes.push(include);
            if (include.After === false) {
                await this.AddDataFromXmlUri(include.Path);
            }
        }
        xml.querySelectorAll('resources > *').forEach((resource_e) => {
            if (resource_e.tagName == 'image') {
                self.Resources.push(SutoriResourceImage.Parse(resource_e));
            }
        });
        xml.querySelectorAll('actors actor').forEach((actor_e) => {
            self.Actors.push(SutoriActor.Parse(actor_e));
        });
        xml.querySelectorAll('moments moment').forEach((moment_e) => {
            const moment = new SutoriMoment();
            const moment_ex = new HTMLElementEx(moment_e);
            self.AddMomentAttributes(moment, moment_e, ['id', 'goto', 'actor', 'clear']);
            moment.ID = moment_ex.readAttribute('id');
            moment.Goto = moment_ex.readAttribute('goto');
            moment.Actor = moment_ex.readAttribute('actor');
            moment.Clear = moment_ex.readAttributeBool('clear', false);
            moment_e.querySelectorAll(':scope > *').forEach(async (element_e) => {
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
        for (let i = 0; i < self.Includes.length; i++) {
            const include = self.Includes[i];
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
    AddMomentAttributes(moment, element, exclude) {
        const self = this;
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            if (typeof exclude !== 'undefined' && exclude.indexOf(attr.name) > -1)
                continue;
            moment.Attributes[attr.name] = attr.value;
        }
    }
    /**
     * Get a resource by it's id.
     * @param id
     * @returns Either the found resource or undefined.
     */
    GetResourceByID(id) {
        return this.Resources.find(res => res.ID == id);
    }
    /**
     * Serialize the loaded document into an xml.
     * @param doc The destination document.
     */
    SerializeToXml() {
        const doc = document.implementation.createDocument(null, 'document');
        const self = this;
        const root = doc.childNodes[0];
        // serialize properties.
        if (self.Properties.size > 0) {
            const props = root.appendChild(doc.createElement('properties'));
            self.Properties.forEach((value, key) => {
                const prop = props.appendChild(doc.createElement(key));
                prop.textContent = value;
            });
        }
        // serialize includes.
        for (var i = 0; i < self.Includes.length; i++) {
            const includeElement = root.appendChild(doc.createElement('include'));
            includeElement.textContent = self.Includes[i].Path;
            if (self.Includes[i].After) {
                includeElement.setAttribute('after', 'true');
            }
        }
        // serialize the resources.
        const resources = root.appendChild(doc.createElement('resources'));
        for (var i = 0; i < self.Resources.length; i++) {
            const resource = self.Resources[i];
            if (resource instanceof SutoriResourceImage) {
                const resourceElement = resources.appendChild(doc.createElement('image'));
                if (!SutoriTools.IsEmptyString(resource.ID))
                    resourceElement.setAttribute('id', resource.ID);
                if (!SutoriTools.IsEmptyString(resource.Name))
                    resourceElement.setAttribute('name', resource.Name);
                if (!SutoriTools.IsEmptyString(resource.Src))
                    resourceElement.setAttribute('src', resource.Src);
                if (resource.Preload === true)
                    resourceElement.setAttribute('preload', 'true');
                // apply the attributes.
                for (const [key, value] of Object.entries(resource.Attributes)) {
                    resourceElement.setAttribute(key, value);
                }
            }
        }
        // serialize the actors.
        const actors = root.appendChild(doc.createElement('actors'));
        for (var i = 0; i < self.Actors.length; i++) {
            const actor = self.Actors[i];
            const actorElement = actors.appendChild(doc.createElement('actor'));
            if (!SutoriTools.IsEmptyString(actor.ID))
                actorElement.setAttribute('id', actor.ID);
            actorElement.setAttribute('name', actor.Name);
            // apply the attributes.
            for (const [key, value] of Object.entries(actor.Attributes)) {
                actorElement.setAttribute(key, value);
            }
        }
        // serialize moments.
        const moments = root.appendChild(doc.createElement('moments'));
        for (var i = 0; i < self.Moments.length; i++) {
            const moment = self.Moments[i];
            const momentElement = moments.appendChild(doc.createElement('moment'));
            // moment attributes.
            if (moment.Clear === true)
                momentElement.setAttribute('clear', 'true');
            if (!SutoriTools.IsEmptyString(moment.ID))
                momentElement.setAttribute('id', moment.ID);
            if (!SutoriTools.IsEmptyString(moment.Actor))
                momentElement.setAttribute('actor', moment.Actor);
            if (!SutoriTools.IsEmptyString(moment.Goto))
                momentElement.setAttribute('goto', moment.Goto);
            // apply the attributes.
            for (const [key, value] of Object.entries(moment.Attributes)) {
                momentElement.setAttribute(key, value);
            }
            // serialize the elements.
            for (var j = 0; j < moment.Elements.length; j++) {
                const element = moment.Elements[j];
                if (element instanceof SutoriElementText) {
                    const text = element;
                    const te = momentElement.appendChild(doc.createElement('text'));
                    te.textContent = text.Text;
                    if (text.ContentCulture !== SutoriCulture.None)
                        te.setAttribute('lang', text.ContentCulture);
                }
                else if (element instanceof SutoriElementOption) {
                    const option = element;
                    const oe = momentElement.appendChild(doc.createElement('option'));
                    oe.textContent = option.Text;
                    if (option.ContentCulture !== SutoriCulture.None)
                        oe.setAttribute('lang', option.ContentCulture);
                    if (option.Solver !== SutoriSolver.None)
                        oe.setAttribute('solver', option.Solver);
                    if (!SutoriTools.IsEmptyString(option.Target))
                        oe.setAttribute('target', option.Target);
                    if (!SutoriTools.IsEmptyString(option.SolverCallback))
                        oe.setAttribute('solver', option.SolverCallback);
                }
                else if (element instanceof SutoriElementMedia) {
                    const image = element;
                    const ie = momentElement.appendChild(doc.createElement('image'));
                    if (image.ContentCulture !== SutoriCulture.None)
                        ie.setAttribute('lang', image.ContentCulture);
                    if (!SutoriTools.IsEmptyString(image.ResourceID))
                        ie.setAttribute('resource', image.ResourceID);
                    if (!SutoriTools.IsEmptyString(image.For))
                        ie.setAttribute('for', image.For);
                }
                else if (element instanceof SutoriElementSet) {
                    const setter = element;
                    const se = momentElement.appendChild(doc.createElement('set'));
                    if (setter.ContentCulture !== SutoriCulture.None)
                        se.setAttribute('lang', setter.ContentCulture);
                    if (!SutoriTools.IsEmptyString(setter.Name))
                        se.setAttribute('name', setter.Name);
                    se.textContent = setter.Value;
                }
                else if (element instanceof SutoriElementTrigger) {
                    const trigger = element;
                    const te = momentElement.appendChild(doc.createElement('trigger'));
                    if (trigger.ContentCulture !== SutoriCulture.None)
                        te.setAttribute('lang', trigger.ContentCulture);
                    if (!SutoriTools.IsEmptyString(trigger.Action))
                        te.setAttribute('action', trigger.Action);
                    te.textContent = trigger.Body;
                }
            }
        }
        return SutoriTools.StringifyXml(doc);
    }
}
/**
 * The base class for all moment elements.
 */
class SutoriElement {
    /**
     * Parse extra attributes when parsing an element.
     * @param element The source element.
     * @param exclude An array of keys to exclude.
     */
    ParseExtraAttributes(element, exclude) {
        const self = this;
        self.Attributes = new Object;
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            if (typeof exclude !== 'undefined' && exclude.indexOf(attr.name) > -1)
                continue;
            self.Attributes[attr.name] = attr.value;
        }
    }
}
/**
 * A prompt engine for VNS.
 */
class SutoriEngine {
    constructor(document) {
        this.Document = document;
    }
    /**
     * Goto a specific moment found in the Document by id.
     * @param momentID The id of the moment to move the cursor to.
     */
    async GotoMomentID(momentID) {
        const moment = this.Document.Moments.find(t => t.ID == momentID);
        if (moment == null)
            throw new Error("Could not find moment with id #{momentID}.");
        this.GotoMoment(moment);
    }
    /**
     * Goto a specific moment found in the Document by instance.
     * @param moment The instance of the moment to move the cursor to.
     */
    async GotoMoment(moment) {
        const self = this;
        if (moment == null)
            moment = this.Document.Moments[0];
        if (moment == null)
            throw new Error("Document does not have any moments!");
        this.Cursor = moment;
        // execute any load elements set to encounter.
        const loaderElements = moment.GetLoaderElements();
        if (loaderElements && loaderElements.length > 0) {
            for (let i = 0; i < loaderElements.length; i++) {
                if (loaderElements[i].Loaded == false) {
                    await self.Document.AddDataFromXmlUri(loaderElements[i].Path);
                    loaderElements[i].Loaded = true;
                }
            }
        }
        if (typeof this.HandleChallenge !== 'undefined') {
            this.HandleChallenge(new SutoriChallengeEvent(this, moment));
        }
    }
    /**
     * Goto the first moment in the document.
     */
    Play() {
        this.GotoMoment(null);
    }
    /**
     * Go to the next logical moment. The next sequential moment is selected,
     * unless the current moment has a goto option, which will be used instead
     * if found.
     * @returns boolean True if successful.
     */
    GotoNextMoment() {
        const self = this;
        console.log('Goto next moment.');
        if (self.Cursor == null)
            return false; // no cursor present.
        const index = self.Document.Moments.indexOf(self.Cursor);
        if (index == -1)
            return false; // cursor doesn't belong to document.
        // if the moment has a goto, use that instead.
        if (!SutoriTools.IsEmptyString(self.Cursor.Goto)) {
            self.GotoMomentID(self.Cursor.Goto);
            return false;
        }
        if (index == self.Document.Moments.length - 1) {
            if (typeof self.HandleEnd !== 'undefined') {
                self.HandleEnd();
            }
            return false; // end of sequence.
        }
        self.GotoMoment(self.Document.Moments[index + 1]);
        return true;
    }
}
/**
 * Describes a load moment element that loads further moments.
 */
class SutoriInclude {
    constructor() {
        this.Path = "";
    }
    static Parse(element) {
        const result = new SutoriInclude();
        result.Path = element.textContent;
        result.After = element.hasAttribute('after') && element.attributes["after"] === true;
        return result;
    }
}
/**
 * Describes a moment in time.
 */
class SutoriMoment {
    constructor() {
        this.Attributes = new Object;
        this.Elements = new Array();
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
    AddElement(element) {
        this.Elements.push(element);
        return element;
    }
    /**
     * Find all loader elements.
     * @param mode The mode.
     */
    GetLoaderElements() {
        const elements = this.Elements.filter(e => e instanceof SutoriElementLoad);
        return elements;
    }
    /**
     * Get an array of elements of type.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @param type The type of element to return, for example SutoriElementText
     * @returns An array of the type requested.
     */
    GetElements(culture, type) {
        const self = this;
        const elements = typeof culture == 'undefined'
            ? self.Elements.filter(e => e instanceof type)
            : self.Elements.filter(e => e instanceof type && (e.ContentCulture == culture || e.ContentCulture == SutoriCulture.All));
        return elements;
    }
    /**
     * Remove all elements that have the same culture and type.
     * @param culture
     * @param type
     */
    RemoveElements(culture, type) {
        const self = this;
        const elements = self.GetElements(culture, type);
        for (var i = 0; i < elements.length; i++) {
            const index = self.Elements.indexOf(elements[i]);
            self.Elements.splice(index, 1);
        }
    }
    /**
     * Get an array of text elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of text elements.
     */
    GetTexts(culture) {
        return this.GetElements(culture, SutoriElementText);
    }
    /**
     * Get the concatenated text.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns
     */
    GetText(culture) {
        const texts = this.GetTexts(culture);
        let text = '';
        for (var j = 0; j < texts.length; j++) {
            text += texts[j].Text;
        }
        return text;
    }
    /**
     * Get an array of option elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of option elements.
     */
    GetOptions(culture) {
        return this.GetElements(culture, SutoriElementOption);
    }
    /**
     * Get an array of media elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of image elements.
     */
    GetMedia(culture) {
        return this.GetElements(culture, SutoriElementMedia);
    }
    /**
     * Get an array of setter elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of video elements.
     */
    GetSetters(culture) {
        return this.GetElements(culture, SutoriElementSet);
    }
    /**
     * Get an array of trigger elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of video elements.
     */
    GetTriggers(culture) {
        return this.GetElements(culture, SutoriElementTrigger);
    }
    /**
    * Try to get an associated actor for this element.
    * @param document The owner document.
    */
    FindAssociatedActor(document) {
        // return null if no actor attribute is set.
        if (this.Actor == null)
            return null;
        // find the actor.
        return document.Actors.find(t => t.ID == this.Actor);
    }
}
/**
 * The base class for all moment elements.
 */
class SutoriResource {
    /**
     * Parse extra attributes when parsing an element.
     * @param element The source element.
     * @param exclude An array of keys to exclude.
     */
    ParseExtraAttributes(element, exclude) {
        const self = this;
        self.Attributes = new Object;
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            if (typeof exclude !== 'undefined' && exclude.indexOf(attr.name) > -1)
                continue;
            self.Attributes[attr.name] = attr.value;
        }
    }
}
/**
 * Various helper tools.
 */
class SutoriTools {
    /**
     * Return true of the passed text is either true or 1.
     * @param text
     * @returns
     */
    static ParseBool(text) {
        if (!text)
            return false;
        const str = String(text).toLowerCase();
        if (str == "true")
            return true;
        return (str === "1");
    }
    /**
     * Convert the text value of a culture into the enum key equivalent. For
     * example 'en-GB' becomes VnCulture.enGB
     * @param cultureName
     */
    static ParseCulture(cultureName) {
        var _a;
        const stringKey = (_a = Object.entries(SutoriCulture)
            .find(([key, val]) => val === cultureName)) === null || _a === void 0 ? void 0 : _a[0];
        return SutoriCulture[stringKey];
    }
    /**
     * Convert the text value of a solver into the enum key equivalent. For
     * example 'option_index' becomes VnSolver.OptionIndex
     * @param solverName
     */
    static ParseSolver(solverName) {
        var _a;
        const stringKey = (_a = Object.entries(SutoriSolver)
            .find(([key, val]) => val === solverName)) === null || _a === void 0 ? void 0 : _a[0];
        return SutoriSolver[stringKey];
    }
    /**
     * Test weather a string is empty.
     * @param text
     * @returns
     */
    static IsEmptyString(text) {
        if (typeof text === 'undefined' || text === null || text == '')
            return true;
        if (text.length == 0 || text.trim().length == 0)
            return true;
        return false;
    }
    /**
     * Convert an XMLDocument instance into formatted xml text.
     * @param xmlDoc
     * @returns
     */
    static StringifyXml(xmlDoc) {
        const xsltDoc = new DOMParser().parseFromString([
            // describes how we want to modify the XML - indent everything
            '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
            '  <xsl:strip-space elements="*"/>',
            '  <xsl:template match="para[content-style][not(text())]">',
            '    <xsl:value-of select="normalize-space(.)"/>',
            '  </xsl:template>',
            '  <xsl:template match="node()|@*">',
            '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
            '  </xsl:template>',
            '  <xsl:output indent="yes"/>',
            '</xsl:stylesheet>',
        ].join('\n'), 'application/xml');
        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);
        const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        //const pi = resultDoc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
        //resultDoc.insertBefore(pi, resultDoc.childNodes[0]);
        return '<?xml version="1.0" encoding="UTF-8"?>\n' +
            new XMLSerializer().serializeToString(resultDoc);
    }
}
/**
 * Describes a load moment element that loads further moments.
 */
class SutoriElementLoad extends SutoriElement {
    constructor() {
        super();
        this.ContentCulture = SutoriCulture.None;
        this.Loaded = false;
    }
    static Parse(element) {
        const result = new SutoriElementLoad();
        result.ParseExtraAttributes(element, ['mode']);
        result.Path = element.textContent;
        return result;
    }
}
/**
 * Describes an image moment element.
 */
class SutoriElementMedia extends SutoriElement {
    constructor() {
        super();
        this.ContentCulture = SutoriCulture.None;
    }
    static Parse(element) {
        const result = new SutoriElementMedia();
        const element_ex = new HTMLElementEx(element);
        result.ParseExtraAttributes(element, ['actor', 'for', 'resource', 'lang']);
        result.For = element_ex.readAttribute('for');
        result.ResourceID = element_ex.readAttribute('resource');
        result.ContentCulture = element_ex.readAttributeCulture('lang');
        return result;
    }
}
/**
 * Describes an option moment element.
 */
class SutoriElementOption extends SutoriElement {
    constructor() {
        super();
        this.ContentCulture = SutoriCulture.None;
        this.Target = null;
        this.Solver = SutoriSolver.None;
        this.SolverCallback = null;
    }
    static Parse(element) {
        const result = new SutoriElementOption();
        const element_ex = new HTMLElementEx(element);
        result.ParseExtraAttributes(element, ['lang', 'target', 'solver', 'solver_callback']);
        result.Text = element.textContent;
        result.ContentCulture = element_ex.readAttributeCulture('lang');
        result.Target = element_ex.readAttribute('target');
        result.Solver = element_ex.readAttributeSolver('solver');
        result.SolverCallback = element_ex.readAttribute('solver_callback');
        return result;
    }
}
/**
 * Describes a load moment element that loads further moments.
 */
class SutoriElementSet extends SutoriElement {
    constructor() {
        super();
        this.ContentCulture = SutoriCulture.None;
        this.Name = null;
    }
    static Parse(element) {
        const result = new SutoriElementSet();
        const element_ex = new HTMLElementEx(element);
        result.ParseExtraAttributes(element, ['name']);
        result.Name = element_ex.readAttribute('name');
        result.Value = element.textContent;
        return result;
    }
}
/**
 * Describes a text moment element.
 */
class SutoriElementText extends SutoriElement {
    constructor() {
        super();
        this.ContentCulture = SutoriCulture.None;
    }
    static Parse(element) {
        const result = new SutoriElementText();
        const element_ex = new HTMLElementEx(element);
        result.ParseExtraAttributes(element, ['lang']);
        result.Text = element.textContent;
        result.ContentCulture = element_ex.readAttributeCulture('lang');
        return result;
    }
}
/**
 * Describes a load moment element that loads further moments.
 */
class SutoriElementTrigger extends SutoriElement {
    constructor() {
        super();
        this.ContentCulture = SutoriCulture.None;
        this.Action = null;
    }
    static Parse(element) {
        const result = new SutoriElementTrigger();
        const element_ex = new HTMLElementEx(element);
        result.ParseExtraAttributes(element, ['action']);
        result.Body = element.textContent;
        result.Action = element_ex.readAttribute('action');
        return result;
    }
}
/**
 * Describes an image resource.
 */
class SutoriResourceImage extends SutoriResource {
    constructor() {
        super();
        this.ID = null;
        this.Name = 'Untitled';
        this.Attributes = new Object();
    }
    static Parse(element) {
        const result = new SutoriResourceImage();
        const element_ex = new HTMLElementEx(element);
        result.ParseExtraAttributes(element, ['id', 'name', 'src']);
        result.ID = element_ex.readAttribute('id');
        result.Name = element_ex.readAttribute('name');
        result.Src = element_ex.readAttribute('src');
        result.Preload = element_ex.readAttributeBool('preload', false);
        return result;
    }
}
var SutoriCulture;
(function (SutoriCulture) {
    SutoriCulture["None"] = "none";
    SutoriCulture["All"] = "all";
    SutoriCulture["EnUS"] = "en-US";
    SutoriCulture["zhCN"] = "zh-CN";
    SutoriCulture["ruRU"] = "ru-RU";
    SutoriCulture["FrFR"] = "fr-FR";
    SutoriCulture["esES"] = "es-ES";
    SutoriCulture["EnGB"] = "en-GB";
    SutoriCulture["deDE"] = "de-DE";
    SutoriCulture["ptBR"] = "pt-BR";
    SutoriCulture["enCA"] = "en-CA";
    SutoriCulture["esMX"] = "es-MX";
    SutoriCulture["itIT"] = "it-IT";
    SutoriCulture["jaJP"] = "ja-JP"; /* Japanese (Japan) */
})(SutoriCulture || (SutoriCulture = {}));
var SutoriSolver;
(function (SutoriSolver) {
    /** use this when no solver is required */
    SutoriSolver["None"] = "none";
    /** use this when an option should be selected based on the index position of the option chosen */
    SutoriSolver["OptionIndex"] = "option_index";
    /** use this when an option should be selected based on a selected keyboard character */
    SutoriSolver["KeyCharEquality"] = "key_char_equality";
    /** use this when an option should be selected when text matches */
    SutoriSolver["TextEquality"] = "text_equality";
    /** use this if the custom callback should be used to determine when an option should be selected */
    SutoriSolver["Custom"] = "custom";
})(SutoriSolver || (SutoriSolver = {}));
//# sourceMappingURL=sutori.js.map