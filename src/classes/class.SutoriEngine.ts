/**
 * A prompt engine for VNS.
 */
class SutoriEngine {
	private Cursor: SutoriMoment;
	private Document: SutoriDocument;
	public HandleChallenge: CallableFunction;
	public HandleEnd: CallableFunction;

	
	constructor(document: SutoriDocument) {
		this.Document = document;
	}


	/**
	 * Goto a specific moment found in the Document by id.
	 * @param momentID The id of the moment to move the cursor to.
	 */
	async GotoMomentID(momentID : string) {
		const moment = this.Document.Moments.find(t => t.ID == momentID);
		if (moment == null) throw new Error("Could not find moment with id #{momentID}.");
		this.GotoMoment(moment);
	}


	/**
	 * Goto a specific moment found in the Document by instance.
	 * @param moment The instance of the moment to move the cursor to.
	 */
	private async GotoMoment(moment: SutoriMoment) {
		const self = this;

		if (moment == null) moment = this.Document.Moments[0];
		if (moment == null) throw new Error("Document does not have any moments!");
		this.Cursor = moment;

		// execute any load elements set to encounter.
		const loaderElements = moment.GetLoaderElements();
		if (loaderElements && loaderElements.length > 0) {
			for (let i=0; i<loaderElements.length; i++) {
				if (loaderElements[i].Loaded == false) {
					await self.Document.AddDataFromXmlUri(loaderElements[i].Path);
					loaderElements[i].Loaded = true;
				}
			}
		}

		if (typeof this.HandleChallenge !== 'undefined') {
			this.HandleChallenge(new SutoriChallengeEvent(this, moment));
		}
	}


	/**
	 * Goto the first moment in the document.
	 */
	Play() {
		this.GotoMoment(null);
	}


	/**
	 * Go to the next logical moment. The next sequential moment is selected, 
	 * unless the current moment has a goto option, which will be used instead
	 * if found.
	 * @returns boolean True if successful.
	 */
	GotoNextMoment() : boolean {
		const self = this;
		if (self.Cursor == null) return false; // no cursor present.
		const index = self.Document.Moments.indexOf(self.Cursor);
		if (index == -1) return false; // cursor doesn't belong to document.

		// if the moment has a goto, use that instead.
		if (self.Cursor.Goto != '') {
			self.GotoMomentID(self.Cursor.Goto);
			return false;
		}

		if (index == self.Document.Moments.length - 1) {
			if (typeof self.HandleEnd !== 'undefined') {
				self.HandleEnd();
			}
			return false; // end of sequence.
		}
		self.GotoMoment(self.Document.Moments[index + 1]);
		return true;
	}
}