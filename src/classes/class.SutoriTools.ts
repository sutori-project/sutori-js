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
	 * Test weather a string is empty.
	 * @param text 
	 * @returns 
	 */
	static IsEmptyString(text?: string) {
		if (typeof text === 'undefined' || text === null || text == '') return true;
		if (text.length == 0 || text.trim().length == 0) return true;
		return false;
	}


	/**
	 * Convert an XMLDocument instance into formatted xml text.
	 * @param xmlDoc 
	 * @returns 
	 */
	static StringifyXml(xmlDoc: XMLDocument) {
		const xsltDoc = new DOMParser().parseFromString([
		  // describes how we want to modify the XML - indent everything
		  '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
		  '  <xsl:strip-space elements="*"/>',
		  '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
		  '    <xsl:value-of select="normalize-space(.)"/>',
		  '  </xsl:template>',
		  '  <xsl:template match="node()|@*">',
		  '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
		  '  </xsl:template>',
		  '  <xsl:output indent="yes"/>',
		  '</xsl:stylesheet>',
		].join('\n'), 'application/xml');
		const xsltProcessor = new XSLTProcessor();    
		xsltProcessor.importStylesheet(xsltDoc);
		const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
		//const pi = resultDoc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
		//resultDoc.insertBefore(pi, resultDoc.childNodes[0]);
		return '<?xml version="1.0" encoding="UTF-8"?>\n' +
				 new XMLSerializer().serializeToString(resultDoc);
	}
}