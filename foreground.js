if (!window.utils) {
  window.utils = new Utils();

  if (/https:\/\/www.google.(ru|com)\/search/.test(window.location)) {
    new FixGoogleSearch();
  }
}
