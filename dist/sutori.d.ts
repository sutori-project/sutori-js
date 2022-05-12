/**
 * Describes information passed to client code when a challenge event occurs.
 */
declare class SutoriChallengeEvent {
    Owner: SutoriEngine;
    Moment: SutoriMoment;
    ElementCount: Number;
    constructor(owner: SutoriEngine, moment: SutoriMoment);
    /**
     * Get an array of elements of type.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @param type The type of element to return, for example SutoriElementText
     * @returns An array of the type requested.
     */
    GetElements(culture?: SutoriCulture, type?: any): any[];
    /**
     * Get an array of text elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of text elements.
     */
    GetText(culture?: SutoriCulture): Array<SutoriElementText>;
    /**
     * Get an array of option elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of option elements.
     */
    GetOptions(culture?: SutoriCulture): Array<SutoriElementOption>;
    /**
     * Get an array of image elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of image elements.
     */
    GetImages(culture?: SutoriCulture): Array<SutoriElementImage>;
    /**
     * Get an array of audio elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of audio elements.
     */
    GetAudio(culture?: SutoriCulture): Array<SutoriElementImage>;
    /**
     * Get an array of video elements.
     * @param culture The SutoriCulture, default is: SutoriCulture.None
     * @returns An array of video elements.
     */
    GetVideos(culture?: SutoriCulture): Array<SutoriElementImage>;
}
/**
 * Describes a document of multimedia moments.
 */
declare class SutoriDocument {
    Moments: Array<SutoriMoment>;
    constructor();
    /**
     * Load a SutoriDocument from an XML file.
     * @param uri The uri location of the XML file to load.
     * @returns The loaded document.
     */
    static LoadXml(uri: string): Promise<SutoriDocument>;
    /**
     * Append moments from an XML file.
     * @param uri The uri location of the XML file to load.
     */
    AddMomentsFromXmlUri(uri: string): Promise<void>;
    /**
     * Append moments from a raw XML string.
     * @param raw_xml The raw XML string to parse.
     */
    AddMomentsFromXml(raw_xml: string): void;
    /**
     * Called by AddMomentsFromXml to add extra attributes when reading moments.
     * @param moment The target moment to manipulate.
     * @param element The source element.
     * @param exclude An array of keys to exclude.
     */
    private AddMomentAttributes;
    /**
     * Add a moment instance to this document.
     * @param moment The moment instance.
     */
    AddMoment(moment: SutoriMoment): void;
}
/**
 * The base class for all moment elements.
 */
declare class SutoriElement {
    Attributes: Object;
    ContentCulture: SutoriCulture;
    /**
     * Parse extra attributes when parsing an element.
     * @param element The source element.
     * @param exclude An array of keys to exclude.
     */
    protected ParseExtraAttributes(element: HTMLElement, exclude?: Array<string>): void;
}
/**
 * Describes an audio moment element.
 */
declare class SutoriElementAudio extends SutoriElement {
    Src: string;
    constructor();
    static Parse(element: HTMLElement): SutoriElementAudio;
}
/**
 * Describes an image moment element.
 */
declare class SutoriElementImage extends SutoriElement {
    Src: string;
    constructor();
    static Parse(element: HTMLElement): SutoriElementImage;
}
/**
 * Describes a load moment element that loads further moments.
 */
declare class SutoriElementLoad extends SutoriElement {
    Path: string;
    LoadMode: SutoriLoadMode;
    Loaded: boolean;
    constructor();
    static Parse(element: HTMLElement): SutoriElementLoad;
}
/**
 * Describes an option moment element.
 */
declare class SutoriElementOption extends SutoriElement {
    Text: string;
    Target: string;
    Solver: SutoriSolver;
    SolverCallback: string;
    constructor();
    static Parse(element: HTMLElement): SutoriElementOption;
}
/**
 * Describes a text moment element.
 */
declare class SutoriElementText extends SutoriElement {
    Text: string;
    constructor();
    static Parse(element: HTMLElement): SutoriElementText;
}
/**
 * Describes a video moment element.
 */
declare class SutoriElementVideo extends SutoriElement {
    Src: string;
    constructor();
    static Parse(element: HTMLElement): SutoriElementVideo;
}
/**
 * A prompt engine for VNS.
 */
declare class SutoriEngine {
    private Cursor;
    private Document;
    HandleChallenge: CallableFunction;
    constructor(document: SutoriDocument);
    /**
     * Goto a specific moment found in the Document by id.
     * @param momentID The id of the moment to move the cursor to.
     */
    GotoMomentID(momentID: string): Promise<void>;
    /**
     * Goto a specific moment found in the Document by instance.
     * @param moment The instance of the moment to move the cursor to.
     */
    private GotoMoment;
    /**
     * Goto the first moment in the document.
     */
    Play(): void;
    /**
     * Go to the next logical moment. The next sequential moment is selected,
     * unless the current moment has a goto option, which will be used instead
     * if found.
     */
    GotoNextMoment(): void;
}
/**
 *
 */
declare class SutoriMoment {
    Elements: Array<SutoriElement>;
    Attributes: Object;
    ID: string;
    Goto: string;
    constructor();
    /**
     * Add a text element to this moment.
     * @param culture The culture of the element.
     * @param text The associated text.
     * @returns The added element.
     */
    AddText(culture: SutoriCulture, text: string): SutoriElementText;
    /**
     * Add an image element to this moment.
     * @param culture The culture of the element.
     * @param src The associated file src.
     * @returns The added element.
     */
    AddImage(culture: SutoriCulture, src: string): SutoriElementImage;
    /**
     * Add an audio element to this moment.
     * @param culture The culture of the element.
     * @param src The associated file src.
     * @returns The added element.
     */
    AddAudio(culture: SutoriCulture, src: string): SutoriElementAudio;
    /**
     * Add a video element to this moment.
     * @param culture The culture of the element.
     * @param src The associated file src.
     * @returns The added element.
     */
    AddVideo(culture: SutoriCulture, src: string): SutoriElementVideo;
    /**
     * Add an option element to this moment.
     * @param culture The culture of the element.
     * @param text The associated text.
     * @param text The id of the moment to target when this option is selected.
     * @returns The added element.
     */
    AddOption(culture: SutoriCulture, text: string, target: string): SutoriElementOption;
    /**
     * Find all loader elements.
     * @param mode The mode.
     */
    GetLoaderElements(mode: SutoriLoadMode): Array<SutoriElementLoad>;
}
/**
 *
 */
declare class SutoriTools {
    /**
     * Convert the text value of a culture into the enum key equivalent. For
     * example 'en-GB' becomes VnCulture.enGB
     * @param cultureName
     */
    static ParseCulture(cultureName: string): SutoriCulture;
    /**
     * Convert the text value of a solver into the enum key equivalent. For
     * example 'option_index' becomes VnSolver.OptionIndex
     * @param solverName
     */
    static ParseSolver(solverName: string): SutoriSolver;
    /**
     * Convert the text value of a load mode into the enum key equivalent.
     */
    static ParseLoadMode(loadMode: string): SutoriLoadMode;
}
declare enum SutoriLoadMode {
    /** Load immediately. */
    Immediate = "immediate",
    /** Only load when the parent moment is encountered */
    OnEncounter = "encounter"
}
declare enum SutoriCulture {
    None = "none",
    All = "all",
    EnUS = "en-US",
    zhCN = "zh-CN",
    ruRU = "ru-RU",
    FrFR = "fr-FR",
    esES = "es-ES",
    EnGB = "en-GB",
    deDE = "de-DE",
    ptBR = "pt-BR",
    enCA = "en-CA",
    esMX = "es-MX",
    itIT = "it-IT",
    jaJP = "ja-JP"
}
declare enum SutoriSolver {
    /** use this when no solver is required */
    None = "none",
    /** use this when an option should be selected based on the index position of the option chosen */
    OptionIndex = "option_index",
    /** use this when an option should be selected based on a selected keyboard character */
    KeyCharEquality = "key_char_equality",
    /** use this when an option should be selected when text matches */
    TextEquality = "text_equality",
    /** use this if the custom callback should be used to determine when an option should be selected */
    Custom = "custom"
}
