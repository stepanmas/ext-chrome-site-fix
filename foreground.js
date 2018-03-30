if (!window.utils) {
    window.utils = new Utils();

    if (/https:\/\/www.google.(ru|com)\/search/.test(window.location))
        new FixGoogleSearch();

// else if (window.location.hostname === 'bittrex.com')
//      new Bittrex();

    else if (window.location.hostname.includes('bitfinex.com'))
        new Bitfinex();

    else if (window.location.hostname.includes('discordapp.com'))
        new Discordapp();
}