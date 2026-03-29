export const processPayment = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: "success" });
    }, 2000);
  });
};
