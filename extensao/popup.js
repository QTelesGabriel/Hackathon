document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".power-button");
    console.log("oi");
    if (!chrome?.storage?.local) {
      console.error("chrome.storage.local não está disponível!");
      return;
    }
  
    button.addEventListener("click", () => {
      chrome.storage.local.get(["termBreakerEnabled"], (result) => {
        const current = result.termBreakerEnabled ?? false;
        const newValue = !current;
  
        chrome.storage.local.set({ termBreakerEnabled: newValue }, () => {
          alert(newValue ? "Ativado!" : "Desativado!");
        });
      });
    });
  });
