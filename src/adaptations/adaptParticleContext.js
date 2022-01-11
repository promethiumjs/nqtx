import { getCurrentStore, getCurrentEntity } from "./adaptations";

function adaptParticleContext(id) {
  const currentStore = getCurrentStore();
  const currentEntity = getCurrentEntity();

  if (currentStore && !currentStore.particles) {
    currentStore.particles = [];
    currentStore.currentAdaptationIds.particle = 0;
  }

  if (currentStore) {
    if (
      !(currentStore.currentAdaptationIds.particle in currentStore.particles)
    ) {
      let particle = currentEntity.getParticle({ id });
      currentStore.particles[currentStore.currentAdaptationIds.particle] =
        particle;
    }

    return currentStore.particles[currentStore.currentAdaptationIds.particle++];
  } else {
    throw new Error(
      "adaptParticleContext() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptParticleContext;
