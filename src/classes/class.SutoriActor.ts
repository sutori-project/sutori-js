/**
 * The base class for all moment elements.
 */
class SutoriActor {
    Attributes: object;
    ContentCulture: SutoriCulture;
    Elements: Array<SutoriElement>;
    ID: string;
    Name: string;


    constructor() {
        this.Attributes = new Object;
		this.ContentCulture = SutoriCulture.None;
        this.Elements = new Array<SutoriElement>();
        this.ID = null;
        this.Name = 'Untitled';
	}


    static Parse(actor_e: HTMLElement) {
		const result = new SutoriActor();
        const actor_ex = new HTMLElementEx(actor_e);

        result.ParseExtraAttributes(actor_e, ['id', 'name', 'lang']);
        result.ID = actor_ex.readAttribute('id');
        result.Name = actor_ex.readAttribute('name');
        result.ContentCulture = actor_ex.readAttributeCulture('lang');

        actor_e.querySelectorAll(':scope > *').forEach(async (element_e: HTMLElement) => {
            switch (element_e.tagName) {
                case 'text':
                    result.Elements.push(SutoriElementText.Parse(element_e));
                    break;
                case 'image':
                    result.Elements.push(SutoriElementImage.Parse(element_e));
                    break;
                case 'audio':
                    result.Elements.push(SutoriElementAudio.Parse(element_e));
                    break;
                case 'video':
                    result.Elements.push(SutoriElementVideo.Parse(element_e));
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
     protected ParseExtraAttributes(element: HTMLElement, exclude?: Array<string>) {
        const self = this;
        self.Attributes = new Object;
        for (let i=0; i<element.attributes.length; i++) {
            const attr = element.attributes[i];
            if (typeof exclude !== 'undefined' && exclude.indexOf(attr.name) > -1) continue;
            self.Attributes[attr.name] = attr.value;
        }
    }
}