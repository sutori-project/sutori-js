/**
 * A prompt engine for VNS.
 */
class VnsEngine {
	private Cursor: VnsMoment;
	private Document: VnsDocument;
	public HandleChallenge: CallableFunction;

	
	constructor(document: VnsDocument) {
		this.Document = document;
	}


	/**
	 * Goto a specific moment found in the Document by id.
	 * @param momentID The id of the moment to move the cursor to.
	 */
	GotoMomentID(momentID : string) {
		const moment = this.Document.Moments.find(t => t.ID == momentID);
		if (moment == null) throw new Error("Could not find moment with id #{momentID}.");
		this.GotoMoment(moment);
	}


	/**
	 * Goto a specific moment found in the Document by instance.
	 * @param moment The instance of the moment to move the cursor to.
	 */
	private GotoMoment(moment: VnsMoment) {
		if (moment == null) moment = this.Document.Moments[0];
		if (moment == null) throw new Error("Document does not have any beads!");
		this.Cursor = moment;
		this.HandleChallenge(new VnsChallengeEvent(this, moment));
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
	 */
	GotoNextMoment() {
		if (this.Cursor == null) return; // no cursor present.
		const index = this.Document.Moments.indexOf(this.Cursor);
		if (index == -1) return; // cursor doesn't belong to document.

		// if the moment has a goto, use that instead.
		if (this.Cursor.Goto != '') {
			this.GotoMomentID(this.Cursor.Goto);
			return;
		}

		if (index == this.Document.Moments.length - 1) return; // end of sequence.
		this.GotoMoment(this.Document.Moments[index + 1]);
	}
}