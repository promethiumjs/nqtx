import {
  setCurrentEntity,
  addAdaptationMethods,
} from "./adaptations/adaptations";
import set from "./EntityMethods/set";
import getContext from "./EntityMethods/getContext";
import getState from "./EntityMethods/getState";
import getPreviousState from "./EntityMethods/getPreviousState";
import update from "./EntityMethods/update";
import getParticle from "./EntityMethods/getParticle";
import setParticle from "./EntityMethods/setParticle";
import setDerivative from "./EntityMethods/setDerivative";
import getDerivative from "./EntityMethods/getDerivative";
import catalyst from "./EntityMethods/catalyst";
import getCatalyst from "./EntityMethods/getCatalyst";
import setCatalyst from "./EntityMethods/setCatalyst";
import getTrigger from "./EntityMethods/getTrigger";
import setTrigger from "./EntityMethods/setTrigger";
import particle from "./EntityMethods/particle";
import derivative from "./EntityMethods/derivative";
import trigger from "./EntityMethods/trigger";
export default class Entity {
  constructor(initial) {
    //initialize particles(with initial states if any).
    this.particles = {
      states: initial ? initial.particleStates || {} : {},
      mutations: {},
      actions: {},
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

    //initialize catalysts.
    this.catalysts = {
      actions: {},
    };
    this._catalysts = {};

    //initialize methods
    this.particle = particle.bind(this);
    this.derivative = derivative.bind(this);
    this.catalyst = catalyst.bind(this);
    this.trigger = trigger.bind(this);
    this.set = set.bind(this);
    this.getContext = getContext.bind(this);
    this.getState = getState.bind(this);
    this.getPreviousState = getPreviousState.bind(this);
    this.update = update.bind(this);
    this.getParticle = getParticle.bind(this);
    this.setParticle = setParticle.bind(this);
    this.getDerivative = getDerivative.bind(this);
    this.setDerivative = setDerivative.bind(this);
    this.getCatalyst = getCatalyst.bind(this);
    this.setCatalyst = setCatalyst.bind(this);
    this.getTrigger = getTrigger.bind(this);
    this.setTrigger = setTrigger.bind(this);
  }

  static create(initial) {
    const entity = new Entity(initial);
    setCurrentEntity(entity);

    return entity;
  }

  //obtain adaptation methods from nqtui to power nqtx adaptations.
  addAdaptationMethods(methods) {
    addAdaptationMethods(methods);
  }

  getParticleStates() {
    return this.particles.states;
  }

  setParticleStates(particleStates) {
    Object.assign(this.particles.states, particleStates);
    Object.keys(particleStates).forEach((particleId) =>
      this.set({ particleId, newState: particleStates[particleId] })
    );
  }

  setDerivativeStates(derivativeStates) {
    Object.assign(this.derivatives.states, derivativeStates);
  }

  getDerivativeStates() {
    return this.derivatives.states;
  }
}
