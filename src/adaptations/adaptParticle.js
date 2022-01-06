import {
  getCurrentStore,
  getCurrentStoreId,
  getCurrentEntity,
} from "./adaptations";
import addNqtxUpdate from "./nqtxUpdates";

function adaptParticle(id) {
  const currentStore = getCurrentStore();
  const currentStoreId = getCurrentStoreId();
  const currentEntity = getCurrentEntity();

  if (currentStore && !currentStore.particles) {
    currentStore.particles = [];
    currentStore.currentAdaptationIds.particle = 0;
    currentStore.particleCleanups = [];
    currentStore.currentAdaptationIds.particleCleanup = 0;
  }

  if (currentStore) {
    if (
      !(currentStore.currentAdaptationIds.particle in currentStore.particles)
    ) {
      let particle = currentEntity.getParticle({ id, storeId: currentStoreId });
      currentStore.particles[currentStore.currentAdaptationIds.particle] = [
        particle[0].state,
        particle[0],
      ];
      currentStore.particleCleanups[
        currentStore.currentAdaptationIds.particleCleanup
      ] = particle[1];

      if (
        currentStore.particles[currentStore.currentAdaptationIds.particle][1]
          .unavailable
      ) {
        addNqtxUpdate(currentStoreId);
      }
    }
    if (
      currentStore.particles[currentStore.currentAdaptationIds.particle][1]
        .unavailable
    ) {
      let particle = currentEntity.getParticle({ id, storeId: currentStoreId });
      currentStore.particles[currentStore.currentAdaptationIds.particle] = [
        particle[0].state,
        particle[0],
      ];
      currentStore.particleCleanups[
        currentStore.currentAdaptationIds.particleCleanup
      ] = particle[1];
    }

    let particle0 =
      currentStore.particles[currentStore.currentAdaptationIds.particle];
    particle0[0] = particle0[1].state;

    return currentStore.particles[currentStore.currentAdaptationIds.particle++];
  } else {
    throw new Error(
      "adaptParticle() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptParticle;
