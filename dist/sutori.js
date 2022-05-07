/**
 * Describes information passed to client code when a challenge event occurs.
 */
class SutoriChallengeEvent {
    constructor(owner, moment) {
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
    GetElements(culture, type) {
        const elements = typeof culture == 'undefined'
            ? this.Moment.Elements.filter(e => e instanceof type)
            : this.Moment.Elements.filter(e => e instanceof type && (e.ContentCulture == culture || e.ContentCulture == SutoriCulture.All));
        return elements;
    }
    /**
     * Get an array of text elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of text elements.
     */
    GetText(culture) {
        return this.GetElements(culture, SutoriElementText);
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
     * Get an array of image elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of image elements.
     */
    GetImages(culture) {
        return this.GetElements(culture, SutoriElementImage);
    }
    /**
     * Get an array of audio elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of audio elements.
     */
    GetAudio(culture) {
        return this.GetElements(culture, SutoriElementAudio);
    }
    /**
     * Get an array of video elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of video elements.
     */
    GetVideos(culture) {
        return this.GetElements(culture, SutoriElementVideo);
    }
}
/**
 * Describes a document of multimedia moments.
 */
class SutoriDocument {
    constructor() {
        this.Moments = new Array();
    }
    /**
     * Load a SutoriDocument from an XML file.
     * @param uri The uri location of the XML file to load.
     * @returns The loaded document.
     */
    static async LoadXml(uri) {
        // create a new document.
        const result = new SutoriDocument();
        // load the document here.
        await result.AddMomentsFromXmlUri(uri);
        // return the loaded document.
        return result;
    }
    /**
     * Append moments from an XML file.
     * @param uri The uri location of the XML file to load.
     */
    async AddMomentsFromXmlUri(uri) {
        const response = await fetch(uri);
        const raw_xml = await response.text();
        await this.AddMomentsFromXml(raw_xml);
    }
    /**
     * Append moments from a raw XML string.
     * @param raw_xml The raw XML string to parse.
     */
    AddMomentsFromXml(raw_xml) {
        const xml_parser = new DOMParser();
        const xml = xml_parser.parseFromString(raw_xml, "text/xml");
        const self = this;
        xml.querySelectorAll('moments moment').forEach((moment_e) => {
            const moment = new SutoriMoment();
            if (moment_e.hasAttribute('id')) {
                moment.ID = moment_e.attributes['id'].textContent;
            }
            if (moment_e.hasAttribute('goto')) {
                moment.Goto = moment_e.attributes['goto'].textContent;
            }
            self.AddMomentAttributes(moment, moment_e, ['id', 'goto']);
            moment_e.querySelectorAll('elements > *').forEach((element_e) => {
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
                }
            });
            self.Moments.push(moment);
        });
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
     * Add a moment instance to this document.
     * @param moment The moment instance.
     */
    AddMoment(moment) {
        this.Moments.push(moment);
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
 * Describes an audio moment element.
 */
class SutoriElementAudio extends SutoriElement {
    constructor() {
        super();
        this.ContentCulture = SutoriCulture.None;
    }
    static Parse(element) {
        const result = new SutoriElementAudio();
        result.Src = element.textContent;
        result.ParseExtraAttributes(element, ['lang']);
        if (element.hasAttribute('lang')) {
            const lang = element.attributes['lang'].textContent;
            result.ContentCulture = SutoriTools.ParseCulture(lang);
        }
        return result;
    }
}
/**
 * Describes an image moment element.
 */
class SutoriElementImage extends SutoriElement {
    constructor() {
        super();
        this.ContentCulture = SutoriCulture.None;
    }
    static Parse(element) {
        const result = new SutoriElementImage();
        result.Src = element.textContent;
        result.ParseExtraAttributes(element, ['lang']);
        if (element.hasAttribute('lang')) {
            const lang = element.attributes['lang'].textContent;
            result.ContentCulture = SutoriTools.ParseCulture(lang);
        }
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
        result.Text = element.textContent;
        result.ParseExtraAttributes(element, ['lang', 'target', 'solver', 'solver_callback']);
        if (element.hasAttribute('lang')) {
            const lang = element.attributes['lang'].textContent;
            result.ContentCulture = SutoriTools.ParseCulture(lang);
        }
        if (element.hasAttribute('target')) {
            result.Target = element.attributes['target'].textContent;
        }
        if (element.hasAttribute('solver')) {
            const solver = element.attributes['solver'].textContent;
            result.Solver = SutoriTools.ParseSolver(solver);
        }
        if (element.hasAttribute('solver_callback')) {
            result.Target = element.attributes['solver_callback'].textContent;
        }
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
        result.Text = element.textContent;
        result.ParseExtraAttributes(element, ['lang']);
        if (element.hasAttribute('lang')) {
            const lang = element.attributes['lang'].textContent;
            result.ContentCulture = SutoriTools.ParseCulture(lang);
        }
        return result;
    }
}
/**
 * Describes a video moment element.
 */
class SutoriElementVideo extends SutoriElement {
    constructor() {
        super();
        this.ContentCulture = SutoriCulture.None;
    }
    static Parse(element) {
        const result = new SutoriElementVideo();
        result.Src = element.textContent;
        result.ParseExtraAttributes(element, ['lang']);
        if (element.hasAttribute('lang')) {
            const lang = element.attributes['lang'].textContent;
            result.ContentCulture = SutoriTools.ParseCulture(lang);
        }
        return result;
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
    GotoMomentID(momentID) {
        const moment = this.Document.Moments.find(t => t.ID == momentID);
        if (moment == null)
            throw new Error("Could not find moment with id #{momentID}.");
        this.GotoMoment(moment);
    }
    /**
     * Goto a specific moment found in the Document by instance.
     * @param moment The instance of the moment to move the cursor to.
     */
    GotoMoment(moment) {
        if (moment == null)
            moment = this.Document.Moments[0];
        if (moment == null)
            throw new Error("Document does not have any beads!");
        this.Cursor = moment;
        this.HandleChallenge(new SutoriChallengeEvent(this, moment));
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
     */
    GotoNextMoment() {
        if (this.Cursor == null)
            return; // no cursor present.
        const index = this.Document.Moments.indexOf(this.Cursor);
        if (index == -1)
            return; // cursor doesn't belong to document.
        // if the moment has a goto, use that instead.
        if (this.Cursor.Goto != '') {
            this.GotoMomentID(this.Cursor.Goto);
            return;
        }
        if (index == this.Document.Moments.length - 1)
            return; // end of sequence.
        this.GotoMoment(this.Document.Moments[index + 1]);
    }
}
/**
 *
 */
class SutoriMoment {
    constructor() {
        this.Elements = new Array();
        this.Attributes = new Object;
        this.ID = '';
        this.Goto = '';
    }
    /**
     * Add a text element to this moment.
     * @param culture The culture of the element.
     * @param text The associated text.
     * @returns The added element.
     */
    AddText(culture, text) {
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
    AddImage(culture, src) {
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
    AddAudio(culture, src) {
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
    AddVideo(culture, src) {
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
    AddOption(culture, text, target) {
        const element = new SutoriElementOption();
        element.ContentCulture = culture;
        element.Text = text;
        element.Target = target;
        this.Elements.push(element);
        return element;
    }
}
/**
 *
 */
class SutoriTools {
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