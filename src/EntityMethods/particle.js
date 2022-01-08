export default function particle({
  id,
  initialState,
  mutator,
  overwrite,
  previousState,
}) {
  if (this._particles[id]) return this.getParticle({ id });

  //initialize particle based on provided data.
  const states = this.particles.states;
  if (!states[id])
    this.setParticle({ id, initialState, mutator, previousState });
  else {
    if (states[id] && !overwrite)
      this.setParticle({ id, mutator, previousState });
    else this.setParticle({ id, initialState, mutator, previousState });
  }

  return this.getParticle({ id });
}
