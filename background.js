// HTML to TXT: https://www.w3.org/services/html2txt
// Example code: https://github.com/MitchellMarkGeorge/EmailThisPage
// Text icons created by edt.im - Flaticon.com

chrome.runtime.onInstalled.addListener(function ({ reason }) {
  if (reason === "install") {
    // in this case, we know that there are no context menu items hanging around
    createContextMenu();
  } else {
  // like extension update or chrome update
  // basically remove all the curreent context menu items and add them again
  // this prevents the extension from trying to add the same context menu again, which causes an error
    chrome.contextMenus.removeAll(() => {
      createContextMenu();
    });
  }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "html2txtThisPage" && info.pageUrl) {
    html2txtLink(info.pageUrl, tab.index);
  } else if (info.menuItemId === "html2txtThisLink" && info.linkUrl) {
    html2txtLink(info.linkUrl, tab.index);
  }
});

chrome.action.onClicked.addListener(function (tab) {
  if (tab) {
    // use pendingUrl if the normal url is not avalible (like the page is loading)
    if (tab.url) {
      html2txtLink(tab.url, tab.index);
    } else if (tab.pendingUrl) {
      html2txtLink(tab.pendingUrl, tab.index);
    }
  }
});

function html2txtLink(url, index) {
  let html2txtURL = new URL("https://www.w3.org/services/html2txt");
  html2txtURL.searchParams.set("url", url);
  html2txtURL.searchParams.set("noinlinerefs", "on");
  html2txtURL.searchParams.set("endrefs", "on");
  // https://stackoverflow.com/questions/35780106/opening-tab-next-to-active-tab#73201419
  chrome.tabs.create({ url: html2txtURL.toString(), index: index + 1 });
}

function createContextMenu() {
  chrome.contextMenus.create({
    id: "html2txtThisPage",
    title: "View page as txt",
    type: "normal",
  });

  chrome.contextMenus.create({
    id: "html2txtThisLink",
    title: "View link as txt",
    type: "normal",
    contexts: ["link"],
  });
}
