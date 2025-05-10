chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ termBreakerEnabled: true }, () => {
      console.log("termBreakerEnabled set to true");
    });
  });
  