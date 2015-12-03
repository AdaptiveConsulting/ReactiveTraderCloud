'use srict';

/**
 * unique event ids to store in object
 * @type {number}
 */
let EID = 0;

/**
 * @description known / registered pseudo events, used via :
 * @type {{once: once}}
 */
const pseudoEvents = {
  /**
   * @description Subscribe to a once-only, event pseudo
   * @param {string} event - prefix string (eg. use change:once)
   * @param {function} fn - function to call once
   * @returns {function} wrapped fn
   */
  once: (event, fn) =>{
    const self = this,
      wrapped = function(){
        fn.apply(this, arguments);
        self.off(event, wrapped);
      };
    return wrapped;
  }
};

const REGEX_WHITESPACE = /\s+/,
      PSEUDO_SEPARATOR = ':';

/**
 * @class emitter
 * @description mixin class for firing class events
 */
class emitter {

  /**
   * @description subscribes to an event handler
   * @param {string} event - name of the event or multiple events, separated by space
   * @param {function) fn - function to call when event matches
   * @returns {emitter}
   */
  on(event, fn){
    // supports multiple events split by white space
    event = event.split(REGEX_WHITESPACE);
    let i = 0,
        len = event.length,
        listeners = this._listeners,
        events,
        k,
        pseudos,
        eventName,
        knownPseudo;

    if (!listeners){
      Object.defineProperty(this, '_listeners', { value: {}, enumerable: false, writable: true });
      listeners = this._listeners;
    }

    loopEvents:
      for (; i < len; ++i){
        pseudos = event[i].split(PSEUDO_SEPARATOR);
        eventName = pseudos.shift();
        knownPseudo = pseudos.length && pseudos[0] in pseudoEvents;

        knownPseudo || (eventName = event[i]);
        events = listeners[eventName] || (listeners[eventName] = {});

        for (k in events) if (events[k] === fn) continue loopEvents;
        events[(EID++).toString(36)] = knownPseudo ? pseudoEvents[pseudos[0]].call(this, eventName, fn) : fn;
      }
    return this;
  }

  /**
   * @description unsubscribes from an event, needs exact name and saved fn ref to find a match
   * @param {string} event - single event name
   * @param {function} fn - matching callback to remove
   * @returns {emitter}
   */
  off(event, fn){
    let listeners = this._listeners,
        events,
        key,
        length = 0,
        l,
        k;

    if (listeners && (events = listeners[event])){
      for (k in events){
        length++;
        if (key == null && events[k] === fn) key = k;
        if (key && length > 1) break;
      }

      if (key){
        delete events[key];
        if (length === 1){
          // delete so that the order of the array remains unaffected, making it sparse
          delete listeners[event];
          for (l in listeners) return this;
          // none left, remove listeners prop
          delete this._listeners;
        }
      }
    }
    return this;
  }

  /**
   * @description fires an event
   * @param {string} event name
   * @param {*=} args optional arguments
   * @returns {emitter}
   */
  trigger(event, ...args){
    let events = this._listeners,
        handlers = events ? events[event] : false,
        k;

    if (handlers){
      if (args){
        for (k in handlers) handlers[k].apply(this, args);
      }
      else {
        for (k in handlers) handlers[k].call(this);
      }
    }
    return this;
  }

  static definePseudo(pseudo, fn){
    pseudoEvents[pseudo] = fn;
  }
}

export default emitter;
