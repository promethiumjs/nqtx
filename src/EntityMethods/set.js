import { renderComponent } from "../adaptations/adaptations";
import queueRunSubscription from "./queueRunSubscription";

export default function set({ particleId, newState }) {
  const _particle = this._particles[particleId];
  const states = this.particles.states;
  const derivativeSubs = this.particles.derivativeSubs;
  const componentSubs = this.particles.componentSubs;
  const otherSubs = this.particles.otherSubs;
  const otherSubs_instant = this.particles.otherSubs_instant;

  const previousState = _particle.state;
  if (_particle.previous !== undefined) _particle.previous = previousState;

  //the state has to be updated in two places because of the presence of this.particles
  //and this._particles.
  if (newState !== undefined) {
    if (Object.is(newState, previousState)) return;
    _particle.state = newState;
    states[particleId] = newState;
  }

  //update all subscribers.
  if (otherSubs_instant[particleId])
    otherSubs_instant[particleId].forEach((listener) =>
      listener(newState, previousState)
    );
  if (derivativeSubs[particleId])
    derivativeSubs[particleId].forEach((derivativeId) =>
      this.update({ derivativeId })
    );
  if (componentSubs[particleId]) {
    componentSubs[particleId].forEach((storeId) => renderComponent(storeId));
  }
  if (otherSubs[particleId])
    otherSubs[particleId].forEach((listener) =>
      queueRunSubscription(() => listener(newState, previousState))
    );
}
