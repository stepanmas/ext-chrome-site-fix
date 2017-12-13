class Utils
{
    constructor()
    {}

    get_url(url)
    {
        return chrome.extension.getURL(url)
    }

    get_tpl(sel='body', params={}, callback=()=>{})
    {
        $.get(
            this.get_url('popup.html'),
            function (res)
            {
                let html = $.parseHTML(res);

                $.each(
                    html,
                    function ()
                    {
                        if (this.nodeType === 1 && this.id === sel)
                        {
                            let tpl = doT.template($(this).html());

                            callback(tpl(params));
                            return false
                        }
                    }
                )
            }
        )
    }
}