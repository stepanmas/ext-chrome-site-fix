const files = [
  "vendor/jquery.js",
  "vendor/doT.min.js",

  "modules/utils.js",
  "modules/FixGoogleSearch.js",

  "foreground.js",
];

chrome.tabs.onUpdated.addListener(
  function (tabId, info) {
    if (info.status === "complete") {
      for (let ph of files) {
        chrome.tabs.executeScript(
          tabId,
          { file: ph },
        );
      }
    }
  },
);

/*chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse)
    {
        let xhr = new XMLHttpRequest();

        if (request.action === "example")
        {}
    },
);*/
