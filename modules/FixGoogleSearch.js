var FixGoogleSearch = class {
  constructor() {
    //console.log('FixGoogleSearch constructor');

    this.applyFix();
  }

  applyFix() {
    let resultHeaders = $("h3");

    resultHeaders.each(
      (i, el) => {
        let $target = $(el).find('a');

        if (!$target.length) {
          $target = $(el).parent();
        }

        if (!i) {
          $target.focus();
        }

        $target.attr("tabindex", ++i);
      },
    );
  }
};
