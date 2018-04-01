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
                console.log('Change channel');
                document.querySelectorAll('.guild')[window.utils.mt_rand(0, guild_len)].querySelectorAll('a')[0].click()
            },
            range_time * 60 * 1000
        );

        setInterval(
            () => {
                let rooms = document.querySelectorAll('*[class*="content-"]');
                let el = document.querySelectorAll('*[class*="content-"]')[window.utils.mt_rand(0, rooms.length - 1)];

                console.log('Change room');

                if (!el.querySelectorAll('[name="ChannelVoice"]').length)
                {
                    el.click();
                    setTimeout(
                    () => {
                        let scroller = document.querySelectorAll('.scroller');

                        if (scroller.length)
                            scroller[1].scrollTop = scroller[1].scrollHeight;
                    }, 1000
                )
                }
            },
            window.utils.mt_rand(1, 4) * 60 * 1000
        );

        setInterval(
            () => {
                document.title = document.querySelectorAll('.username')[0].innerText;
            },
            1000
        )
    }
}