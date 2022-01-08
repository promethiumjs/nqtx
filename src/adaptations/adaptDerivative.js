import {
  getCurrentStore,
  getCurrentStoreId,
  getCurrentEntity,
} from "./adaptations";

function adaptDerivative(id) {
  const currentStore = getCurrentStore();
  const currentStoreId = getCurrentStoreId();
  const currentEntity = getCurrentEntity();

  if (currentStore && !currentStore.derivatives) {
    currentStore.derivatives = [];
    currentStore.currentAdaptationIds.derivative = 0;
  }

  if (currentStore && !currentStore.derivativeCleanups) {
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
      currentStore.derivatives[currentStore.currentAdaptationIds.derivative] = [
        derivative[0].state,
        derivative[0],
      ];
      currentStore.derivativeCleanups[
        currentStore.currentAdaptationIds.derivativeCleanup
      ] = derivative[1];
    }
    let derivative0 =
      currentStore.derivatives[currentStore.currentAdaptationIds.derivative];
    derivative0[0] = derivative0[1].state;

    return currentStore.derivatives[
      currentStore.currentAdaptationIds.derivative++
    ];
  } else {
    throw new Error(
      "adaptDerivative() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptDerivative;
