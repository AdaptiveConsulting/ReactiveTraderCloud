import React        from 'react';
import ReactDOM     from 'react-dom';
import { Provider } from 'react-redux';
import DevTools     from 'containers/DevToolsWindow';

export function createConstants(...constants){
  return constants.reduce((acc, constant) =>{
    acc[constant] = constant;
    return acc;
  }, {});
}

export function createReducer(initialState, reducerMap){
  return (state = initialState, action) =>{
    const reducer = reducerMap[action.type];

    return reducer ? reducer(state, action.payload) : state;
  };
}

export function createDevToolsWindow(store){
  const win = window.open(
    null,
    'redux-devtools', // give it a name so it reuses the same window
    `width=400,height=${window.outerHeight},menubar=no,location=no,resizable=yes,scrollbars=no,status=no`
  );

  // reload in case it's reusing the same window with the old content
  win.location.reload();

  // wait a little bit for it to reload, then render
  setTimeout(() =>{
    // Wait for the reload to prevent:
    // "Uncaught Error: Invariant Violation: _registerComponent(...): Target container is not a DOM element."
    win.document.write('<div id="react-devtools-root"></div>');
    win.document.body.style.margin = '0';

    ReactDOM.render(
      <Provider store={store}>
        <DevTools />
      </Provider>
      , win.document.getElementById('react-devtools-root')
    );
  }, 10);
}

const numberConvertRegex = /^([0-9\.]+)?([MK]{1})?$/;

      /**
 * Returns the expanded price from k/m shorthand.
 * @param {String|Number} size
 * @returns {Number}
 */
export function getConvertedSize(size){
  size = String(size).toUpperCase().replace(',', '');
  const matches = size.match(numberConvertRegex);

  if (!size.length || !matches || !matches.length){
    size = 0;
  }
  else {
    size = Number(matches[1]);
    matches[2] && (size = size * (matches[2] === 'K' ? 1000 : 1000000));
  }

  return size;
}
