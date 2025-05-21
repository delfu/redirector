function redirectGraphiteToGH(details) {
  const currentUrl = new URL(details.url);
  if (details.frameId === 0) {
    const newUrl = convertUrl(currentUrl.pathname);
    if (!newUrl) {
      return;
    }
    chrome.tabs.update(details.tabId, { url: newUrl });
  }
}

function convertUrl(pathname) {
  const urlParts = pathname.split("/");
  if (!pathname.startsWith("/github/pr") || urlParts.length < 6) {
    return null;
  }
  const owner = urlParts[3];
  const repo = urlParts[4];
  const pullRequest = urlParts[5];
  return `https://github.com/${repo}/${owner}/pull/${pullRequest}`;
}

chrome.webNavigation.onBeforeNavigate.addListener(redirectGraphiteToGH, {
  url: [{ hostContains: "graphite.dev" }],
});

chrome.tabs.onUpdated.addListener(function (tabId, _changeInfo, tab) {
  if (tab.url && tab.url.startsWith("https://app.graphite.dev/github/pr/")) {
    redirectGraphiteToGH({ url: tab.url, tabId, frameId: 0 });
  }
});
