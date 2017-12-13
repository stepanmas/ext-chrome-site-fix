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
            }
        );
    }

    update_spread()
    {
        setInterval(
            () =>
            {
                var buy_price = this.get_buy_price();
                var current_price = this.get_current_price();
                let result = 99.5 - buy_price * 100 / current_price;

                if (buy_price)
                    this.push_item('Spread', buy_price, result.toFixed(2) + '%')
            },
            1000
        )
    }

    push_item(label, price_high, price_low)
    {
        $('.fbx_spread').remove();
        console.log(11);

        $('#rowChart .market-stats').append(
            $('<div/>', {
                class: 'col-md-12 col-xs-6 stat-right fbx_spread',
                html: `111111111111`
            })
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