import { renderComponent } from "../adaptations/adaptations";

export default function update({ derivativeId }) {
  const _derivative = this._derivatives[derivativeId];
  const states = this.derivatives.states;
  const transforms = this.derivatives.transforms;
  const componentSubs = this.derivatives.componentSubs;
  const otherSubs = this.derivatives.otherSubs;
  const otherSubs_instant = this.derivatives.otherSubs_instant;

  if (_derivative.previous !== undefined)
    _derivative.previous = _derivative.state;

  //generate new state of derivative.
  let newState;
  try {
    newState = transforms[derivativeId]({
      get: (particleId) => this.get({ particleId, derivativeId }),
      getPrevious: (particleId) => this.getPrevious({ particleId }),
      state: states[derivativeId],
    });
  } catch (err) {
    newState = null;
  }

  //the state has to be updated in two places because of the presence of this.derivatives
  //and this._derivatives.
  if (newState !== undefined) {
    _derivative.state = newState;
    states[derivativeId] = newState;
  } else {
    _derivative.state = null;
    states[derivativeId] = null;
  }

  //update all subscribers(redundant renders have already been prevented in
  //the "set" function).
  if (otherSubs_instant[derivativeId])
    otherSubs_instant[derivativeId].forEach((listener) =>
      listener(newState, _derivative.previous)
    );
  if (componentSubs[derivativeId]) {
    componentSubs[derivativeId].forEach((storeId) => renderComponent(storeId));
  }
  if (otherSubs[derivativeId])
    setTimeout(() =>
      otherSubs[derivativeId].forEach((listener) =>
        listener(newState, _derivative.previous)
      )
    );
}
