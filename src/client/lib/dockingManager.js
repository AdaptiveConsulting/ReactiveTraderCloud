// Source: https://github.com/openfin/snap-and-dock

/* globals fin */
'use strict';

/**
 * Created by haseebriaz on 03/03/15.
 */

var __extends = function(d, b) {

  function Construct() {
    this.constructor = d;
  }
  Construct.prototype = b.prototype;
  d.prototype = new Construct();
};

var monitors = [];
function getMonitorInfo(){

  fin.desktop.System.getMonitorInfo(onMonitorInfo);
}

function onMonitorInfo(info){

  var monitor = info.primaryMonitor.availableRect;
  monitors.push({x: monitor.left, y: monitor.top, width: monitor.right - monitor.left, height: monitor.bottom - monitor.top});

  var currentMonitors = info.nonPrimaryMonitors;
  for(var i = 0; i < currentMonitors.length; i++){

    monitor = currentMonitors[i].availableRect;
    monitors.push({x: monitor.left, y: monitor.top, width: monitor.right - monitor.left, height: monitor.bottom - monitor.top});
  }
}

var DockingGroup = (function() {

  function DockingGroup() {

    this.children = [];
  }

  DockingGroup.prototype.children = [];
  DockingGroup.prototype.parent = null;
  DockingGroup.prototype.onAdd = function() {};
  DockingGroup.prototype.onRemove = function() {};

  DockingGroup.prototype.add = function(window) {

    if (window.group === this) {
      return;
    }

    this.children.push(window);
    window.group = this;
    // window.onAdd();
  };

  DockingGroup.prototype.remove = function(window) {

    var index = this.children.indexOf(window);
    if (index >= 0) {

      this.children.splice(index, 1);
      window.group = null;
      //  window.onRemove();
    }
  };

  DockingGroup.prototype.has = function(window) {

    return this.children.indexOf(window) >= 0;
  };

  return DockingGroup;
})();

var DockableWindow = (function(_super) {

  var _instances = {};

  function DockableWindow(options, onReady) {

    if (onReady) {

      this.onReady = onReady;
    }

    this.crateDelegates();

    this.name = options.name;

    if (options instanceof fin.desktop.Window) {

      this.openfinWindow = options;
      this.onWindowCreated();

    } else {

      this.openfinWindow = new fin.desktop.Window({

        name: options.name,
        url: options.url,
        defaultLeft: options.defaultLeft - 150,
        defaultTop: options.defaultTop - 100,
        defaultWidth: options.defaultWidth,
        defaultHeight: options.defaultHeight,
        frame: options.frame,
        resize: options.resize,
        windowState: options.windowState,
        autoShow: options.autoShow

      }, this.onWindowCreated);
    }

    this.currentRange = this.range;
    _instances[this.name] = this;
  }

  //__extends(DockableWindow, _super);

  DockableWindow.prototype.name = '';
  DockableWindow.prototype.range = 40;
  DockableWindow.prototype.currentRange = 40;
  DockableWindow.prototype.x = 0;
  DockableWindow.prototype.y = 0;
  DockableWindow.prototype.width = 0;
  DockableWindow.prototype.height = 0;
  DockableWindow.prototype.openfinWindow = null;
  DockableWindow.prototype.isDocked = false;
  DockableWindow.prototype.dockableToOthers = true;
  DockableWindow.prototype.acceptDockingConnection = true;
  DockableWindow.prototype.minimised = false;
  DockableWindow.prototype.group = null;
  DockableWindow.prototype._moveEvent = {bounds:{}};

  DockableWindow.prototype.onReady = function() {};
  DockableWindow.prototype.onMove = function() {};
  DockableWindow.prototype.onClose = function() {};
  DockableWindow.prototype.onMoveComplete = function() {};
  DockableWindow.prototype.onMinimize = function() {};
  DockableWindow.prototype.onRestore = function() {};

  DockableWindow.prototype.crateDelegates = function() {

    this.onMove = this.onMove.bind(this);
    this.onMoved = this.onMoved.bind(this);
    this.onWindowCreated = this.onWindowCreated.bind(this);
    this.onBounds = this.onBounds.bind(this);
    this.onBoundsChanging = this.onBoundsChanging.bind(this);
    this.onClosed = this.onClosed.bind(this);
    this.onMoveComplete = this.onMoved.bind(this);
    this.onBoundsChanged = this.onBoundsChanged.bind(this);
    this.onBoundsUpdate = this.onBoundsUpdate.bind(this);
    this.onMinimized = this.onMinimized.bind(this);
    this.onRestored = this.onRestored.bind(this);
    this.onLoad = this.onLoad.bind(this);
  };

  DockableWindow.prototype.onLoad = function(message) {

    if (message.windowName !== this.name) {
      return;
    }

    fin.desktop.InterApplicationBus.unsubscribe('*', 'window-load', this.onLoad);

    var groupName = localStorage.getItem(this.name);
    console.log(this.name, groupName);

    this.onReady();
    if(groupName){

      console.log(this.name, groupName);
      var win = _instances[groupName];
      if(DockingManager.getInstance().isSnapable(this, win) || DockingManager.getInstance().isSnapable(win, this)) {
        this.joinGroup(_instances[groupName]);
      }
    }
  };

  DockableWindow.prototype.onWindowCreated = function() {

    this.openfinWindow.getBounds(this.onBounds);
    this.openfinWindow.disableFrame();
    this.openfinWindow.addEventListener('disabled-frame-bounds-changing', this.onBoundsChanging);
    this.openfinWindow.addEventListener('disabled-frame-bounds-changed', this.onBoundsChanged);
    this.openfinWindow.addEventListener('bounds-changed', this.onBoundsUpdate);
    this.openfinWindow.addEventListener('closed', this.onClosed);
    this.openfinWindow.addEventListener('minimized', this.onMinimized);
    this.openfinWindow.addEventListener('hidden', this.onMinimized);
    this.openfinWindow.addEventListener('restored', this.onRestored);
    this.openfinWindow.addEventListener('shown', this.onRestored);

    fin.desktop.InterApplicationBus.subscribe('*', 'window-load', this.onLoad);
  };

  DockableWindow.prototype.onBounds = function(bounds) {

    this.width = bounds.width;
    this.height = bounds.height;
    this.x = bounds.left;
    this.y = bounds.top;
  };

  DockableWindow.prototype.onBoundsUpdate = function(bounds) {

    this.x = bounds.left;
    this.y = bounds.top;
    this.width = bounds.width;
    this.height = bounds.height;
  };

  DockableWindow.prototype.onBoundsChanging = function(bounds) {

    var event = this._moveEvent;
    event.target = this;
    event.preventDefault = false;
    event.bounds.x = bounds.left;
    event.bounds.y = bounds.top;
    event.bounds.width = this.width;
    event.bounds.height = this.height;
    event.bounds.changedWidth = bounds.width;
    event.bounds.changedHeight = bounds.height;

    this.onMove(event);

    if (event.preventDefault) {
      return;
    }

    if (!this.isDocked) {
      this.setOpacity(0.5);
    }

    this.moveTo(bounds.left, bounds.top, bounds.width, bounds.height);
  };

  DockableWindow.prototype.onBoundsChanged = function() {

    this.setOpacity(1);
    this.onMoveComplete({
      target: this
    });
  };

  DockableWindow.prototype.onClosed = function() {

    this.onClose({
      target: this
    });
    //this.unlink();
  };

  DockableWindow.prototype.onMinimized = function() {

    this.minimized = true;
    this.onMinimize();
  };

  DockableWindow.prototype.onRestored = function() {

    this.minimized = false;
    this.onRestore();
  };

  DockableWindow.prototype.moveTo = function(x, y, width, height) {

    this.x = x;
    this.y = y;
    this.width = width ? width : this.width;
    this.height = height ? height : this.height;

    this.openfinWindow.removeEventListener('disabled-frame-bounds-changing', this.onBoundsChanging);
    this.openfinWindow.setBounds(x, y, this.width, this.height, this.onMoved);
  };

  DockableWindow.prototype.onMoved = function() {

    this.openfinWindow.addEventListener('disabled-frame-bounds-changing', this.onBoundsChanging);
  };

  function intersact(window1, window2){

    return  !(window1.x + window1.width < window2.x || window2.x + window2.width < window1.x
    || window1.y + window1.height < window2.y || window2.y + window2.height < window1.y);
  }

  DockableWindow.prototype.joinGroup = function(group) {

    if(this.group ) return;
    if (!this.dockableToOthers || !group.acceptDockingConnection) {
      return;
    }

    if(group.group){

      for(var i = 0; i < group.group.children.length; i++){
        if(intersact(this, group.group.children[i])) return;
      }
    }

    if(!group.group) {
      if(this.group){

        group.joinGroup(this);
        return;
      } else {

        var dockingGroup = new DockingGroup();
        dockingGroup.add(group);
        dockingGroup.add(this);
      }
    } else {

      group.group.add(this);
    }

    this.openfinWindow.enableFrame();
    group.openfinWindow.enableFrame();

    this.openfinWindow.joinGroup(group.openfinWindow);
    //this._inviteMemebersToTheGroup(this.group.children, group);
    this.isDocked = true;

    fin.desktop.InterApplicationBus.publish('window-docked', {

      windowName: this.name
    });

    fin.desktop.InterApplicationBus.publish('window-docked', {

      windowName: group.name
    });

    localStorage.setItem(this.name, group.name);
    console.log(this.name, localStorage.getItem(this.name));
  };

  DockableWindow.prototype.leaveGroup = function() {

    var group = this.group;

    this.openfinWindow.disableFrame();

    if (group) {

      group.remove(this);
    }

    this.openfinWindow.leaveGroup();
    //this._inviteMemebersToTheGroup(this.children, this);

    this.isDocked = false;

    fin.desktop.InterApplicationBus.publish('window-undocked', {

      windowName: this.name
    });

    if(group && group.children.length === 1) {

      group.children[0].leaveGroup();
    }


    if(!this.isInView()) this.moveTo(0, 0, this.width, this.height);

    if(group.children.length && !this.isGroupInView(group)){

      group.children[0].moveTo(0, 0);
    }

    localStorage.removeItem(this.name);
  };

  DockableWindow.prototype.isInView = function(){

    var inView = false;
    for(var i = 0; i < monitors.length; i++){

      if(intersact(this, monitors[i]) && this.y >= monitors[i].y) {

        inView = true;
      }
    }

    return inView;
  };

  DockableWindow.prototype.unlink = function() {

    this.leaveGroup();
  };

  DockableWindow.prototype.setOpacity = function(value) {

    if (this.opacity === value) {
      return;
    }
    this.opacity = value;
    this.openfinWindow.animate({
      opacity: {
        opacity: value,
        duration: 0
      }
    });
  };

  DockableWindow.prototype.minimize = function() {

    if (this.minimised) {
      return;
    }
    this.minimised = true;
    this.openfinWindow.minimize();
  };

  DockableWindow.prototype.restore = function() {

    if (!this.minimised) {
      return;
    }
    this.minimised = false;
    this.openfinWindow.restore();
  };

  DockableWindow.prototype.isGroupInView = function(group){

    var inView = false;
    for(var i = 0; i < group.children.length; i++){

      if(group.children[i].isInView()){

        inView = true;
      }
    }

    return inView;
  };

  return DockableWindow;
})();

var DockingManager = (function() {

  var instance = null;
  var windows = [];
  var _snappedWindows = {};
  var minimized = false;

  function DockingManager() {

    if (instance) {
      throw new Error('Only one instance of DockingManager is allowed. Use DockingManager.getInstance() to get the instance.');
    }

    instance = this;
    this.createDelegates();
    fin.desktop.InterApplicationBus.subscribe('*', 'undock-window', this.onUndock);
    window.document.addEventListener('visibilitychange', this.onVisibilityChanged);

    getMonitorInfo();
  }

  DockingManager.getInstance = function() {

    return instance ? instance : new DockingManager();
  };

  DockingManager.prototype.range = 40;
  DockingManager.prototype.spacing = 5;

  DockingManager.prototype.createDelegates = function() {

    this.onWindowMove = this.onWindowMove.bind(this);
    this.onWindowClose = this.onWindowClose.bind(this);
    this.onWindowRestore = this.onWindowRestore.bind(this);
    this.onWindowMinimize = this.onWindowMinimize.bind(this);
    this.dockAllSnappedWindows = this.dockAllSnappedWindows.bind(this);
    this.onUndock = this.onUndock.bind(this);
    this.onVisibilityChanged = this.onVisibilityChanged.bind(this);
  };

  DockingManager.prototype.onUndock = function(message) {


    var name = message.windowName;

    for (var i = 0; i < windows.length; i++) {

      if (windows[i].name === name) {

        windows[i].leaveGroup();
      }
    }
  };

  DockingManager.prototype.undockAll = function() {

    for (var i = 0; i < windows.length; i++) {
      windows[i].leaveGroup();
    }
  };

  DockingManager.prototype.register = function(window, dockableToOthers) {

    window = new DockableWindow(window);
    window.dockableToOthers = (dockableToOthers === undefined || dockableToOthers !== false);

    if (windows.indexOf(window) >= 0) {

      return;
    }

    windows.push(window);
    window.onMove = this.onWindowMove;
    window.onMoveComplete = this.dockAllSnappedWindows;
    window.onClose = this.onWindowClose;
    window.onRestore = this.onWindowRestore;
    window.onMinimize = this.onWindowMinimize;
  };

  DockingManager.prototype.unregister = function(window) {

    if(!(window instanceof DockableWindow)){
      window = this._getWindowByOpenfinWindow(window);
    }

    var index = windows.indexOf(window);

    if (index >= 0) {

      windows.splice(index, 1);
    }
  };

  DockingManager.prototype._getWindowByOpenfinWindow = function(opefinWindow){

    for(var i = 0; i < windows.length; i++){

      if(windows[i].opefinWindow == opefinWindow) return windows[i];
    }

    return null;
  };

  DockingManager.prototype.onVisibilityChanged = function() {

    if (document.hidden) {

      this.onWindowMinimize();
    } else {

      this.onWindowRestore();
    }

  };

  DockingManager.prototype.onWindowClose = function(event) {

    this.unregister(event.target);
  };

  DockingManager.prototype.onWindowRestore = function() {

    if (!minimized) {
      return;
    }

    minimized = false;
    var currentWindow = null;
    var length = windows.length;

    for (var i = 0; i < length; i++) {

      currentWindow = windows[i];
      currentWindow.restore();
    }
  };

  DockingManager.prototype.onWindowMinimize = function() {

    if (minimized) {
      return;
    }
    minimized = true;

    var currentWindow = null;
    var length = windows.length;

    for (var i = 0; i < length; i++) {

      currentWindow = windows[i];
      currentWindow.minimize();
    }
  };

  DockingManager.prototype.onWindowMove = function(event) {

    var currentWindow = event.target;
    event.bounds.currentRange = currentWindow.currentRange;

    if(currentWindow.group) return;

    var dWindow = null;
    var position = {
      x: null,
      y: null
    };

    main: for (var i = windows.length - 1; i >= 0; i--) {

      dWindow = windows[i];

      var snappingPosition = this.isSnapable(event.bounds, dWindow);

      if (!snappingPosition) {
        snappingPosition = this._reverse(this.isSnapable(dWindow, event.bounds));
      }

      if (snappingPosition) {

        currentWindow.currentRange = currentWindow.range + 10;
        var pos = this.snapToWindow(event, dWindow, snappingPosition);

        if (!position.x) {
          position.x = pos.x;
        }

        if (!position.y) {
          position.y = pos.y;
        }

        this.addToSnapList(currentWindow, dWindow, snappingPosition);

      } else {

        currentWindow.currentRange = currentWindow.range;
        this.removeFromSnapList(currentWindow, dWindow);
      }
    }

    if (position.x || position.y) {

      event.preventDefault = true;

      position.x = position.x ? position.x : event.bounds.x;
      position.y = position.y ? position.y : event.bounds.y;

      currentWindow.moveTo(position.x, position.y);


      this.checkIfStillSnapped();
    }
  };

  DockingManager.prototype.checkIfStillSnapped = function() {

    for (var name in _snappedWindows) {

      var currentWindow = _snappedWindows[name];

      if (!currentWindow) {
        continue;
      }

      if(this.isSnapable(currentWindow[0], currentWindow[1])  || this.isSnapable(currentWindow[1], currentWindow[0])){

        continue;

      } else {
        //currentWindow[1].setOpacity(1);
        this.removeFromSnapList(currentWindow[0], currentWindow[1]);
      }
    }
  };

  DockingManager.prototype.isSnapable = function(currentWidow, window) {

    var isInVerticalZone = this._isPointInVerticalZone(window.y, window.y + window.height, currentWidow.y, currentWidow.height);

    if ((currentWidow.x > window.x + window.width - currentWidow.currentRange && currentWidow.x < window.x + window.width + currentWidow.currentRange) && isInVerticalZone) {

      return 'right';

    } else if ((currentWidow.x + currentWidow.width > window.x - currentWidow.currentRange && currentWidow.x + currentWidow.width < window.x + currentWidow.currentRange) && isInVerticalZone) {

      return 'left';

    } else {

      var isInHorizontalZone = this._isPointInHorizontalZone(window.x, window.x + window.width, currentWidow.x, currentWidow.width);

      if ((currentWidow.y > window.y + window.height - currentWidow.currentRange && currentWidow.y < window.y + window.height + currentWidow.currentRange) && isInHorizontalZone) {

        return 'bottom';

      } else if ((currentWidow.y + currentWidow.height > window.y - currentWidow.currentRange && currentWidow.y + currentWidow.height < window.y + currentWidow.currentRange) && isInHorizontalZone) {

        return 'top';
      } else {

        return false;
      }
    }
  };

  DockingManager.prototype._isPointInVerticalZone = function(startY, endY, y, height) {

    var bottom = y + height;
    return (y >= startY && y <= endY || bottom >= startY && bottom <= endY);
  };

  DockingManager.prototype._isPointInHorizontalZone = function(startX, endX, x, width) {

    var rightCorner = x + width;
    return (x >= startX && x <= endX || rightCorner >= startX && rightCorner <= endX);
  };

  DockingManager.prototype._reverse = function(value) {

    if (!value) {
      return null;
    }

    switch (value) {

      case 'right':
        return 'left';
      case 'left':
        return 'right';
      case 'top':
        return 'bottom';
      case 'bottom':
        return 'top';
      default:
        return null;
    }
  };

  DockingManager.prototype.snapToWindow = function(event, window, position) {

    var currentWindow = event.target;

    switch (position) {

      case 'right':
        return {
          x: window.x + window.width + this.spacing,
          y: this._getVerticalEdgeSnapping(window, event.bounds)
        };
      case 'left':
        return {
          x: window.x - currentWindow.width - this.spacing,
          y: this._getVerticalEdgeSnapping(window, event.bounds)
        };
      case 'top':
        return {
          x: this._getHorizontalEdgeSnapping(window, event.bounds),
          y: window.y - currentWindow.height - this.spacing
        };
      case 'bottom':
        return {
          x: this._getHorizontalEdgeSnapping(window, event.bounds),
          y: window.y + window.height + this.spacing
        };
    }
  };

  DockingManager.prototype._getVerticalEdgeSnapping = function(window, currentWindow) {

    if (currentWindow.y <= window.y + this.range && currentWindow.y >= window.y - this.range) {
      return window.y;
    }
    if (currentWindow.y + currentWindow.height >= window.y + window.height - this.range &&
      currentWindow.y + currentWindow.height <= window.y + window.height + this.range) {

      return window.y + window.height - currentWindow.height;
    }
    return null;
  };

  DockingManager.prototype._getHorizontalEdgeSnapping = function(window, currentWindow) {

    if (currentWindow.x <= window.x + this.range && currentWindow.x >= window.x - this.range) {
      return window.x;
    }
    if (currentWindow.x + currentWindow.width >= window.x + window.width - this.range &&
      currentWindow.x + currentWindow.width <= window.x + window.width + this.range) {

      return window.x + window.width - currentWindow.width;
    }
    return null;
  };

  DockingManager.prototype.addToSnapList = function(window1, window2, snappingPosition) {

    _snappedWindows[window1.name + window2.name] = [window1, window2, snappingPosition];

    window1.setOpacity(0.5);
    window2.setOpacity(0.5);

  };


  DockingManager.prototype.removeFromSnapList = function(window1, window2) {

    if (_snappedWindows[window1.name + window2.name]) {
      _snappedWindows[window1.name + window2.name] = null;
      // window1.setOpacity(1);
      window2.setOpacity(1);
    }
  };

  DockingManager.prototype.dockAllSnappedWindows = function() {

    for (var name in _snappedWindows) {

      var currentWindow = _snappedWindows[name];
      if (!currentWindow) {

        delete _snappedWindows[name];
        continue;
      }
      _snappedWindows[name] = null;
      this._addWindowToTheGroup(currentWindow[0], currentWindow[1], currentWindow[2]);
    }
  };

  DockingManager.prototype._addWindowToTheGroup = function(window1, windowGroup, position) {

    window1.setOpacity(1);
    windowGroup.setOpacity(1);
    window1.joinGroup(windowGroup, window1.onDock);
  };

  return DockingManager;

})();

