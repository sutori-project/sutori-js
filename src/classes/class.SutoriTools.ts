/**
 * Various helper tools.
 */
class SutoriTools {
	/**
	 * Return true of the passed text is either true or 1.
	 * @param text 
	 * @returns 
	 */
	static ParseBool(text: string) : boolean {
		if (!text) return false;
		const str = String(text).toLowerCase();
		if (str == "true") return true;
		return (str === "1");
	}

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


	/**
	 * Convert the text value of a load mode into the enum key equivalent.
	 */
	static ParseLoadMode(loadMode: string) : SutoriLoadMode {
		const stringKey = Object.entries(SutoriLoadMode)
								.find(([key, val]) => val === loadMode)?.[0];
		return SutoriLoadMode[stringKey];
	}
}