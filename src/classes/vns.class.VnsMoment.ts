/**
 * 
 */
class VnsMoment {
	Elements: Array<VnsElement>;
	ID: string;
	Goto: string;

	
	constructor() {
		this.Elements = new Array<VnsElement>();
		this.ID = '';
		this.Goto = '';
	}


	AddText(culture: VnsCulture, text: string) : VnsElementText {
		const element = new VnsElementText();
		element.ContentCulture = culture;
		element.Text = text; 
		this.Elements.push(element);
		return element;
	}


	AddOption(culture: VnsCulture, text: string, target: string) : VnsElementOption {
		const element = new VnsElementOption();
		element.ContentCulture = culture;
		element.Text = text;
		element.Target = target; 
		this.Elements.push(element);
		return element;
	}
}