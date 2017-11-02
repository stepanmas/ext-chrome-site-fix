class FixGoogleSearch
{
    constructor()
    {
        this.is_google_search = /https:\/\/www.google.ru\/search/.test(window.location);

        if (this.is_google_search)
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