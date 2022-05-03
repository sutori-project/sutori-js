/**
 * 
 */
class VnsTools {
	/**
	 * Convert the text value of a culture into the enum key equivalent. For
	 * example 'en-GB' becomes VnCulture.enGB
	 * @param cultureName 
	 */
	static ParseCulture(cultureName: string) : VnsCulture {
		const stringKey = Object.entries(VnsCulture)
								.find(([key, val]) => val === cultureName)?.[0];
		return VnsCulture[stringKey];
	}
	

	/**
	 * Convert the text value of a solver into the enum key equivalent. For
	 * example 'option_index' becomes VnSolver.OptionIndex
	 * @param solverName 
	 */
	static ParseSolver(solverName: string) : VnsSolver {
		const stringKey = Object.entries(VnsSolver)
								.find(([key, val]) => val === solverName)?.[0];
		return VnsSolver[stringKey];
	}
}