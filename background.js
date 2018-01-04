const files = [
    "vendor/jquery.js",
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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse)
    {
        let xhr = new XMLHttpRequest();

        if (request.action === "get_balance")
        {
            xhr.open('GET', `http://stepych.ddns.net/api/trader/balance/${request.pair}/`, false);
            xhr.onreadystatechange = function (res)
            {
                if (xhr.status === 200)
                    sendResponse(JSON.parse(res.currentTarget.response));
            };
            xhr.send();
        }
        else if (request.action === "get_history")
        {
            xhr.open('GET', `http://stepych.ddns.net/api/trader/history/${request.pair}/`, false);
            xhr.onreadystatechange = function (res)
            {
                if (xhr.status === 200)
                    sendResponse(JSON.parse(res.currentTarget.response));
            };
            xhr.send();
        }

        else if (request.action === "get_price_cmc")
        {
            xhr.open('GET', `https://api.coinmarketcap.com/v1/ticker/${request.pair}/`, false);
            xhr.onreadystatechange = function (res)
            {
                if (xhr.status === 200)
                    sendResponse(JSON.parse(res.currentTarget.response));
            };
            xhr.send();
        }
    }
);
