export default function getCatalyst({ id }) {
  if (!this._catalysts[id]) {
    console.error(
      `You are trying to access a catalyst with id: "${id}" that doesn't yet exist`
    );
    throw new Error(`Catalyst: "${id}" is not accessible`);
  }

  return this._catalysts[id];
}
