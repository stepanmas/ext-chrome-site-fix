var Utils = class {
  constructor() {
    // console.log("Utils constructor");
  }

  getUrl(url) {
    return chrome.extension.getURL(url);
  }

  getTpl(sel = "body", params = {}, callback = $.noop) {
    $.get(
      this.getUrl("popup.html"),
      function (res) {
        let html = $.parseHTML(res);

        $.each(
          html,
          function () {
            if (this.nodeType === 1 && this.id === sel) {
              let tpl = doT.template($(this).html());

              callback(tpl(params));
              return false;
            }
          },
        );
      },
    );
  }

  $(selector) {
    return document.querySelector(selector);
  }
};
