export default function catalyst({ id, actions }) {
  if (this._catalysts[id]) return this.getCatalyst({ id });

  this.setCatalyst({ id, actions });

  return this.getCatalyst({ id });
}
