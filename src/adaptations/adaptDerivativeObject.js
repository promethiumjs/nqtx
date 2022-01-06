import {
  getCurrentStore,
  getCurrentStoreId,
  getCurrentEntity,
} from "./adaptations";
import addNqtxUpdate from "./nqtxUpdates";

function adaptDerivativeObject(id) {
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
      let derivative = currentEntity.getDerivative({ id });
      currentStore.derivatives[currentStore.currentAdaptationIds.derivative] =
        derivative;

      if (
        currentStore.derivatives[currentStore.currentAdaptationIds.derivative]
          .unavailable
      ) {
        addNqtxUpdate(currentStoreId);
      }
    }
    if (
      currentStore.derivatives[currentStore.currentAdaptationIds.derivative]
        .unavailable
    ) {
      let derivative = currentEntity.getDerivative({ id });
      currentStore.derivatives[currentStore.currentAdaptationIds.derivative] =
        derivative;
    }

    return currentStore.derivatives[
      currentStore.currentAdaptationIds.derivative++
    ];
  } else {
    throw new Error(
      "adaptDerivativeObject() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptDerivativeObject;