/**
 * Describes an option moment element.
 */
class SutoriElementOption extends SutoriElement {
	/**
	 * The textual content of this option.
	 */
	Text: string;

	/**
	 * The moment id target destination.
	 */
	Target?: string;

	/**
	 * The logical method to use to determine weather this option has been chosen.
	 */
	Solver: SutoriSolver;

	/**
	 * If a Custom solver is chosen, specify a callback to handle the solving.
	 */
	SolverCallback?: string;


	constructor() {
		super();
		this.ContentCulture = SutoriCulture.None;
		this.Target = null;
		this.Solver = SutoriSolver.None;
		this.SolverCallback = null;
	}

    
	static Parse(element: HTMLElement) {
		const result = new SutoriElementOption();
		result.Text = element.textContent;
		result.ParseExtraAttributes(element, ['lang', 'target', 'solver', 'solver_callback']);

		if (element.hasAttribute('lang')) {
			const lang = element.attributes['lang'].textContent;
			result.ContentCulture = SutoriTools.ParseCulture(lang);
		}

		if (element.hasAttribute('target')) {
			result.Target = element.attributes['target'].textContent;
		}

		if (element.hasAttribute('solver')) {
			const solver = element.attributes['solver'].textContent;
			result.Solver = SutoriTools.ParseSolver(solver);
		}

		if (element.hasAttribute('solver_callback')) {
			result.Target = element.attributes['solver_callback'].textContent;
		}

		return result;
	}
}