import {
  getCurrentStore,
  getCurrentStoreId,
  getCurrentEntity,
} from "./adaptations";

function adaptParticleState(id, subscribe) {
  const currentStore = getCurrentStore();
  const currentStoreId = getCurrentStoreId();
  const currentEntity = getCurrentEntity();

  if (currentStore && !currentStore.particles) {
    currentStore.particles = [];
    currentStore.currentAdaptationIds.particle = 0;
  }

  if (currentStore) {
    if (
      !(currentStore.currentAdaptationIds.particle in currentStore.particles)
    ) {
      if (subscribe === undefined || subscribe === true) {
        if (currentStore && !currentStore.particleCleanups) {
          currentStore.particleCleanups = [];
          currentStore.currentAdaptationIds.particleCleanup = 0;
        }
        let particle = currentEntity.getParticle({
          id,
          storeId: currentStoreId,
        });

        currentStore.particles[currentStore.currentAdaptationIds.particle] =
          particle[0];

        currentStore.particleCleanups[
          currentStore.currentAdaptationIds.particleCleanup
        ] = particle[1];
      } else {
        let particle = currentEntity.getParticle({ id });

        currentStore.particles[currentStore.currentAdaptationIds.particle] =
          particle;
      }
    }

    return currentStore.particles[currentStore.currentAdaptationIds.particle++]
      .state;
  } else {
    throw new Error(
      "adaptParticleState() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptParticleState;
