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

let getPreventMultipleRendersMethod;

function getPreventMultipleRenders() {
  return getPreventMultipleRendersMethod;
}

let setPreventMultipleRendersMethod;

function setPreventMultipleRenders(boolean) {
  setPreventMultipleRendersMethod(boolean);
}

function addAdaptationMethods({
  getCurrentStore,
  getCurrentStoreId,
  renderComponent,
  getPreventMultipleRenders,
  setPreventMultipleRenders,
}) {
  getCurrentStoreMethod = getCurrentStore;
  getCurrentStoreIdMethod = getCurrentStoreId;
  renderComponentMethod = renderComponent;
  getPreventMultipleRendersMethod = getPreventMultipleRenders;
  setPreventMultipleRendersMethod = setPreventMultipleRenders;
}

export {
  setCurrentEntity,
  getCurrentEntity,
  getCurrentStore,
  getCurrentStoreId,
  renderComponent,
  addAdaptationMethods,
  getPreventMultipleRenders,
  setPreventMultipleRenders,
};
