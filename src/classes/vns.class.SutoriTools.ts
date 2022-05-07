/**
 * 
 */
class SutoriTools {
	/**
	 * Convert the text value of a culture into the enum key equivalent. For
	 * example 'en-GB' becomes VnCulture.enGB
	 * @param cultureName 
	 */
	static ParseCulture(cultureName: string) : SutoriCulture {
		const stringKey = Object.entries(SutoriCulture)
								.find(([key, val]) => val === cultureName)?.[0];
		return SutoriCulture[stringKey];
	}
	

	/**
	 * Convert the text value of a solver into the enum key equivalent. For
	 * example 'option_index' becomes VnSolver.OptionIndex
	 * @param solverName 
	 */
	static ParseSolver(solverName: string) : SutoriSolver {
		const stringKey = Object.entries(SutoriSolver)
								.find(([key, val]) => val === solverName)?.[0];
		return SutoriSolver[stringKey];
	}
}