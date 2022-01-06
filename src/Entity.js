import {
  setCurrentEntity,
  addAdaptationMethods,
  setPreventMultipleRenders,
  renderComponent,
} from "./adaptations/adaptations";

export default class Entity {
  constructor(initialParticleStates = {}) {
    //initialize particles(with initial states if any).
    this.particles = {
      states: initialParticleStates,
      mutators: {},
      derivativeSubs: {},
      componentSubs: {},
      otherSubs: {},
    };
    this._particles = {};

    //initialize derivatives(with initial states if any).
    this.derivatives = {
      states: {},
      transforms: {},
      particleSubs: {},
      componentSubs: {},
      otherSubs: {},
    };
    this._derivatives = {};

    //initialize triggers.
    this.triggers = {
      subscriptions: {},
    };
    this._triggers = {};
  }

  static create(initialParticleStates) {
    const entity = new Entity(initialParticleStates);
    setCurrentEntity(entity);

    return entity;
  }

  //obtain adaptation methods from nqtui to power nqtx adaptations.
  addAdaptationMethods(methods) {
    addAdaptationMethods(methods);
  }

  set({ particleId, newState }) {
    const _particle = this._particles[particleId];
    const states = this.particles.states;
    const derivativeSubs = this.particles.derivativeSubs;
    const componentSubs = this.particles.componentSubs;
    const otherSubs = this.particles.otherSubs;

    //the state has to be update in two places because of the presence of this.particles
    //and this._particles.
    _particle.state = newState;
    states[particleId] = newState;

    //update all subscribers while avoiding redundant renders.
    setPreventMultipleRenders(true);
    if (derivativeSubs[particleId])
      derivativeSubs[particleId].forEach((derivativeId) =>
        this.update({ derivativeId })
      );
    if (componentSubs[particleId]) {
      componentSubs[particleId].forEach((storeId) => renderComponent(storeId));
    }
    if (otherSubs[particleId])
      setTimeout(() =>
        otherSubs[particleId].forEach((listener) => listener(newState))
      );
    setPreventMultipleRenders(false);
  }

  get({ particleId, derivativeId, firstTime }) {
    const states = this.particles.states;

    //add to derivative subscriptions if the derivative is now being initialized.
    if (firstTime) {
      const derivativeSubs = this.particles.derivativeSubs;
      if (derivativeSubs[particleId])
        derivativeSubs[particleId].push(derivativeId);
      else {
        derivativeSubs[particleId] = [];
        derivativeSubs[particleId].push(derivativeId);
      }

      const particleSubs = this.derivatives.particleSubs;
      const unsubscribe = () => {
        //try catch to prevent crashing due to errors in case the
        //particle has already been deleted.
        try {
          const index = derivativeSubs[particleId].indexOf(derivativeId);
          derivativeSubs[particleId].splice(index, 1);
        } catch (err) {
          //throw error into the abyss.
        }
      };
      if (particleSubs[derivativeId])
        particleSubs[derivativeId].push(unsubscribe);
      else {
        particleSubs[derivativeId] = [];
        particleSubs[derivativeId].push(unsubscribe);
      }
    }

    return states[particleId];
  }

  update({ derivativeId }) {
    const _derivative = this._derivatives[derivativeId];
    const states = this.derivatives.states;
    const transforms = this.derivatives.transforms;
    const componentSubs = this.derivatives.componentSubs;
    const otherSubs = this.derivatives.otherSubs;

    //generate new state of derivative.
    let newState;
    try {
      newState = transforms[derivativeId]({
        get: (particleId) => this.get({ particleId, derivativeId }),
      });
    } catch (err) {
      newState = null;
    }

    //the state has to be update in two places because of the presence of this.particles
    //and this._particles.
    _derivative.state = newState;
    states[derivativeId] = newState;

    //update all subscribers(redundant renders have already been prevented in
    //the "set" function).
    if (componentSubs[derivativeId]) {
      componentSubs[derivativeId].forEach((storeId) =>
        renderComponent(storeId)
      );
    }
    if (otherSubs[derivativeId])
      setTimeout(() =>
        otherSubs[derivativeId].forEach((listener) => listener(newState))
      );
  }

  getParticleStates() {
    return this.particles.states;
  }

  getDerivativeStates() {
    return this.derivatives.states;
  }

  getParticle({ id, storeId }) {
    //return surrogate if the particle is not ready.
    if (!this._particles[id]) {
      const surrogate = {
        state: null,
        get: () => {},
        mutate: () => {},
        set: () => {},
        subscribe: () => {},
        detonate: () => {},
        unavailable: true,
      };

      if (storeId) {
        return [surrogate, null];
      }

      return surrogate;
    }

    //add storeId to component subscriptions if present.
    if (storeId) {
      const componentSubs = this.particles.componentSubs;
      if (componentSubs[id]) {
        componentSubs[id].push(storeId);
      } else {
        componentSubs[id] = [];
        componentSubs[id].push(storeId);
      }
      const unsubscribe = () => {
        //try catch to prevent crashing due to errors in case the
        //particle has already been deleted.
        try {
          const index = componentSubs[id].indexOf(storeId);
          componentSubs[id].splice(index, 1);
        } catch (err) {
          //throw error into the abyss.
        }
      };

      return [this._particles[id], unsubscribe];
    }

    return this._particles[id];
  }

  setParticle({ id, initialState, mutator }) {
    const states = this.particles.states;
    const mutators = this.particles.mutators;
    const derivativeSubs = this.particles.derivativeSubs;
    const componentSubs = this.particles.componentSubs;
    const otherSubs = this.particles.otherSubs;

    if (initialState !== undefined) {
      states[id] = initialState;
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
          const index = otherSubs[id].indexOf(listener);
          otherSubs[id].splice(index, 1);
        };
      },
      detonate: () => {
        //set properties to null to release all existing references to the particle
        //and it's properties to enable garbage collection and avoid memory leaks.
        this._particles[id].state = null;
        this._particles[id].get = null;
        this._particles[id].mutate = null;
        this._particles[id].set = null;
        this._particles[id].subscribe = null;
        this._particles[id].detonate = null;

        delete this._particles[id];
        delete states[id];
        delete mutators[id];
        delete derivativeSubs[id];
        delete componentSubs[id];
        delete otherSubs[id];
      },
    };
  }

  particle({ id, initialState, mutator, overwrite }) {
    if (this._particles[id]) return this.getParticle({ id });

    //initialize particle based on provided data.
    const states = this.particles.states;
    if (!states[id]) this.setParticle({ id, initialState, mutator });
    else {
      if (states[id] && !overwrite) this.setParticle({ id, mutator });
      else this.setParticle({ id, initialState, mutator });
    }

    return this.getParticle({ id });
  }

  getDerivative({ id, storeId }) {
    //return surrogate if the derivative is not ready.
    if (!this._derivatives[id]) {
      const surrogate = {
        state: null,
        get: () => {},
        subscribe: () => {},
        detonate: () => {},
        unavailable: true,
      };

      if (storeId) {
        return [surrogate, null];
      }

      return surrogate;
    }

    //add storeId to component subscriptions if present.
    if (storeId) {
      const componentSubs = this.derivatives.componentSubs;
      if (componentSubs[id]) {
        componentSubs[id].push(storeId);
      } else {
        componentSubs[id] = [];
        componentSubs[id].push(storeId);
      }
      const unsubscribe = () => {
        //try catch to prevent crashing due to errors in case the
        //derivative has already been deleted.
        try {
          const index = componentSubs[id].indexOf(storeId);
          componentSubs[id].splice(index, 1);
        } catch (err) {
          //throw error into the abyss.
        }
      };

      return [this._derivatives[id], unsubscribe];
    }

    return this._derivatives[id];
  }

  setDerivative({ id, transform }) {
    const states = this.derivatives.states;
    const transforms = this.derivatives.transforms;
    const particleSubs = this.derivatives.particleSubs;
    const componentSubs = this.derivatives.componentSubs;
    const otherSubs = this.derivatives.otherSubs;

    if (transform) {
      transforms[id] = transform;
    }

    try {
      states[id] = transforms[id]({
        get: (particleId) =>
          this.get({ particleId, derivativeId: id, firstTime: true }),
      });
    } catch (err) {
      states[id] = null;
    }

    this._derivatives[id] = {
      state: states[id],
      get: (payload) =>
        transforms[id]({
          get: (particleId) => this.get({ particleId, derivativeId: id }),
          payload,
        }),
      subscribe: (listener) => {
        if (otherSubs[id]) otherSubs[id].push(listener);
        else {
          otherSubs[id] = [];
          otherSubs[id].push(listener);
        }
        return () => {
          const index = otherSubs[id].indexOf(listener);
          otherSubs[id].splice(index, 1);
        };
      },
      detonate: () => {
        //set properties to null to release all existing references to the derivative
        //and it's properties to enable garbage collection and avoid memory leaks.
        this._derivatives[id].state = null;
        this._derivatives[id].get = null;
        this._derivatives[id].subscribe = null;
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
  }

  derivative({ id, transform }) {
    if (this._derivatives[id]) return this.getDerivative({ id });

    this.setDerivative({ id, transform });
    return this.getDerivative({ id });
  }

  getTrigger({ id }) {
    //return surrogate if the trigger is not ready.
    if (!this._triggers[id]) {
      return {
        invoke: () => {},
        subscribe: () => {},
        unavailable: true,
      };
    }

    return this._triggers[id];
  }

  setTrigger({ id, initialSubscriptions }) {
    const subscriptions = this.triggers.subscriptions;
    subscriptions[id] = initialSubscriptions || [];

    this._triggers[id] = {
      invoke: (...payload) => {
        subscriptions[id].forEach((listener) => listener(...payload));
      },
      subscribe: (listener) => {
        subscriptions[id].push(listener);
        return () => {
          const index = subscriptions[id].indexOf(listener);
          subscriptions[id].splice(index, 1);
        };
      },
      detonate: () => {
        //set properties to null to release all existing references to the trigger
        //and it's properties to enable garbage collection and avoid memory leaks.
        this._triggers[id].invoke = null;
        this._triggers[id].subscribe = null;

        delete this._triggers[id];
        delete subscriptions[id];
      },
    };
  }

  trigger({ id, initialSubscriptions }) {
    if (this._triggers[id]) return this.getTrigger({ id });

    this.setTrigger({ id, initialSubscriptions });
    return this.getTrigger({ id });
  }
}
