class HTMLElementEx extends HTMLElement
{
	readAttribute(attributeName: string, defaultValue?: string) : string {
		const element = this as HTMLElement;
		if (!element.hasAttribute(attributeName)) return defaultValue;
		return element.attributes[attributeName].textContent;
	}


	readAttributeInt(attributeName: string, defaultValue?: number) :number {
		const element = this as HTMLElement;
		if (!element.hasAttribute(attributeName)) return defaultValue;
		return parseInt(element.attributes[attributeName].textContent);
	}


	readAttributeBool(attributeName: string, defaultValue?: boolean) :boolean {
		const element = this as HTMLElement;
		if (!element.hasAttribute(attributeName)) return defaultValue;
		return SutoriTools.ParseBool(element.attributes[attributeName].textContent);
	}


	readAttributeCulture(attributeName: string) :SutoriCulture {
		const element = this as HTMLElement;
		if (!element.hasAttribute(attributeName)) return SutoriCulture.None;
		return SutoriTools.ParseCulture(element.attributes[attributeName].textContent);
	}


	readAttributeSolver(attributeName: string) :SutoriSolver {
		const element = this as HTMLElement;
		if (!element.hasAttribute(attributeName)) return SutoriSolver.None;
		return SutoriTools.ParseSolver(element.attributes[attributeName].textContent);
	}
}