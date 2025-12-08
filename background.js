chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;

  chrome.storage.sync.get(["rosterEnabled", "playerEnabled"], (res) => {
    if (res.rosterEnabled && /https:\/\/brokenbat\.org\/roster/.test(tab.url)) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["roster.js"],
      });
    }
    if (res.playerEnabled && /https:\/\/brokenbat\.org\/player/.test(tab.url)) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["player.js"],
      });
    }
  });
});
