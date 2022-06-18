export default function getState({ particleId, derivativeId, firstTime }) {
  const states = this.particles.states;
  if (states[particleId] === undefined) {
    console.error(
      `The particle you are trying to access with id: ${particleId} doesn't exist or has its
       state set to undefined`
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
