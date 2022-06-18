import {
  getCurrentStore,
  getCurrentStoreId,
  getCurrentEntity,
} from "./adaptations";

function adaptDerivativeContext(id, subscribe) {
  const currentStore = getCurrentStore();
  const currentStoreId = getCurrentStoreId();
  const currentEntity = getCurrentEntity();

  if (currentStore && !currentStore.derivatives) {
    currentStore.derivatives = [];
    currentStore.currentAdaptationIds.derivative = 0;
  }

  if (currentStore) {
    if (
      !(
        currentStore.currentAdaptationIds.derivative in currentStore.derivatives
      )
    ) {
      if (subscribe === undefined || subscribe === true) {
        if (currentStore && !currentStore.derivativeCleanups) {
          currentStore.derivativeCleanups = [];
          currentStore.currentAdaptationIds.derivativeCleanup = 0;
        }

        let derivative = currentEntity.getDerivative({
          id,
          storeId: currentStoreId,
        });

        currentStore.derivatives[currentStore.currentAdaptationIds.derivative] =
          derivative[0];

        currentStore.derivativeCleanups[
          currentStore.currentAdaptationIds.derivativeCleanup
        ] = derivative[1];
      } else {
        let derivative = currentEntity.getDerivative({ id });

        currentStore.derivatives[currentStore.currentAdaptationIds.derivative] =
          derivative;
      }
    }

    return currentStore.derivatives[
      currentStore.currentAdaptationIds.derivative++
    ];
  } else {
    throw new Error(
      "adaptDerivativeContext() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptDerivativeContext;
