class FixGoogleSearch
{
    constructor()
    {
        //console.log('FixGoogleSearch constructor');

        this.apply_fix()
    }

    apply_fix()
    {
        let result_headers = $('h3 a');

        result_headers.each(
            (i, el) =>
            {
                $(el).attr('tabindex', ++i)
            }
        );

        result_headers.first().focus();
    }
}