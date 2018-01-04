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
                    // this.update_balance_and_history();
                    // this.bind();
                    // this.get_price_cmc();
                    // this.insert_style();
                }
            }
        );
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

    bind()
    {
        $('h1.page-title').click(
            () =>
            {
                this.update_balance_and_history();
            }
        ).css('cursor', 'pointer')
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
        let core = () =>
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
        };
        core();
        // setInterval(
        //     () =>
        //     {
        //         core()
        //     },
        //     60000 * 5
        // )
    }

    get_coin_name()
    {
        let res = $('.page-title').text().match(/(.+)\s\(/);
        return res ? res[1] : null
    }

    get_price_cmc()
    {
        let name = this.get_coin_name();

        let core = () =>
        {
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
        };

        if (name)
        {
            core();
            setInterval(
                core,
                60000 * 5
            )
        }
    }
}