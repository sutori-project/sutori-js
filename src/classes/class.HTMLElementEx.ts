class HTMLElementEx
{
	Element: HTMLElement;


	constructor(original: HTMLElement) {
		this.Element = original;
	}


	readAttribute(attributeName: string, defaultValue: string = null) : string {
		if (!this.Element.hasAttribute(attributeName)) return defaultValue;
		return this.Element.attributes[attributeName].textContent;
	}


	readAttributeInt(attributeName: string, defaultValue: number = null) :number {
		if (!this.Element.hasAttribute(attributeName)) return defaultValue;
		return parseInt(this.Element.attributes[attributeName].textContent);
	}


	readAttributeBool(attributeName: string, defaultValue: boolean = null) :boolean {
		if (!this.Element.hasAttribute(attributeName)) return defaultValue;
		return SutoriTools.ParseBool(this.Element.attributes[attributeName].textContent);
	}


	readAttributeCulture(attributeName: string) :SutoriCulture {
		if (!this.Element.hasAttribute(attributeName)) return SutoriCulture.None;
		return SutoriTools.ParseCulture(this.Element.attributes[attributeName].textContent);
	}


	readAttributeSolver(attributeName: string) :SutoriSolver {
		if (!this.Element.hasAttribute(attributeName)) return SutoriSolver.None;
		return SutoriTools.ParseSolver(this.Element.attributes[attributeName].textContent);
	}
}