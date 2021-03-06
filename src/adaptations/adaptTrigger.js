import { getCurrentStore, getCurrentEntity } from "./adaptations";

function adaptTrigger(id) {
  const currentStore = getCurrentStore();
  const currentEntity = getCurrentEntity();

  if (currentStore && !currentStore.triggers) {
    currentStore.triggers = [];
    currentStore.currentAdaptationIds.trigger = 0;
  }

  if (currentStore) {
    if (!(currentStore.currentAdaptationIds.trigger in currentStore.triggers)) {
      currentStore.triggers[currentStore.currentAdaptationIds.trigger] =
        currentEntity.getTrigger({ id });
    }

    return currentStore.triggers[currentStore.currentAdaptationIds.trigger++];
  } else {
    throw new Error(
      "adaptTrigger() can only be used inside a Component or a Custom Adaptation."
    );
  }
}

export default adaptTrigger;
