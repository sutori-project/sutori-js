/**
 * 
 */
class VnsTools {
	static ParseCulture(cultureName: string) : VnsCulture {
		const stringKey = Object.entries(VnsCulture)
								.find(([key, val]) => val === cultureName)?.[0];
		return VnsCulture[stringKey];
	}
	

	static ParseSolver(cultureName: string) : VnsSolver {
		const stringKey = Object.entries(VnsSolver)
								.find(([key, val]) => val === cultureName)?.[0];
		return VnsSolver[stringKey];
	}
}