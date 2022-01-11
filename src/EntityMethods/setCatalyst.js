export default function setCatalyst({ id, actions }) {
  const actionStore = this.catalysts.actions;

  if (actions) {
    actionStore[id] = actions;
  }

  this._catalysts[id] = {
    dispatch: (action, payload) => {
      actionStore[id][action]({
        getContext: (particleId) => this.getContext({ particleId }),
        payload,
      });
    },
    detonate: () => {
      //set properties to null to release all existing references to the catalyst
      //and it's properties to enable garbage collection and avoid memory leaks.
      this._catalysts[id].dispatch = null;
      this._catalysts[id].detonate = null;

      delete this._catalysts[id];
      delete actionStore[id];
    },
  };
}
