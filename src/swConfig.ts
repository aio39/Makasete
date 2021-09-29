const swConfig = {
  onUpdate: (registration: ServiceWorkerRegistration): void => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', (event) => {
        if ((event.target as any).state === 'activated') {
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    // registration.unregister().then(() => {
    //   window.alert(
    //     '새로운 버전으로 업데이트 가능합니다. 열려져있는 MAKASETE 페이지를 전부 닫고 재실행해주세요.'
    //   );
    // });
  },
};

export default swConfig;
