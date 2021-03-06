export default function getTrigger({ id }) {
  if (!this._triggers[id]) {
    console.error(
      `You are trying to access a trigger with id: "${id}" that doesn't yet exist`
    );
    throw new Error(`Trigger: "${id}" is not accessible`);
  }

  return this._triggers[id];
}
