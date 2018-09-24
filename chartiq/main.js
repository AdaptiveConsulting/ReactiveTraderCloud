const TOPIC = 'chartiq:main:change_symbol';
let openfinWindow;

const configureChart = (interval, symbol) => {
  const nativeWindow = openfinWindow.getNativeWindow();
  if (interval) {
    console.log(`Interval: ${interval}`);
    nativeWindow.stxx.setPeriodicityV2(1, interval);
  }
  if (symbol) {
    console.log(`Symbol: ${symbol}`);
    nativeWindow.UIContext.changeSymbol({ symbol });
  }
};

const messageCallback = msg => {
  const { interval, symbol } = msg;
  console.log('Received message');
  configureChart(interval, symbol);
};

const openWindow = url => {
  return new Promise((resolve, reject) => {
    openfinWindow = new fin.desktop.Window(
      {
        url,
        name: 'Reactive Trader Cloud - ChartIQ',
        defaultTop: 100,
        defaultLeft: 100,
        defaultWidth: 850,
        defaultHeight: 600,
        showTaskbarIcon: true,
        autoShow: true,
        frame: false,
        resizable: true,
        maximizable: true
      },
      () => resolve()
    );
  });
};

const addMessageHandler = () => {
  console.log('Add message handler');
  fin.desktop.InterApplicationBus.subscribe('*', TOPIC, messageCallback);
};

const removeMessageHandler = () => {
  console.log('Remove message handler');
  fin.desktop.InterApplicationBus.unsubscribe('*', TOPIC, messageCallback);
};

const addOpenfinControls = () => {
  const nativeWindow = openfinWindow.getNativeWindow();
  console.log('Render window');

  // create close button
  const menu = nativeWindow.document.querySelector('.ciq-menu-section');
  const closeButton = menu.appendChild(
    nativeWindow.document.createElement('div')
  );
  closeButton.id = 'closeBtn';
  closeButton.className = 'ciq-icon ciq-close';
  closeButton.style['background-color'] = 'grey';
  closeButton.onclick = () => {
    removeMessageHandler();
    fin.desktop.Window.getCurrent().close();
  };

  // hide search
  const search = nativeWindow.document.querySelector('.ciq-search');
  search.style['display'] = 'none';

  // set the window to be draggable by the nav bar
  const wrapper = nativeWindow.document.querySelector('.ciq-nav');
  openfinWindow.defineDraggableArea(wrapper);
  // exclude menu from draggable area
  menu.style['-webkit-app-region'] = 'no-drag';
};

const initialize = () => {
  let search = location.search;
  let symbol = '';
  let interval = '';
  console.log('Initialize chart');
  if (search.indexOf('?') === 0) {
    search = search.substr(1);
  }
  search.split('&').forEach(s => {
    const terms = s.split('=');
    if (terms[0] === 'symbol') {
      symbol = terms[1];
    } else if (terms[0] === 'period') {
      interval = terms[1];
    }
  });
  configureChart(interval, symbol);
};

document.addEventListener('DOMContentLoaded', () => {
  fin.desktop.main(() => {
    openWindow('template-advanced.html')
      .then(() => addOpenfinControls())
      .then(() => addMessageHandler())
      .then(() => initialize());
  });
});
