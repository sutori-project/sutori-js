/**
 * Describes information passed to client code when a challenge event occurs.
 */
class VnsChallengeEvent {
    constructor(owner, moment) {
        this.Owner = owner;
        this.Moment = moment;
        this.ElementCount = moment.Elements.length;
    }
    GetElements(culture, type) {
        const elements = typeof culture == 'undefined'
            ? this.Moment.Elements.filter(e => e instanceof type)
            : this.Moment.Elements.filter(e => e instanceof type && (e.ContentCulture == culture || e.ContentCulture == VnsCulture.All));
        return elements;
    }
    GetText(culture) {
        return this.GetElements(culture, VnsElementText);
    }
    GetOptions(culture) {
        return this.GetElements(culture, VnsElementOption);
    }
    GetImages(culture) {
        return this.GetElements(culture, VnsElementImage);
    }
    GetAudio(culture) {
        return this.GetElements(culture, VnsElementAudio);
    }
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
    static async LoadXml(uri) {
        const response = await fetch(uri);
        const xml_raw = await response.text();
        const xml_parser = new DOMParser();
        const xml = xml_parser.parseFromString(xml_raw, "text/xml");
        const result = new VnsDocument();
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
            result.Moments.push(moment);
        });
        // load the document here.
        return result;
    }
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
    GotoMomentID(momentID) {
        const moment = this.Document.Moments.find(t => t.ID == momentID);
        if (moment == null)
            throw new Error("Could not find moment with id #{momentID}.");
        this.GotoMoment(moment);
    }
    GotoMoment(moment) {
        if (moment == null)
            moment = this.Document.Moments[0];
        if (moment == null)
            throw new Error("Document does not have any beads!");
        this.Cursor = moment;
        this.HandleChallenge(new VnsChallengeEvent(this, moment));
    }
    Play() {
        this.GotoMoment(null);
    }
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
    AddText(culture, text) {
        const element = new VnsElementText();
        element.ContentCulture = culture;
        element.Text = text;
        this.Elements.push(element);
        return element;
    }
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
    static ParseCulture(cultureName) {
        var _a;
        const stringKey = (_a = Object.entries(VnsCulture)
            .find(([key, val]) => val === cultureName)) === null || _a === void 0 ? void 0 : _a[0];
        return VnsCulture[stringKey];
    }
    static ParseSolver(cultureName) {
        var _a;
        const stringKey = (_a = Object.entries(VnsSolver)
            .find(([key, val]) => val === cultureName)) === null || _a === void 0 ? void 0 : _a[0];
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