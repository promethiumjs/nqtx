export default function trigger({ id, initialSubscriptions }) {
  if (this._triggers[id]) return this.getTrigger({ id });

  this.setTrigger({ id, initialSubscriptions });

  return this.getTrigger({ id });
}
