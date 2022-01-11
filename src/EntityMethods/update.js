import { renderComponent } from "../adaptations/adaptations";
import queueRunSubscription from "./queueRunSubscription";

export default function update({ derivativeId }) {
  const _derivative = this._derivatives[derivativeId];
  const states = this.derivatives.states;
  const transforms = this.derivatives.transforms;
  const componentSubs = this.derivatives.componentSubs;
  const otherSubs = this.derivatives.otherSubs;
  const otherSubs_instant = this.derivatives.otherSubs_instant;

  const previousState = _derivative.state;
  if (_derivative.previous !== undefined) _derivative.previous = previousState;

  //generate new state of derivative.
  let newState;
  try {
    newState = transforms[derivativeId]({
      getState: (particleId) => this.getState({ particleId, derivativeId }),
      getPreviousState: (particleId) => this.getPreviousState({ particleId }),
      state: states[derivativeId],
    });
  } catch (err) {
    newState = null;
  }

  //the state has to be updated in two places because of the presence of this.derivatives
  //and this._derivatives.
  if (newState === undefined) return;
  if (Object.is(newState, previousState)) return;
  _derivative.state = newState;
  states[derivativeId] = newState;

  //update all subscribers.
  if (otherSubs_instant[derivativeId])
    otherSubs_instant[derivativeId].forEach((listener) =>
      listener(newState, previousState)
    );
  if (componentSubs[derivativeId]) {
    componentSubs[derivativeId].forEach((storeId) => renderComponent(storeId));
  }
  if (otherSubs[derivativeId])
    otherSubs[derivativeId].forEach((listener) =>
      queueRunSubscription(() => listener(newState, previousState))
    );
}
