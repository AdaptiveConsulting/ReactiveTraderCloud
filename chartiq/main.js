document.addEventListener('DOMContentLoaded', () => {
  const FeaturesEnum = {
    ChangeSymbol: 'change_symbol'
  };

  fin.desktop.main(() => {
    const currentWindow = fin.desktop.Window.getCurrent();
    let subFunctions = {};
    const fetch = (myself, symbol, interval) => {
      console.log(`fetch symbol ${symbol}`);
      if (interval) {
        myself.stxx.setPeriodicityV2(1, interval);
      }
      if (symbol) {
        myself.UIContext.changeSymbol({symbol: symbol});
      }
    };

    console.log(`UUID: ${currentWindow.uuid}`);

    currentWindow.onMessageCallback = (myself, newSubscription, previousSubscription, subFunction) => {
      console.log('Message received');
      if (newSubscription == null) {
        subFunctions[subFunction] = null;
        console.log(`${myself.name} unsubscribed from ${previousSubscription}:${subFunction}`);
        return;
      } else if (myself.stxx.chart.symbol && subFunction === FeaturesEnum.ChangeSymbol) {
        subFunctions[subFunction]= (message, uuid) => {
          console.log(message);
          if (message.interval || message.symbol) {
            fetch(myself, message.symbol, message.interval);
          }
        }
      }

      console.log(`${myself.name} subscribed to ${newSubscription}:${subFunction}`);
      return subFunctions[subFunction];
    };

    // subscribe to change_symbol messages
    currentWindow.subscribe = win => {
      const recipient= `chartiq:${win.name}`;
      fin.desktop.InterApplicationBus.subscribe('*', `${recipient}:${FeaturesEnum.ChangeSymbol}`, currentWindow.onMessageCallback(win, recipient, null, FeaturesEnum.ChangeSymbol));
    };

    // dispose resources on unload
    currentWindow.unloadWindowEvent = win => {
      const recipient= `chartiq:${win.name}`;
      fin.desktop.InterApplicationBus.unsubscribe('*', `${recipient}:${FeaturesEnum.ChangeSymbol}`, currentWindow.onMessageCallback(win, null, recipient, FeaturesEnum.ChangeSymbol));

      currentWindow.close();
    };

    // for redrawing the stx windows
    currentWindow.redrawWindow = win => win.setTimeout(win.forceRedraw, 5000);

    const render = (openfinWindow, onRenderCallback) => {
      console.log('Render window');
      const nativeWindow = openfinWindow.getNativeWindow();

      // wait for full load of main window
      if (!nativeWindow.STX) {
        setTimeout(() => render(nativeWindow), 1000);
        return;
      }

      // event handler to decrement window count
      nativeWindow.addEventListener('unload', () => currentWindow.unloadWindowEvent(nativeWindow));

      // sub/unsubscribe window to stream if symbol changed
      currentWindow.subscribe(nativeWindow);

      // create close button
      const menu = nativeWindow.document.querySelector('.ciq-menu-section');
      const closeButton = menu.appendChild(nativeWindow.document.createElement('div'));
      closeButton.id ='closeBtn';
      closeButton.className ='ciq-icon ciq-close';
      closeButton.style['background-color'] = 'grey';
      closeButton.onclick = () => nativeWindow.close();

      // hide search
      const search = nativeWindow.document.querySelector('.ciq-search');
      search.style['display'] = 'none';

      // set the window to be draggable by the nav bar
      const wrapper = nativeWindow.document.querySelector('.ciq-nav');
      openfinWindow.defineDraggableArea(wrapper);
      const btns = wrapper.querySelectorAll('.ciq-menu');
      Array.prototype.forEach.call(btns, btn => btn.style['-webkit-app-region'] = 'no-drag');
      onRenderCallback();
    };

    // parse symbol and period, and spawn main window
    let search = location.search;
    if (search.indexOf('?') === 0) {
      search = search.substr(1);
    }
    search = search.split('&');
    let symbol = '';
    let interval = '';
    search.forEach(s => {
      const terms = s.split('=');
      if (terms[0] === 'symbol') {
        symbol= terms[1];
      } else if(terms[0] === 'period') {
        interval = terms[1];
      }
    });

    const openfinWindow = new fin.desktop.Window({
      url: `template-advanced.html`,
      name: 'main',
      defaultTop: 100,
      defaultLeft: 100,
      defaultWidth: 850,
      defaultHeight: 600,
      showTaskbarIcon: true,
      autoShow: true,
      frame: false,
      resizable: true,
      maximizable: true
    }, () => {
      render(openfinWindow, () => fetch(openfinWindow.getNativeWindow(), symbol, interval));
    });
  });
});