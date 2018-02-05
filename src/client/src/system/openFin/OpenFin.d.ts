type NativeWindow = Window;

declare namespace fin {
  namespace desktop {
    interface WindowOptions {
      accelerator?: {
        devtools?: boolean;
        zoom?: boolean;
        reload?: boolean;
        reloadIgnoringCache?: boolean;
      };
      alwaysOnTop?: boolean;
      autoShow?: boolean;
      backgroundColor?: string;
      contextMenu?: boolean;
      cornerRounding?: {
        width: number;
        height: number
      };
      customData?: any;
      defaultCentered?: boolean;
      defaultHeight?: number;
      defaultLeft?: number;
      defaultTop?: number;
      defaultWidth?: number;
      frame?: boolean;
      hideOnClose?: boolean;
      icon?: string;
      maxHeight?: number;
      maximizable?: boolean;
      maxWidth?: number;
      minHeight?: number;
      minimizable?: boolean;
      minWidth?: number;
      name?: string;
      opacity?: number;
      resizable?: boolean;
      shadow?: boolean;
      resizeRegion?: {
        size?: number;
        bottomRightCorner?: number;
      };
      showTaskbarIcon?: boolean;
      saveWindowState?: boolean;
      taskbarIconGroup?: string;
      state?: 'normal' | 'minimized' | 'maximized';
      url?: string;
      waitForPageLoad?: boolean;
    }

    class Window {
      static getCurrent() : Window;
      constructor(options: WindowOptions, onSuccess?: () => void, onError?: () => void);
      name: string;
      getNativeWindow(): NativeWindow;
      bringToFront(): void;
      show(): void;
      focus(): void;
      close(force: boolean, onSuccess?: () => void, onError?: () => void): void;
      addEventListener(type: string, listener: (event: any) => void, onSuccess?: () => void, onError?: (event: any) => void): void;
      removeEventListener(type: string, listener: (event: any) => void, onSuccess?: () => void, onError?: (event: any) => void): void;
      getBounds(onSuccess: (bounds: any) => void): void;
      updateOptions(options: WindowOptions, onSuccess?: () => void, onError?: () => void): void;
      resizeTo(width: number, height: number, anchor: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): void;
    }

    class Application {
      static getCurrent() : Application;
      getWindow(): Window;
      getChildWindows(onSuccess: (windows: Window[]) => void, onError: (reason: string) => void): void;
      addEventListener(type:string, listener:(event:any)=>void, onSuccess:() => void, onError: (reason: string) => void) : void;
      restart(onSuccess?:() => void, onError?: (reason: string) => void): void;
    }

    class System {
      static getEnvironmentVariable(variable: string, onSuccess: (variable: string) => void, onError?: (reason: string) => void): void;
      static setClipboard(text: string, onSuccess: () => void, onError?: (reason: string) => void): void;
      static getMonitorInfo(onSuccess: (monitorInfo: MonitorInfo) => void, onError?: (reason: string) => void): void;
      static getVersion(onSuccess: (version: string) => void, onError?: (reason: string) => void): void;
      static addEventListener(type:string, listener: (event:Event) => void, callback?: () => void, error?: (reason:string) => void ):void;
      static removeEventListener(type:string, listener: (event:Event) => void, callback?: () => void, error?: (reason:string) => void):void;
    }

    interface MonitorInfo {
      virtualScreen: {
        bottom: number;
        left: number;
        right: number;
        top: number;
      };
    }

    interface NotificationOptions {
      url: string;
      message: any;
      timeout?: number | 'never';
      onClick?: () => void;
      onClose?: () => void;
      onDismiss?: () => void;
      onError?: (reason: string) => void;
      onMessage?: (message: any) => void;
    }

    class Notification {
      static getCurrent(): Notification;
      constructor(options: NotificationOptions, onSuccess?: () => void, onError?: () => void);
      close(onSuccess?: () => void): void;
      sendMessage(message: any, onSuccess?: () => void) : void;
      sendMessageToApplication(message: any, onSuccess?: () => void) : void;
    }

    export function main(onReady: () => void): void;
  }
}
