/**
 * The base class for all moment elements.
 */
class VnsElement {
    Attributes: Object;
    ContentCulture: VnsCulture;

    
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