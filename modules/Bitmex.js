class Bitmex {
  stopOCOTimer = null;
  priceDeltaForStop = 50;
  stopDelta = 15;

  constructor() {
    this.startWatchStopOCO();
    const leverageLayout = utils.$('.leverageWrapper');
    leverageLayout.parentNode.removeChild(leverageLayout);
  }

  startWatchStopOCO() {
    this.stopOCOTimer = setInterval(
      () => {
        if (!utils.$('td.avgCostPrice')) {
          return;
        }

        const currentPrice = this.getLastPrice();
        const enterPrice = this.getEnterPrice();

        // currentPrice, enterPrice, this.calcStopPrice(), this.isStopSet(), this.getCountContracts()
        this.printDebug({
          'Стоп б/у': this.calcStopPrice(),
          //'Стоп по достижению': this.calcSetStopPrice(),
          'NEVER TOUCH LEVERAGE': 'PREVENT FOMO EFFECT!!!',
        });

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
      3000);
  }

  calcStopPrice() {
    return Math.floor(this.isShort() ? this.getEnterPrice() - this.stopDelta : this.getEnterPrice() + this.stopDelta);
  }

  calcSetStopPrice() {
    return Math.floor(this.isShort() ? this.getEnterPrice() - this.priceDeltaForStop : this.getEnterPrice() + this.priceDeltaForStop);
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

  buildHtmlTip = (prev, [key, value], index) => {
    const span = document.createElement('span');
    if (index === 1) {
      span.style.color = 'red';
      span.style.textTransform = 'uppercase';
      span.style.fontWeight = 'bold';
    }
    span.innerText = `${key}: ${value} `;
    prev.appendChild(span);
    return prev;
  };

  printDebug(data) {
    const insertDiv = utils.$('#header > div:last-child');
    const homeDiv = utils.$('#debug-info');
    if (!homeDiv) {
      const div = document.createElement('div');
      div.id = 'debug-info';
      div.appendChild(Object.entries(data).reduce(this.buildHtmlTip, document.createDocumentFragment()));
      insertDiv.parentNode.insertBefore(div, insertDiv);
    } else {
      homeDiv.innerHTML = '';
      homeDiv.appendChild(Object.entries(data).reduce(this.buildHtmlTip, document.createDocumentFragment()));
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
