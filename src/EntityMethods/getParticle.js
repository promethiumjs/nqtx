export default function getParticle({ id, storeId }) {
  if (!this._particles[id]) {
    console.error(
      `You are trying to access a particle with id: "${id}" that doesn't yet exist`
    );
    throw new Error(`Particle: "${id}" is not accessible`);
  }

  //add storeId to component subscriptions if present.
  if (storeId) {
    const componentSubs = this.particles.componentSubs;
    if (componentSubs[id]) {
      componentSubs[id].push(storeId);
    } else {
      componentSubs[id] = [];
      componentSubs[id].push(storeId);
    }
    const unsubscribe = () => {
      //try catch to prevent crashing due to errors in case the
      //particle has already been deleted.
      try {
        const index = componentSubs[id].indexOf(storeId);
        componentSubs[id].splice(index, 1);
      } catch (err) {
        //throw error into the abyss.
      }
    };

    return [this._particles[id], unsubscribe];
  }

  return this._particles[id];
}
