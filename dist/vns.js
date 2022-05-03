/**
 * Describes information passed to client code when a challenge event occurs.
 */
class VnsChallengeEvent {
    constructor(owner, moment) {
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
    GetElements(culture, type) {
        const elements = typeof culture == 'undefined'
            ? this.Moment.Elements.filter(e => e instanceof type)
            : this.Moment.Elements.filter(e => e instanceof type && (e.ContentCulture == culture || e.ContentCulture == VnsCulture.All));
        return elements;
    }
    /**
     * Get an array of text elements.
     * @param culture The VnsCulture, default is: VnsCulture.None
     * @returns An array of text elements.
     */
    GetText(culture) {
        return this.GetElements(culture, VnsElementText);
    }
    /**
     * Get an array of option elements.
     * @param culture The VnsCulture, default is: VnsCulture.None
     * @returns An array of option elements.
     */
    GetOptions(culture) {
        return this.GetElements(culture, VnsElementOption);
    }
    /**
     * Get an array of image elements.
     * @param culture The VnsCulture, default is: VnsCulture.None
     * @returns An array of image elements.
     */
    GetImages(culture) {
        return this.GetElements(culture, VnsElementImage);
    }
    /**
     * Get an array of audio elements.
     * @param culture The VnsCulture, default is: VnsCulture.None
     * @returns An array of audio elements.
     */
    GetAudio(culture) {
        return this.GetElements(culture, VnsElementAudio);
    }
    /**
     * Get an array of video elements.
     * @param culture The VnsCulture, default is: VnsCulture.None
     * @returns An array of video elements.
     */
    GetVideos(culture) {
        return this.GetElements(culture, VnsElementVideo);
    }
}
/**
 * Describes a document of multimedia moments.
 */
class VnsDocument {
    constructor() {
        this.Moments = new Array();
    }
    /**
     * Load a VnsDocument from an XML file.
     * @param uri The uri location of the XML file to load.
     * @returns The loaded document.
     */
    static async LoadXml(uri) {
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
    async AddMomentsFromXmlUri(uri) {
        const response = await fetch(uri);
        const raw_xml = await response.text();
        await this.AddMomentsFromXml(raw_xml);
    }
    /**
     * Append moments from a raw XML string.
     * @param raw_xml The raw XML string to parse.
     */
    async AddMomentsFromXml(raw_xml) {
        const xml_parser = new DOMParser();
        const xml = xml_parser.parseFromString(raw_xml, "text/xml");
        const self = this;
        xml.querySelectorAll('moments moment').forEach((moment_e) => {
            const moment = new VnsMoment();
            if (moment_e.hasAttribute('id')) {
                moment.ID = moment_e.attributes['id'].textContent;
            }
            if (moment_e.hasAttribute('goto')) {
                moment.Goto = moment_e.attributes['goto'].textContent;
            }
            moment_e.querySelectorAll('elements > *').forEach((element_e) => {
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
    AddMoment(moment) {
        this.Moments.push(moment);
    }
}
/**
 * The base class for all moment elements.
 */
class VnsElement {
}
/**
 * Describes an audio moment element.
 */
class VnsElementAudio extends VnsElement {
    constructor() {
        super();
        this.ContentCulture = VnsCulture.None;
    }
    static Parse(element) {
        const result = new VnsElementAudio();
        result.Src = element.textContent;
        if (element.hasAttribute('lang')) {
            const lang = element.attributes['lang'].textContent;
            result.ContentCulture = VnsTools.ParseCulture(lang);
        }
        return result;
    }
}
/**
 * Describes an image moment element.
 */
class VnsElementImage extends VnsElement {
    constructor() {
        super();
        this.ContentCulture = VnsCulture.None;
    }
    static Parse(element) {
        const result = new VnsElementImage();
        result.Src = element.textContent;
        if (element.hasAttribute('lang')) {
            const lang = element.attributes['lang'].textContent;
            result.ContentCulture = VnsTools.ParseCulture(lang);
        }
        return result;
    }
}
/**
 * Describes an option moment element.
 */
class VnsElementOption extends VnsElement {
    constructor() {
        super();
        this.ContentCulture = VnsCulture.None;
        this.Target = null;
        this.Solver = VnsSolver.None;
        this.SolverCallback = null;
    }
    static Parse(element) {
        const result = new VnsElementOption();
        result.Text = element.textContent;
        if (element.hasAttribute('lang')) {
            const lang = element.attributes['lang'].textContent;
            result.ContentCulture = VnsTools.ParseCulture(lang);
        }
        if (element.hasAttribute('target')) {
            result.Target = element.attributes['target'].textContent;
        }
        if (element.hasAttribute('solver')) {
            const solver = element.attributes['solver'].textContent;
            result.Solver = VnsTools.ParseSolver(solver);
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
class VnsElementText extends VnsElement {
    constructor() {
        super();
        this.ContentCulture = VnsCulture.None;
    }
    static Parse(element) {
        const result = new VnsElementText();
        result.Text = element.textContent;
        if (element.hasAttribute('lang')) {
            const lang = element.attributes['lang'].textContent;
            result.ContentCulture = VnsTools.ParseCulture(lang);
        }
        return result;
    }
}
/**
 * Describes a video moment element.
 */
class VnsElementVideo extends VnsElement {
    constructor() {
        super();
        this.ContentCulture = VnsCulture.None;
    }
    static Parse(element) {
        const result = new VnsElementVideo();
        result.Src = element.textContent;
        if (element.hasAttribute('lang')) {
            const lang = element.attributes['lang'].textContent;
            result.ContentCulture = VnsTools.ParseCulture(lang);
        }
        return result;
    }
}
/**
 * A prompt engine for VNS.
 */
class VnsEngine {
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
        this.HandleChallenge(new VnsChallengeEvent(this, moment));
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
class VnsMoment {
    constructor() {
        this.Elements = new Array();
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
        const element = new VnsElementText();
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
        const element = new VnsElementImage();
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
        const element = new VnsElementAudio();
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
        const element = new VnsElementVideo();
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
        const element = new VnsElementOption();
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
class VnsTools {
    /**
     * Convert the text value of a culture into the enum key equivalent. For
     * example 'en-GB' becomes VnCulture.enGB
     * @param cultureName
     */
    static ParseCulture(cultureName) {
        var _a;
        const stringKey = (_a = Object.entries(VnsCulture)
            .find(([key, val]) => val === cultureName)) === null || _a === void 0 ? void 0 : _a[0];
        return VnsCulture[stringKey];
    }
    /**
     * Convert the text value of a solver into the enum key equivalent. For
     * example 'option_index' becomes VnSolver.OptionIndex
     * @param solverName
     */
    static ParseSolver(solverName) {
        var _a;
        const stringKey = (_a = Object.entries(VnsSolver)
            .find(([key, val]) => val === solverName)) === null || _a === void 0 ? void 0 : _a[0];
        return VnsSolver[stringKey];
    }
}
var VnsCulture;
(function (VnsCulture) {
    VnsCulture["None"] = "none";
    VnsCulture["All"] = "all";
    VnsCulture["EnUS"] = "en-US";
    VnsCulture["zhCN"] = "zh-CN";
    VnsCulture["ruRU"] = "ru-RU";
    VnsCulture["FrFR"] = "fr-FR";
    VnsCulture["esES"] = "es-ES";
    VnsCulture["EnGB"] = "en-GB";
    VnsCulture["deDE"] = "de-DE";
    VnsCulture["ptBR"] = "pt-BR";
    VnsCulture["enCA"] = "en-CA";
    VnsCulture["esMX"] = "es-MX";
    VnsCulture["itIT"] = "it-IT";
    VnsCulture["jaJP"] = "ja-JP"; /* Japanese (Japan) */
})(VnsCulture || (VnsCulture = {}));
var VnsSolver;
(function (VnsSolver) {
    /** use this when no solver is required */
    VnsSolver["None"] = "none";
    /** use this when an option should be selected based on the index position of the option chosen */
    VnsSolver["OptionIndex"] = "option_index";
    /** use this when an option should be selected based on a selected keyboard character */
    VnsSolver["KeyCharEquality"] = "key_char_equality";
    /** use this when an option should be selected when text matches */
    VnsSolver["TextEquality"] = "text_equality";
    /** use this if the custom callback should be used to determine when an option should be selected */
    VnsSolver["Custom"] = "custom";
})(VnsSolver || (VnsSolver = {}));
//# sourceMappingURL=vns.js.map