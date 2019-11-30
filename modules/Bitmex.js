class Bitmex {
  stopOCOTimer = null;
  priceDeltaForStop = 50;
  stopDelta = 15;

  constructor() {
    this.startWatchStopOCO();
  }

  startWatchStopOCO() {
    this.stopOCOTimer = setInterval(
      () => {
        const currentPrice = this.getLastPrice();
        const enterPrice = this.getEnterPrice();

        this.printDebug(currentPrice, enterPrice, this.calcStopPrice(), this.isStopSet(), this.getCountContracts());

        if (currentPrice && enterPrice && !this.isStopSet()) {
          if (currentPrice > enterPrice + this.priceDeltaForStop) {
            console.log('set');
            this.setCloseTriggerCheckbox(true);
            this.activeStopTab();
            utils.$('#orderQty').value = this.getCountContracts();
            utils.$('#stopPx').value = this.calcStopPrice();
            utils.$('.orderControlsButtons .sell').click();
          }
        }
      },
      1000);
  }

  calcStopPrice() {
    return this.getEnterPrice() + this.stopDelta;
  }

  getLastPrice() {
    return +(utils.$('span.lastTick').innerText || 0);
  }

  getEnterPrice() {
    return +(utils.$('td.avgCostPrice').innerText || 0);
  }

  getCountContracts() {
    return +(utils.$('.positionStatusIndicator .pricePos').innerText || 0);
  }

  isStopSet() {
    const stopsTrEl = utils.$('.openOrderTable tr:not(.combinedSummary)');
    return stopsTrEl ? stopsTrEl.length < 2 : false;
  }

  printDebug(...args) {
    document.querySelector('.tradingViewWrapper .title').innerText = args.join(', ');
  }

  setCloseTriggerCheckbox(flag) {
    const el = utils.$('#closeExecInst');
    if (el) {
      el.checked = flag;
    }
  }

  activeStopTab() {
    document.querySelector('.ordTypes li:nth-child(3)').click();
  }
}
