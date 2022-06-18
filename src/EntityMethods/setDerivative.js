export default function setDerivative({
  id,
  initialState,
  transform,
  previousState,
}) {
  const states = this.derivatives.states;
  const transforms = this.derivatives.transforms;
  const particleSubs = this.derivatives.particleSubs;
  const componentSubs = this.derivatives.componentSubs;
  const otherSubs = this.derivatives.otherSubs;
  const otherSubs_instant = this.derivatives.otherSubs_instant;

  if (transform) {
    transforms[id] = transform;
  }

  if (initialState !== undefined) {
    states[id] = initialState;
  } else if (states[id] === undefined) {
    try {
      states[id] = transforms[id]({
        getState: (particleId) =>
          this.getState({ particleId, derivativeId: id, firstTime: true }),
        getPreviousState: (particleId) =>
          this.getPreviousState({
            particleId,
            derivativeId: id,
            firstTime: true,
          }),
      });
    } catch (err) {
      states[id] = null;
    }

    if (states[id] === undefined) states[id] === null;
  }

  this._derivatives[id] = {
    state: states[id],
    get: (payload) => {
      return transforms[id]({
        getState: (particleId) =>
          this.getState({ particleId, derivativeId: id }),
        getPreviousState: (particleId) =>
          this.getPreviousState({ particleId, derivativeId: id }),
        payload,
        state: states[id],
      });
    },
    subscribe: (listener) => {
      if (otherSubs[id]) otherSubs[id].push(listener);
      else {
        otherSubs[id] = [];
        otherSubs[id].push(listener);
      }
      return () => {
        try {
          const index = otherSubs[id].indexOf(listener);
          otherSubs[id].splice(index, 1);
        } catch (err) {}
      };
    },
    subscribe_instant: (listener) => {
      if (otherSubs_instant[id]) otherSubs_instant[id].push(listener);
      else {
        otherSubs_instant[id] = [];
        otherSubs_instant[id].push(listener);
      }
      return () => {
        try {
          const index = otherSubs_instant[id].indexOf(listener);
          otherSubs_instant[id].splice(index, 1);
        } catch (err) {}
      };
    },
    detonate: () => {
      //set properties to null to release all existing references to the derivative
      //and it's properties to enable garbage collection and avoid memory leaks.
      this._derivatives[id].state = null;
      this._derivatives[id].previous = null;
      this._derivatives[id].get = null;
      this._derivatives[id].subscribe = null;
      this._derivatives[id].subscribe_instant = null;
      this._derivatives[id].detonate = null;

      //unsubscribe from all particles currently subscribed to.
      particleSubs[id].forEach((unsubscribe) => unsubscribe());

      delete this._derivatives[id];
      delete states[id];
      delete transforms[id];
      delete particleSubs[id];
      delete componentSubs[id];
      delete otherSubs[id];
    },
  };

  if (previousState) this._derivatives[id].previous = states[id];
}
