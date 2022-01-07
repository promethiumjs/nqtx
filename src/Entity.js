import {
  setCurrentEntity,
  addAdaptationMethods,
  setPreventMultipleRenders,
  renderComponent,
} from "./adaptations/adaptations";

export default class Entity {
  constructor(initial) {
    //initialize particles(with initial states if any).
    this.particles = {
      states: initial ? initial.particleStates || {} : {},
      mutators: {},
      derivativeSubs: {},
      componentSubs: {},
      otherSubs: {},
      otherSubs_instant: {},
    };
    this._particles = {};

    //initialize derivatives(with initial states if any).
    this.derivatives = {
      states: initial ? initial.derivativeStates || {} : {},
      transforms: {},
      particleSubs: {},
      componentSubs: {},
      otherSubs: {},
      otherSubs_instant: {},
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
      otherSubs_instant[particleId].forEach((listener) => listener(newState));
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
    if (states[particleId] === undefined) {
      console.error(
        `The particle you are trying to access with id: ${particleId} doesn't exist`
      );
      throw new Error(`Cannot access state of particle: "${particleId}"`);
    }

    //add to derivative subscriptions if the derivative is now being initialized and hasn't
    //yet been added.
    if (firstTime) {
      const derivativeSubs = this.particles.derivativeSubs;
      if (derivativeSubs[particleId]) {
        if (derivativeSubs[particleId].includes(derivativeId)) {
          //return value if derivative has already been added to subscriptions
          return states[particleId];
        }
        derivativeSubs[particleId].push(derivativeId);
      } else {
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

  getPrevious({ particleId, derivativeId, firstTime }) {
    const _particle = this._particles[particleId];

    if (_particle.previous === undefined) {
      console.error(
        `The particle you are trying to access with id: ${particleId} either 
        doesn't exist or doesn't have it's "previousState" flag set to true`
      );
      throw new Error(
        `Cannot access previous state of particle: "${particleId}"`
      );
    }

    //add to derivative subscriptions if the derivative is now being initialized and hasn't
    //yet been added.
    if (firstTime) {
      const derivativeSubs = this.particles.derivativeSubs;
      if (derivativeSubs[particleId]) {
        if (derivativeSubs[particleId].includes(derivativeId)) {
          //return value if derivative has already been added to subscriptions.
          return _particle.previous;
        }
        derivativeSubs[particleId].push(derivativeId);
      } else {
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

    return _particle.previous;
  }

  update({ derivativeId }) {
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
      otherSubs_instant[derivativeId].forEach((listener) => listener(newState));
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
    if (!this._particles[id]) {
      console.error(
        `You are trying to access a particle with id: "${id}" that doesn't yet exist`
      );
      throw new Error(`Particle: "${id}" is not accessible`);
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

  setParticle({ id, initialState, mutator, previousState }) {
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

  particle({ id, initialState, mutator, overwrite, previousState }) {
    if (this._particles[id]) return this.getParticle({ id });

    //initialize particle based on provided data.
    const states = this.particles.states;
    if (!states[id])
      this.setParticle({ id, initialState, mutator, previousState });
    else {
      if (states[id] && !overwrite)
        this.setParticle({ id, mutator, previousState });
      else this.setParticle({ id, initialState, mutator, previousState });
    }

    return this.getParticle({ id });
  }

  getDerivative({ id, storeId }) {
    if (!this._derivatives[id]) {
      console.error(
        `You are trying to access a derivative with id: "${id}" that doesn't yet exist`
      );
      throw new Error(`Derivative: "${id}" is not accessible`);
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

  setDerivative({ id, initialState, transform, previousState }) {
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
          get: (particleId) =>
            this.get({ particleId, derivativeId: id, firstTime: true }),
          getPrevious: (particleId) =>
            this.getPrevious({ particleId, derivativeId: id, firstTime: true }),
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
          get: (particleId) => this.get({ particleId, derivativeId: id }),
          getPrevious: (particleId) =>
            this.getPrevious({ particleId, derivativeId: id }),
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

  derivative({ id, initialState, transform, overwrite, previousState }) {
    if (this._derivatives[id]) return this.getDerivative({ id });

    //initialize particle based on provided data.
    const states = this.derivatives.states;
    if (!states[id])
      this.setDerivative({ id, initialState, transform, previousState });
    else {
      if (states[id] && !overwrite)
        this.setDerivative({ id, transform, previousState });
      else this.setDerivative({ id, initialState, transform, previousState });
    }

    return this.getDerivative({ id });
  }

  getTrigger({ id }) {
    //return surrogate if the trigger is not ready.
    if (!this._triggers[id]) {
      console.error(
        `You are trying to access a trigger with id: "${id}" that doesn't yet exist`
      );
      throw new Error(`Trigger: "${id}" is not accessible`);
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
          try {
            const index = subscriptions[id].indexOf(listener);
            subscriptions[id].splice(index, 1);
          } catch (err) {}
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
