function showLoadingScreen() {
  const container = document.getElementById("loadingScreen");
  container.innerHTML = getLoadingScreenTemplate(); 
  container.classList.remove("hidden");
}

function hideLoadingScreen() {
  const container = document.getElementById("loadingScreen");
  container.classList.add("hidden");
  container.innerHTML = ""; 
}

async function showLoadingScreenWithloadingTime(promise, delay = 3000) {
  showLoadingScreen();
  let timerPromise = new Promise((resolve) => setTimeout(resolve, delay));
  await Promise.all([promise, timerPromise]);
  hideLoadingScreen();
}

document.addEventListener('DOMContentLoaded', async () => {
  const fakeLoad = new Promise(resolve => setTimeout(resolve, 1500));
  await showLoadingScreenWithloadingTime(fakeLoad, 2000);
});