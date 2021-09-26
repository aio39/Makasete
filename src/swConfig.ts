const swConfig = {
  onUpdate: (registration: ServiceWorkerRegistration): void => {
    registration.unregister().then(() => {
      window.location.reload();
    });
  },
};

export default swConfig;
