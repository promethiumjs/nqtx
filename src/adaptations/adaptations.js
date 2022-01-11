let currentEntity;

function setCurrentEntity(entity) {
  currentEntity = entity;
}

function getCurrentEntity() {
  return currentEntity;
}

let getCurrentStoreMethod;

function getCurrentStore(storeId) {
  return getCurrentStoreMethod(storeId);
}

let getCurrentStoreIdMethod;

function getCurrentStoreId() {
  return getCurrentStoreIdMethod();
}

let renderComponentMethod;

function renderComponent(storeId) {
  renderComponentMethod(storeId);
}

function addAdaptationMethods({
  getCurrentStore,
  getCurrentStoreId,
  renderComponent,
}) {
  getCurrentStoreMethod = getCurrentStore;
  getCurrentStoreIdMethod = getCurrentStoreId;
  renderComponentMethod = renderComponent;
}

export {
  setCurrentEntity,
  getCurrentEntity,
  getCurrentStore,
  getCurrentStoreId,
  renderComponent,
  addAdaptationMethods,
};
