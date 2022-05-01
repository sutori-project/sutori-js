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


	GotoMomentID(momentID : string) {
		const moment = this.Document.Moments.find(t => t.ID == momentID);
		if (moment == null) throw new Error("Could not find moment with id #{momentID}.");
		this.GotoMoment(moment);
	}


	private GotoMoment(moment: VnsMoment) {
		if (moment == null) moment = this.Document.Moments[0];
		if (moment == null) throw new Error("Document does not have any beads!");
		this.Cursor = moment;
		this.HandleChallenge(new VnsChallengeEvent(this, moment));
	}


	Play() {
		this.GotoMoment(null);
	}


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