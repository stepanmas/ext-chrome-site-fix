if (!window.utils) {
  window.utils = new Utils();
  const url = window.location.href;

  if (/https:\/\/www.google.(ru|com)\/search/.test(url)) {
    new FixGoogleSearch();
  }
}
