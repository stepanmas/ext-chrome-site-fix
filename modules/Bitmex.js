class Bitmex {
  constructor() {
    this.$priceTake = $('.price-take');
    this.$priceLQD = $('.price-liquidation');
    this.$priceStop = $('.price-stop');
  }

  calc() {
    const take = parseInt(this.$priceTake.val(), 10);
    const lqd = parseInt(this.$priceLQD.val(), 10);
    const lqdThrough = take - lqd;

    return Math.round(take - lqdThrough * 10 / 100);
  }

  print(result = '') {
    this.$priceStop.text(result);
  }

  init() {
    this.$priceTake.add(this.$priceLQD).keyup(() => {
      this.print(this.calc() || '');
    });
  }
}