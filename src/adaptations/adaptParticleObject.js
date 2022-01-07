import {
  getCurrentStore,
  getCurrentStoreId,
  getCurrentEntity,
} from "./adaptations";

function adaptParticleObject(id) {
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
      let particle = currentEntity.getParticle({ id });
      currentStore.particles[currentStore.currentAdaptationIds.particle] =
        particle;
    }

    return currentStore.particles[currentStore.currentAdaptationIds.particle++];
  } else {
    throw new Error(
      "adaptParticleObject() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptParticleObject;
