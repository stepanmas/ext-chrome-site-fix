if (!window.utils) {
  window.utils = new Utils();
  const url = window.location.href;

  if (/https:\/\/www.google.(ru|com)\/search/.test(url) && !window.__googleSearch) {
    window.__googleSearch =  new FixGoogleSearch();
  }

  if (/bitmex.com/.test(url) && !window.__bitmex) {
    window.__bitmex =  new Bitmex();
  }
}
