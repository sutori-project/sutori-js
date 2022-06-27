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
		const element_ex = new HTMLElementEx(element);
		result.ParseExtraAttributes(element, ['lang', 'target', 'solver', 'solver_callback']);
		result.Text = element.textContent;
		result.ContentCulture = element_ex.readAttributeCulture('lang');
		result.Target = element_ex.readAttribute('target');
		result.Solver = element_ex.readAttributeSolver('solver');
		result.SolverCallback = element_ex.readAttribute('solver_callback');
		return result;
	}
}