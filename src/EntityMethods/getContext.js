export default function getContext({ particleId }) {
  const $context = this._particles[particleId];

  if ($context === undefined) {
    console.error(
      `The particle you are trying to access with id: ${particleId} doesn't exist`
    );
    throw new Error(`Cannot access context of particle: "${particleId}"`);
  }

  return $context;
}
