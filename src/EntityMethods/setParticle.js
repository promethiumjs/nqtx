export default function setParticle({
  id,
  initialState,
  mutator,
  previousState,
}) {
  const states = this.particles.states;
  const mutators = this.particles.mutators;
  const derivativeSubs = this.particles.derivativeSubs;
  const componentSubs = this.particles.componentSubs;
  const otherSubs = this.particles.otherSubs;
  const otherSubs_instant = this.particles.otherSubs_instant;

  if (initialState !== undefined) {
    states[id] = initialState;
  } else if (states[id] === undefined) {
    states[id] = null;
  }
  if (mutator) {
    mutators[id] = mutator;
  }

  this._particles[id] = {
    state: states[id],
    get: () => states[id],
    mutate: (mutation, payload) => {
      this.set({
        particleId: id,
        newState: mutators[id][mutation]({ state: states[id], payload }),
      });
    },
    set: (newState) => this.set({ particleId: id, newState }),
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
      //set properties to null to release all existing references to the particle
      //and it's properties to enable garbage collection and avoid memory leaks.
      this._particles[id].state = null;
      this._particles[id].previous = null;
      this._particles[id].get = null;
      this._particles[id].mutate = null;
      this._particles[id].set = null;
      this._particles[id].subscribe = null;
      this._particles[id].subscribe_instant = null;
      this._particles[id].detonate = null;

      delete this._particles[id];
      delete states[id];
      delete mutators[id];
      delete derivativeSubs[id];
      delete componentSubs[id];
      delete otherSubs[id];
      delete otherSubs_instant[id];
    },
  };

  if (previousState) this._particles[id].previous = states[id];
}
