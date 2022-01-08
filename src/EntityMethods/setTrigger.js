export default function setTrigger({ id, initialSubscriptions }) {
  const subscriptions = this.triggers.subscriptions;
  subscriptions[id] = initialSubscriptions || [];

  this._triggers[id] = {
    invoke: (...payload) => {
      subscriptions[id].forEach((listener) => listener(...payload));
    },
    subscribe: (listener) => {
      subscriptions[id].push(listener);
      return () => {
        try {
          const index = subscriptions[id].indexOf(listener);
          subscriptions[id].splice(index, 1);
        } catch (err) {}
      };
    },
    detonate: () => {
      //set properties to null to release all existing references to the trigger
      //and it's properties to enable garbage collection and avoid memory leaks.
      this._triggers[id].invoke = null;
      this._triggers[id].subscribe = null;

      delete this._triggers[id];
      delete subscriptions[id];
    },
  };
}
