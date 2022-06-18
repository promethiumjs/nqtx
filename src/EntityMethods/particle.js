export default function particle({
  id,
  initialState,
  mutations,
  actions,
  overwrite,
  previousState,
}) {
  if (this._particles[id]) return this.getParticle({ id });

  //initialize particle based on provided data.
  const states = this.particles.states;
  if (!states[id])
    this.setParticle({ id, initialState, mutations, actions, previousState });
  else {
    if (states[id] && !overwrite)
      this.setParticle({ id, mutations, actions, previousState });
    else
      this.setParticle({ id, initialState, mutations, actions, previousState });
  }

  return this.getParticle({ id });
}
