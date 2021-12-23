class Entity {
  constructor(initialParticleStates) {
    this.particles = {
      states: initialParticleStates || {},
      mutators: {},
      derivativeSubs: {},
      componentSubs: {},
      otherSubs: {},
    };

    this.derivatives = {
      states: {},
      componentSubs: {},
      otherSubs: {},
    };

    this.triggers = {};
  }

  set(particeId, newState) {
    const particles = this.particles;
    particles.states[particeId] = newState;

    if (particles.derivativeSubs[particeId]);
    if (particles.componentSubs[particeId]);
    if (particles.otherSubs[particeId]);
  }

  particle({ particeId, initialValue, mutator }) {
    const particles = this.particles;
    if (particles.states[particeId]) return;

    particles.states[particeId] = initialValue;
    particles.mutators[particeId] = mutator;
  }

  get(particleId, derivativeId, firstTime) {
    const particles = this.particles;

    if (firstTime) {
      const particleDerivativeSubs = particles.derivativeSubs[particleId];
      if (particleDerivativeSubs) particleDerivativeSubs.push(derivativeId);
      else {
        particleDerivativeSubs = [];
        particleDerivativeSubs.push(derivativeId);
      }
    }

    return particles.states[particleId];
  }

  derivative({ derivativeId, transform }) {
    const derivativeStates = this.derivatives.states;
    if (derivativeStates[derivativeId]) return;

    derivativeStates[derivativeId] = transform({
      get: (id) => this.get(id, true),
    });
  }

  trigger(id) {
    const triggers = this.triggers;
    if (triggers[id]) return;

    triggers[id] = [];
  }
}
