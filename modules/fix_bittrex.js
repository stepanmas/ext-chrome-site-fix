class Bittrex
{
    constructor()
    {
        this._is_trade_usd = true;

        this.page_ready(
            () =>
            {
                // page of coin
                if ($('#rowChart').length)
                {
                    this.current_pair = this._format_code();
                    this.current_pair_usd = this._format_code_usd();

                    this.update_spread();
                    this.remove_excess();
                    this.update_balance_and_history();
                }
            }
        );
    }

    _format_code()
    {
        let match = location.search.match(/=(.+)$/)[1];

        match = match.split('-');

        let start = match[1];
        let end = match[0];

        if (end === 'USDT')
        {
            this._is_trade_usd = false;
            end = 'USD';
        }

        return `${start}-${end}`
    }

    _format_code_usd()
    {
        let match = this.current_pair.split('-');

        if (match[1] !== 'USD')
            return `${match[0]}-USD`;

        return this.current_pair
    }

    update_spread()
    {
        setInterval(
            () =>
            {
                let buy_price = this.get_buy_price();
                let current_price = this.get_current_price();
                let result = 99.5 - buy_price * 100 / current_price;

                if (buy_price)
                    this.push_item('fb_spread', 'Spread', buy_price, result.toFixed(2) + '%', buy_price > 0)
            },
            1000
        )
    }

    push_item(cs, label, price_high, price_low, direction_up = true)
    {
        window.utils.get_tpl(
            'tpl_fb_spread',
            {
                cs: cs,
                label: label,
                price_high: price_high,
                price_low: price_low,
                direction: direction_up ? 'up' : 'down'
            },
            function (htm)
            {
                $('.' + cs).remove();
                $('#rowChart .market-stats').append(htm)
            }
        );
    }

    remove_excess()
    {
        let doomed = [3, 4, 5, 6];

        $('#rowChart .market-stats > div').each(
            function ()
            {
                if (doomed.indexOf($(this).index()) !== -1)
                    $(this).remove()
            }
        )
    }

    get_buy_price()
    {
        var result = 0;

        $('#closedMarketOrdersTable tbody tr').each(
            function ()
            {
                var type_buy = $('.text', this).text().indexOf('Buy') !== -1;
                var price = parseFloat($('.number:first', this).text());

                if (!type_buy) return false;

                if (type_buy && price > result)
                    result = price
            }
        );

        return parseFloat(result)
    }

    get_current_price()
    {
        return parseFloat($('span[data-bind="text: summary.displayLast()"]').text())
    }

    page_ready(cb)
    {
        let t = setInterval(
            function ()
            {
                if ($('#buyOrdersTable tbody tr').length > 1)
                {
                    clearInterval(t);
                    cb();
                }
            },
            500
        )
    }

    update_balance_and_history()
    {
        let core = () =>
        {
            chrome.runtime.sendMessage(
                {
                    action: 'get_balance',
                    pair: this.current_pair
                },
                (res) =>
                {
                    if (res.success)
                    {
                        console.log(res.data);
                        let top = `${res.data.exchanges.join(', ')} | ${res.data.bids.toFixed(4)} | ${res.data.asks.toFixed(4)}`;
                        let bottom = `${res.data.bids_percent} | ${res.data.asks_percent}`;

                        this.push_item('fb_balance', 'Balance', top, bottom, res.data.bids > res.data.asks);
                    }
                }
            );

            if (this._is_trade_usd)
                chrome.runtime.sendMessage(
                    {
                        action: 'get_balance',
                        pair: this.current_pair_usd
                    },
                    (res) =>
                    {
                        if (res.success)
                        {
                            console.log(res.data);
                            let top = `${res.data.exchanges.join(', ')} | ${res.data.bids.toFixed(4)} | ${res.data.asks.toFixed(4)}`;
                            let bottom = `${res.data.bids_percent} | ${res.data.asks_percent}`;

                            this.push_item('fb_balance_USD', 'Balance USD', top, bottom, res.data.bids > res.data.asks);
                        }
                        else
                            this._is_trade_usd = false
                    }
                );

            chrome.runtime.sendMessage(
                {
                    action: 'get_history',
                    pair: this.current_pair
                },
                (res) =>
                {
                    if (res.success)
                    {
                        console.log(res.data);
                        let top = `${res.data.exchanges.join(', ')} | ${res.data.buy.toFixed(4)} | ${res.data.sell.toFixed(4)}`;
                        let bottom = `${res.data.percent[0].toFixed(2)}% | ${res.data.percent[1].toFixed(2)}%`;

                        this.push_item('fb_history', 'History', top, bottom, res.data.buy > res.data.sell);
                    }
                }
            );
        };
        core();
        setInterval(
            () =>
            {
                core()
            },
            60000
        )
    }
}