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

        if (actor_e.hasAttribute('id')) {
			result.ID = actor_e.attributes['id'].textContent;
		}

        if (actor_e.hasAttribute('name')) {
			result.Name = actor_e.attributes['name'].textContent;
		}

		if (actor_e.hasAttribute('lang')) {
			const lang = actor_e.attributes['lang'].textContent;
			result.ContentCulture = SutoriTools.ParseCulture(lang);
		}

        const exclude = ['id', 'name', 'lang'];
        for (let i=0; i<actor_e.attributes.length; i++) {
            const attr = actor_e.attributes[i];
            if (typeof exclude !== 'undefined' && exclude.indexOf(attr.name) > -1) continue;
            result.Attributes[attr.name] = attr.value;
        }

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
}