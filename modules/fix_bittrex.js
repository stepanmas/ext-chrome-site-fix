class Bittrex
{
    constructor()
    {
        this.page_ready(
            () =>
            {
                // page of coin
                if ($('#rowChart').length)
                {
                    this.update_spread();
                    // this.remove_excess();
                    this.update_balance_and_history();
                    this.bind();
                    this.get_price_cmc();
                    this.insert_style();
                    this.added_history_items();
                    this.run_intervals()
                }
            }
        );
    }

    run_intervals()
    {
        setInterval(
            () => {
                this.get_price_cmc();
                this.added_history_items();
            },
            60000 * 5
        )
    }

    insert_style()
    {
        window.utils.get_tpl(
            'tpl_fb_style',
            {},
            function (htm)
            {
                $('body').append(htm)
            }
        );
    }

    _format_code(code)
    {
        let match = location.search.match(/=(.+)$/)[1];

        match = match.split('-');

        return `${match[1]}-${code}`
    }

    get_fixed_code()
    {
        let match = location.search.match(/=(.+)$/)[1];

        match = match.split('-');

        if (match[0] === 'USDT')
            match[0] = 'USD';

        return `${match[1]}-${match[0]}`
    }

    bind()
    {
        $('h1.page-title').click(
            () =>
            {
                this.update_balance_and_history();
                this.get_price_cmc();
            }
        ).css('cursor', 'pointer')
    }

    added_history_items()
    {
        let intervals = [10, 15, 20, 30, 60, 120, 180, 360, 720, 1440, 2880];

        for (let int of intervals)
        {
            chrome.runtime.sendMessage(
                {
                    action: 'get_history_for',
                    pair: this.get_fixed_code(),
                    time_amount: int,
                    time_type: 'minutes',
                },
                (res) =>
                {
                    if (!res.error)
                    {
                        for (let code in res)
                        {
                            let str_amount = `${int > 30 ? int / 60 + 'h' : int + 'm'}`;

                            this.push_item(
                                `fb_history_${str_amount}`,
                                `History ${str_amount}`,
                                res[code].sell.toFixed(2) + '%',
                                res[code].buy.toFixed(2) + '%',
                                parseFloat(res[code].buy) > 50
                            )
                        }
                    }
                }
            );
        }
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
                    this.push_item('fb_spread', 'Spread', buy_price, result.toFixed(2) + '%', result > 0)
            },
            1000
        )
    }

    push_item(cs, label, price_high, price_low, direction_up = null, icon = 'btc')
    {
        window.utils.get_tpl(
            'tpl_fb_spread',
            {
                cs: cs,
                label: label,
                price_high: price_high,
                price_low: price_low,
                direction: direction_up == null ? 'none' : direction_up ? 'up' : 'down',
                icon: icon
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
        let result = 0;

        $('#closedMarketOrdersTable tbody tr').each(
            function ()
            {
                let type_buy = $('.text', this).text().indexOf('Buy') !== -1;
                let price = parseFloat($('.number:first', this).text());
                let exist_open_order = $('#openMarketOrdersTable .dataTables_empty').length === 0;

                if (!exist_open_order && !type_buy) return false;

                if (type_buy && price > result)
                {
                    result = price;

                    if (exist_open_order)
                        return false;
                }
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

        chrome.runtime.sendMessage(
            {
                action: 'get_balance',
                pair: this._format_code('BTC')
            },
            (res) =>
            {
                if (res.success)
                {
                    let top = `${res.data.exchanges.join(', ')} | ${res.data.bids.toFixed(4)} | ${res.data.asks.toFixed(4)}`;
                    let bottom = `${res.data.bids_percent} | ${res.data.asks_percent}`;

                    this.push_item('fb_balance', 'Balance', top, bottom, res.data.bids > res.data.asks);
                }
            }
        );

        chrome.runtime.sendMessage(
            {
                action: 'get_balance',
                pair: this._format_code('USD')
            },
            (res) =>
            {
                if (res.success)
                {
                    let top = `${res.data.exchanges.join(', ')} | ${res.data.bids.toFixed(4)} | ${res.data.asks.toFixed(4)}`;
                    let bottom = `${res.data.bids_percent} | ${res.data.asks_percent}`;

                    this.push_item('fb_balance_USD', 'Balance USD', top, bottom, res.data.bids > res.data.asks);
                }
            }
        );

        chrome.runtime.sendMessage(
            {
                action: 'get_history',
                pair: this._format_code('BTC')
            },
            (res) =>
            {
                if (res.success)
                {
                    let top = `${res.data.exchanges.join(', ')} | ${res.data.buy.toFixed(4)} | ${res.data.sell.toFixed(4)}`;
                    let bottom = `${res.data.percent[0].toFixed(2)}% | ${res.data.percent[1].toFixed(2)}%`;

                    this.push_item('fb_history', 'History', top, bottom, res.data.buy > res.data.sell);
                }
            }
        );

        chrome.runtime.sendMessage(
            {
                action: 'get_history',
                pair: this._format_code('USD')
            },
            (res) =>
            {
                if (res.success)
                {
                    let top = `${res.data.exchanges.join(', ')} | ${res.data.buy.toFixed(4)} | ${res.data.sell.toFixed(4)}`;
                    let bottom = `${res.data.percent[0].toFixed(2)}% | ${res.data.percent[1].toFixed(2)}%`;

                    this.push_item('fb_history_USD', 'History USD', top, bottom, res.data.buy > res.data.sell);
                }
            }
        );
    }

    get_coin_name()
    {
        let res = $('.page-title').text().match(/(.+)\s\(/);
        return res ? res[1] : null
    }

    get_price_cmc()
    {
        let name = this.get_coin_name();

        chrome.runtime.sendMessage(
            {
                action: 'get_price_cmc',
                pair: name
            },
            (res) =>
            {
                if (res instanceof Array)
                {
                    this.push_item(
                        'fb_cmc_percent_change_1h',
                        'Change 1h',
                        '',
                        res[0]['percent_change_1h'] + '%',
                        parseFloat(res[0]['percent_change_1h']) > 0
                    );

                    this.push_item(
                        'fb_cmc_percent_change_24h',
                        'Change 24h',
                        '',
                        res[0]['percent_change_24h'] + '%',
                        parseFloat(res[0]['percent_change_24h']) > 0
                    );

                    this.push_item(
                        'fb_cmc_percent_change_7d',
                        'Change 7d',
                        '',
                        res[0]['percent_change_7d'] + '%',
                        parseFloat(res[0]['percent_change_7d']) > 0
                    );

                    this.push_item(
                        'fb_cmc_price',
                        'Price',
                        res[0]['price_btc'],
                        res[0]['price_usd'],
                        null,
                        'usd'
                    );
                }
            }
        );
    }
}