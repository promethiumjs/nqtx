import {
  setCurrentEntity,
  addAdaptationMethods,
} from "./adaptations/adaptations";
import set from "./EntityMethods/set";
import get from "./EntityMethods/get";
import getPrevious from "./EntityMethods/getPrevious";
import update from "./EntityMethods/update";
import getParticle from "./EntityMethods/getParticle";
import setParticle from "./EntityMethods/setParticle";
import setDerivative from "./EntityMethods/setDerivative";
import getDerivative from "./EntityMethods/getDerivative";
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

    //initialize methods
    this.particle = particle.bind(this);
    this.derivative = derivative.bind(this);
    this.trigger = trigger.bind(this);
    this.set = set.bind(this);
    this.get = get.bind(this);
    this.getPrevious = getPrevious.bind(this);
    this.update = update.bind(this);
    this.getParticle = getParticle.bind(this);
    this.setParticle = setParticle.bind(this);
    this.getDerivative = getDerivative.bind(this);
    this.setDerivative = setDerivative.bind(this);
    this.getTrigger = getTrigger.bind(this);
    this.setTrigger = setTrigger.bind(this);
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

  getParticleStates() {
    return this.particles.states;
  }

  getDerivativeStates() {
    return this.derivatives.states;
  }
}
