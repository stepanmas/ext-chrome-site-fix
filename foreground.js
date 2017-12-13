window.utils = new Utils();

if (/https:\/\/www.google.ru\/search/.test(window.location))
    new FixGoogleSearch();

else if (window.location.hostname === 'bittrex.com')
     new Bittrex();
