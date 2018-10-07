var FixGoogleSearch = class
{
    constructor()
    {
        //console.log('FixGoogleSearch constructor');

        this.apply_fix();
    }

    apply_fix()
    {
        let result_headers = $("h3");

        result_headers.each(
            (i, el) =>
            {
                var target_el = $(el).find('a');

                if (!target_el.length) {
                    target_el = $(el).parent();
                }

                if (!i) {
                    target_el.focus();
                }
                target_el.attr("tabindex", ++i);
            },
        );
    }
};