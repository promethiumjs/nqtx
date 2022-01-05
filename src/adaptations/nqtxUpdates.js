import { renderComponent, setPreventMultipleRenders } from "./adaptations";

const nqtxUpdateArray = [];

function addNqtxUpdate(storeId) {
  nqtxUpdateArray.push(storeId);

  if (nqtxUpdateArray.length === 1) {
    queueMicrotask(() => {
      const newNqtxUpdateArray = [...nqtxUpdateArray];
      nqtxUpdateArray.length = 0;
      setPreventMultipleRenders(true);
      newNqtxUpdateArray.forEach((storeId) => renderComponent(storeId));
      setPreventMultipleRenders(false);
    });
  }
}

export default addNqtxUpdate;
