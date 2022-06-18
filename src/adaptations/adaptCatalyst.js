import { getCurrentStore, getCurrentEntity } from "./adaptations";

function adaptCatalyst(id) {
  const currentStore = getCurrentStore();
  const currentEntity = getCurrentEntity();

  if (currentStore && !currentStore.catalysts) {
    currentStore.catalysts = [];
    currentStore.currentAdaptationIds.catalyst = 0;
  }

  if (currentStore) {
    if (
      !(currentStore.currentAdaptationIds.catalyst in currentStore.catalysts)
    ) {
      currentStore.catalysts[currentStore.currentAdaptationIds.catalyst] =
        currentEntity.getCatalyst({ id });
    }

    return currentStore.catalysts[currentStore.currentAdaptationIds.catalyst++];
  } else {
    throw new Error(
      "adaptCatalyst() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptCatalyst;
