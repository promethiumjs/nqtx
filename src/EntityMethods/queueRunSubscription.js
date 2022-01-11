const subscriptionSet = new Set();

export default function queueRunSubscription(subscription) {
  subscriptionSet.add(subscription);

  if (subscriptionSet.size === 1) {
    setTimeout(() => {
      const subscriptionArray = [...subscriptionSet];
      subscriptionSet.clear();
      subscriptionArray.forEach((subscription) => subscription());
    });
  }
}
