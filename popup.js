const rosterToggle = document.getElementById("rosterToggle");
const playerToggle = document.getElementById("playerToggle");
const refreshBtn = document.getElementById("refreshBtn");

// Load saved state
chrome.storage.sync.get(["rosterEnabled", "playerEnabled"], (res) => {
  rosterToggle.checked = !!res.rosterEnabled;
  playerToggle.checked = !!res.playerEnabled;
});

// Save changes
rosterToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ rosterEnabled: rosterToggle.checked });
});

playerToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ playerEnabled: playerToggle.checked });
});

// Refresh current tab
refreshBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
});
