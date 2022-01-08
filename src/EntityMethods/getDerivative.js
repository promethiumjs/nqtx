export default function getDerivative({ id, storeId }) {
  if (!this._derivatives[id]) {
    console.error(
      `You are trying to access a derivative with id: "${id}" that doesn't yet exist`
    );
    throw new Error(`Derivative: "${id}" is not accessible`);
  }

  //add storeId to component subscriptions if present.
  if (storeId) {
    const componentSubs = this.derivatives.componentSubs;
    if (componentSubs[id]) {
      componentSubs[id].push(storeId);
    } else {
      componentSubs[id] = [];
      componentSubs[id].push(storeId);
    }
    const unsubscribe = () => {
      //try catch to prevent crashing due to errors in case the
      //derivative has already been deleted.
      try {
        const index = componentSubs[id].indexOf(storeId);
        componentSubs[id].splice(index, 1);
      } catch (err) {
        //throw error into the abyss.
      }
    };

    return [this._derivatives[id], unsubscribe];
  }

  return this._derivatives[id];
}
