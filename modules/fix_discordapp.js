class Discordapp
{
    constructor()
    {
        console.log("Discordapp constructor");

        let _t = setInterval(
            () =>
            {
                if (document.querySelectorAll(".guild:not(.guilds-add)").length
                    || document.querySelectorAll("[class*='authBox']").length)
                {
                    clearInterval(_t);
                    this.page_ready();
                }
            },
            1000,
        );
    }

    page_ready()
    {
        console.log("page_ready");
        // document.querySelectorAll("[class*='contents']")[0].click()
    }
}