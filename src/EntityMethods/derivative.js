export default function derivative({
  id,
  initialState,
  transform,
  overwrite,
  previousState,
}) {
  if (this._derivatives[id]) return this.getDerivative({ id });

  //initialize particle based on provided data.
  const states = this.derivatives.states;
  if (!states[id])
    this.setDerivative({ id, initialState, transform, previousState });
  else {
    if (states[id] && !overwrite)
      this.setDerivative({ id, transform, previousState });
    else this.setDerivative({ id, initialState, transform, previousState });
  }

  return this.getDerivative({ id });
}
