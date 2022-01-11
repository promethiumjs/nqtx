import { getCurrentStore, getCurrentEntity } from "./adaptations";

function adaptDerivativeContext(id) {
  const currentStore = getCurrentStore();
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
