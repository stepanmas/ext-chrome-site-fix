const files = [
    'vendor/jquery.js',
    // ========
    'modules/fix_google_search.js',
    // ========
    'foreground.js'
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