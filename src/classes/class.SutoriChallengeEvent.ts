/**
 * Describes information passed to client code when a challenge event occurs.
 */
class SutoriChallengeEvent {
	readonly Owner: SutoriEngine;
	readonly Moment: SutoriMoment;
	readonly ElementCount: Number;


	constructor(owner: SutoriEngine, moment: SutoriMoment) {
		this.Owner = owner;
		this.Moment = moment;
		this.ElementCount = moment.Elements.length;
	}
}