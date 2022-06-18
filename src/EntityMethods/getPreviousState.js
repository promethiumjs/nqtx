export default function getPreviousState({
  particleId,
  derivativeId,
  firstTime,
}) {
  const _particle = this._particles[particleId];

  if (!_particle || _particle.previous === undefined) {
    console.warn(
      `The particle you are trying to access with id: ${particleId} either doesn't exist,
       has it's previous state set to undefined, or doesn't have it's "previousState" 
       flag set to true`
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
