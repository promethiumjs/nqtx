import {
  getCurrentStore,
  getCurrentStoreId,
  getCurrentEntity,
} from "./adaptations";
import addNqtxUpdate from "./nqtxUpdates";

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

      if (
        currentStore.particles[currentStore.currentAdaptationIds.particle]
          .unavailable
      ) {
        console.log(
          currentStore.particles[currentStore.currentAdaptationIds.particle]
            .unavailable
        );
        addNqtxUpdate(currentStoreId);
      }
    }
    if (
      currentStore.particles[currentStore.currentAdaptationIds.particle]
        .unavailable
    ) {
      let particle = currentEntity.getParticle({ id });
      currentStore.particles[currentStore.currentAdaptationIds.particle] =
        particle;
      console.log(particle);
    }

    return currentStore.particles[currentStore.currentAdaptationIds.particle++];
  } else {
    throw new Error(
      "adaptParticleObject() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptParticleObject;
