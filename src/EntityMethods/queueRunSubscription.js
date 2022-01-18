const subscriptionArray1 = [];
const subscriptionArray2 = [];
let one = true;

export default function queueRunSubscription(subscription) {
  if (one) {
    subscriptionArray1.push(subscription);

    if (subscriptionArray1.length === 1) {
      setTimeout(() => {
        one = false;
        subscriptionArray1.forEach((subscription) => subscription());
        subscriptionArray1.length = 0;
      });
    }
  } else {
    subscriptionArray2.push(subscription);

    if (subscriptionArray2.length === 1) {
      setTimeout(() => {
        one = true;
        subscriptionArray2.forEach((subscription) => subscription());
        subscriptionArray2.length = 0;
      });
    }
  }
}
