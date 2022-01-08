import {
  setPreventMultipleRenders,
  renderComponent,
} from "../adaptations/adaptations";

export default function set({ particleId, newState }) {
  const _particle = this._particles[particleId];
  const states = this.particles.states;
  const derivativeSubs = this.particles.derivativeSubs;
  const componentSubs = this.particles.componentSubs;
  const otherSubs = this.particles.otherSubs;
  const otherSubs_instant = this.particles.otherSubs_instant;

  if (_particle.previous !== undefined) _particle.previous = _particle.state;

  //the state has to be updated in two places because of the presence of this.particles
  //and this._particles.
  if (newState !== undefined) {
    _particle.state = newState;
    states[particleId] = newState;
  } else {
    _particle.state = null;
    states[particleId] = null;
  }

  //update all subscribers while avoiding redundant renders.
  setPreventMultipleRenders(true);
  if (otherSubs_instant[particleId])
    otherSubs_instant[particleId].forEach((listener) =>
      listener(newState, _particle.previous)
    );
  if (derivativeSubs[particleId])
    derivativeSubs[particleId].forEach((derivativeId) =>
      this.update({ derivativeId })
    );
  if (componentSubs[particleId]) {
    componentSubs[particleId].forEach((storeId) => renderComponent(storeId));
  }
  if (otherSubs[particleId])
    setTimeout(() =>
      otherSubs[particleId].forEach((listener) =>
        listener(newState, _particle.previous)
      )
    );
  setPreventMultipleRenders(false);
}
