const files = [
    "vendor/jquery.js.js",
    "vendor/doT.min.js",

    "modules/utils.js",
    "modules/fix_google_search.js",
    "modules/fix_bittrex.js",

    "foreground.js"
];

chrome.tabs.onUpdated.addListener(
    function (tabId, info)
    {
        if (info.status === "complete")
        {
            for (let ph of files)
            {
                chrome.tabs.executeScript(
                    tabId,
                    {file: ph}
                );
            }
        }
    }
);