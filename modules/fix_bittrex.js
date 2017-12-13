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
                    this.update_spread()
                }

                this.remove_excess();
            }
        );
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
                    this.push_item('Spread', buy_price, result.toFixed(2) + '%')
            },
            1000
        )
    }

    push_item(label, price_high, price_low)
    {
        window.utils.get_tpl(
            'tpl_fb_spread',
            {
                label: label,
                price_high: price_high,
                price_low: price_low,
                direction: price_low < 0 ? 'dyn-stat-down' : 'dyn-stat-up'
            },
            function (htm)
            {
                $('.fb_spread').remove();
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

        return result
    }

    get_current_price()
    {
        return parseFloat($('span[data-bind="text: summary.displayLast()"]').text())
    }

    page_ready(cb)
    {
        var t = setInterval(
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
}