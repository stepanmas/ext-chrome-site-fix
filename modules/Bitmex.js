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
        if (!utils.$('td.avgCostPrice')) {
          return;
        }

        const currentPrice = this.getLastPrice();
        const enterPrice = this.getEnterPrice();

        this.printDebug(currentPrice, enterPrice, this.calcStopPrice(), this.isStopSet(), this.getCountContracts());

        /*
        Don't work, because secure
        if (currentPrice && enterPrice && !this.isStopSet()) {
          let direct = null;

          if (this.isShort() && currentPrice < enterPrice - this.priceDeltaForStop) {
            direct = 'sell';
          } else if (currentPrice > enterPrice + this.priceDeltaForStop) {
            direct = 'buy';
          }

          if (direct) {
            this.setCloseTriggerCheckbox(true);
            this.activeStopTab();
            utils.$('#orderQty').value = this.getCountContracts();
            utils.$('#stopPx').value = this.calcStopPrice();
            utils.$('.orderControlsButtons .' + direct).click();
          }
        }*/
      },
      10000);
  }

  calcStopPrice() {
    return this.isShort() ? this.getEnterPrice() - this.stopDelta : this.getEnterPrice() + this.stopDelta;
  }

  getLastPrice() {
    return +(utils.$('span.lastTick').innerText || 0);
  }

  getEnterPrice() {
    return +(utils.$('td.avgCostPrice').innerText || 0);
  }

  getCountContracts() {
    return +(utils.$('.positionStatusIndicator .posValue').innerText || 0);
  }

  isStopSet() {
    const stopsTrEl = utils.$('.openOrderTable tr:not(.combinedSummary)');
    return stopsTrEl ? stopsTrEl.length < 2 : false;
  }

  printDebug(...args) {
    const insertDiv = utils.$('#header > div:last-child');
    const homeDiv = utils.$('#debug-info');
    if (!homeDiv) {
      const div = document.createElement('div');
      div.id = 'debug-info';
      div.innerText = args.join(', ');
      insertDiv.parentNode.insertBefore(div, insertDiv);
    } else {
      homeDiv.innerText = args.join(', ');
    }
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

  isShort() {
    return !!utils.$('.positionsList .short');
  }
}
