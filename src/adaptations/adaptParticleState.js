import {
  getCurrentStore,
  getCurrentStoreId,
  getCurrentEntity,
} from "./adaptations";

function adaptParticleState(id) {
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
      let particle = currentEntity.getParticle({ id, storeId: currentStoreId });
      currentStore.particles[currentStore.currentAdaptationIds.particle] =
        particle[0];
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
