class Discordapp
{
    constructor()
    {
        let _t = setInterval(
            () =>
            {
                if (document.querySelectorAll('.guild:not(.guilds-add)').length)
                {
                    clearInterval(_t);
                    this.page_ready()
                }
            },
            1000
        );
    }

    page_ready()
    {
        console.log('page_ready');
        this.emulator_change_channel()
    }

    emulator_change_channel()
    {
        let guild_len = document.querySelectorAll('.guild:not(.guilds-add)').length - 1;
        let range_time = window.utils.mt_rand(2, 15);

        console.log(`Range time: ${range_time}`);

        setInterval(
            () =>
            {
                document.querySelectorAll('.guild')[window.utils.mt_rand(0, guild_len)].querySelectorAll('a')[0].click()
            },
            range_time * 60 * 1000
        );
    }
}