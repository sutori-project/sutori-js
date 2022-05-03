/**
 * Describes an option moment element.
 */
class VnsElementOption extends VnsElement {
	Text: string;
	Target: string;
	Solver: VnsSolver;
	SolverCallback: string;


	constructor() {
		super();
		this.ContentCulture = VnsCulture.None;
		this.Target = null;
		this.Solver = VnsSolver.None;
		this.SolverCallback = null;
	}

    
	static Parse(element: HTMLElement) {
		const result = new VnsElementOption();
		result.Text = element.textContent;
		result.ParseExtraAttributes(element, ['lang', 'target', 'solver', 'solver_callback']);

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