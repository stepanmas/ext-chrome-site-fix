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
                $(el).parent().attr("tabindex", ++i);
            },
        );

        result_headers.first().parent().focus();
    }
};