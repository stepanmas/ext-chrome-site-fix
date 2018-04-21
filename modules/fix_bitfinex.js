class Bitfinex
{
    constructor()
    {
        console.log('Bitfinex constructor');

        this.page_ready(
            () =>
            {
                setInterval(
                    () =>
                    {

                        let rsi = this.get_rsi();

                        console.log(rsi);

                        if (rsi >= 84 || rsi <= 16)
                        {
                            this.alarm_play();
                        }

                    },
                    60 * 1000
                )
            }
        );
    }

    page_ready(cb)
    {
        let i = setInterval(
            () =>
            {
                if (this.get_rsi_node().length && this.get_rsi())
                {
                    clearInterval(i);
                    cb();
                }
            },
            1000
        );
    }

    get_rsi_node()
    {
        return $($('iframe')[0].contentWindow.document).find('.pane-legend-item-value.pane-legend-line').last();
    }

    get_rsi()
    {
        return parseFloat(this.get_rsi_node().text())
    }

    alarm_play()
    {
        chrome.runtime.sendMessage(
            {
                action: 'alarm_play'
            }
        );
    }
}