import {
  getCurrentStore,
  getCurrentStoreId,
  getCurrentEntity,
} from "./adaptations";

function adaptDerivativeState(id) {
  const currentStore = getCurrentStore();
  const currentStoreId = getCurrentStoreId();
  const currentEntity = getCurrentEntity();

  if (currentStore && !currentStore.derivatives) {
    currentStore.derivatives = [];
    currentStore.currentAdaptationIds.derivative = 0;
    currentStore.derivativeCleanups = [];
    currentStore.currentAdaptationIds.derivativeCleanup = 0;
  }

  if (currentStore) {
    if (
      !(
        currentStore.currentAdaptationIds.derivative in currentStore.derivatives
      )
    ) {
      let derivative = currentEntity.getDerivative({
        id,
        storeId: currentStoreId,
      });
      currentStore.derivatives[currentStore.currentAdaptationIds.derivative] =
        derivative[0];
    }

    return currentStore.derivatives[
      currentStore.currentAdaptationIds.derivative++
    ].state;
  } else {
    throw new Error(
      "adaptDerivativeState() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptDerivativeState;
