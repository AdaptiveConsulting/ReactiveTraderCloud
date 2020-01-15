export interface OpenFinApplicationConfiguration {
  /**
   * Set this object to co-deploy native apps along with your app.
   */
  appAssets?: {
    /**
     * Name of the asset. The name will be used in launchExternalProcess to launch the asset.
     */
    alias: string
    /**
     * The default command line arguments for the aforementioned target.
     */
    args?: string
    /**
     * URL to a zip file containing the package files (executables, dlls, etc…).
     */
    src: string
    /**
     * Specifies default executable to launch. This option can be overridden in launchExternalProcess.
     */
    target?: string
    /**
     * Version of the package. To force new updates, increment the version.
     */
    version: string
  }[]
  /**
   * If an application specifies a valid “assetsUrl”, then that “assetsUrl” will be used as the base portion of the URL instead of the OpenFin default, https://developer.openfin.co/release/.
   */
  assets_url?: string
  /**
   * You can access the Chromium development tools by navigating to the selected port, i.e.: http://localhost:9090.
   */
  devtools_port?: number
  /**
   * An optional object to customize the appearance of the RVM progress dialog.
   */
  dialogSettings?: {
    /**
     * Determines the color of the dialog. Color value is a decimal representation of a 32 bit number (A,R,G,B). For instance : FF00FF00 or 4278255360 is fully opaque green.
     */
    bgColor?: number
    /**
     * Determines the logo or image in the progress dialog. The logo should be a semi-transparent PNG. 100×25 pixels.
     */
    logo?: string
    /**
     * Determines the background color of the area where the progress bar is displayed.
     */
    progressBarBgColor?: number
    /**
     * Determines the border color of the progress bar.
     */
    progressBarBorderColor?: number
    /**
     * Determines the color of the progress bar.
     */
    progressBarFillColor?: number
    /**
     * Determines the color of the text displayed above the progress bar location.
     */
    textColor?: number
  }
  /**
   * A string used as a licensing identifier for each customer/contract (RVM 2.7+). The OpenFin team will generate this for your production app.
   */
  licenseKey?: string
  /**
   * Determines which runtime version the app will use.
   */
  runtime: {
    /**
     * Command line arguments to set when launching the runtime. The OpenFin Runtime supports Chromium command line switches e.g.: “– –disable-accelerated-compositing – –enable-threaded-compositing” for a complete list of values please refer to current Chromium switches.
     */
    arguments?: string
    /**
     * The RVM will fallback to this version if it fails to retrieve the desired Runtime version, assuming this version is already installed. (RVM 2.8+)
     */
    fallbackVersion?: string
    /**
     * If true, forces the runtime to always get the latest runtime version before launching (prevents background installs).
     */
    forceLatest?: boolean
    /**
     * Specifies what version of the runtime the app should use. The value can either be a specific version or a release channel (e.g. alpha).
     */
    version: string | 'alpha' | 'beta' | 'stable' | 'staging'
  }
  /**
   * Settings for the app’s desktop shortcut
   */
  shortcut: {
    /**
     * Company name for the application shortcut.
     */
    company: string
    /**
     * A short description of the application shortcut. Will be shown when hovering over the shortcut icon.
     */
    description?: string
    /**
     * If set to true, a desktop icon is always created on application start-up (even when user has deleted it). If set to false, a desktop icon is created on initial application launch but not created on subsequent application launches.
     */
    force?: boolean
    /**
     * Location for the icon image to be used when installing the application shortcut.
     */
    icon: string
    /**
     * Name of the application to display with the shortcut.
     */
    name: string
    /**
     * Set this value with a folder path (e.g. foo/bar) and the RVM will create the start menu shortcut under RootFolder/Company/App.
     */
    startMenuRootFolder?: string
    /**
     * Locations for where the application shortcut is added on the desktop owner’s machine. Available options are “desktop”, “start-menu” and “automatic-start-up”. The default is start-menu and desktop.
     */
    target?: ('automatic-start-up' | 'desktop' | 'start-menu')[]
    /**
     * Removes the Start menu uninstall shortcut.
     */
    'uninstall-shortcut'?: boolean
  }
  /**
   * You can specify an image to display while the runtime is loading. It takes any image file (including semi-transparent PNGs).
   */
  splashScreenImage?: string
  /**
   * Specifies the application level configuration.
   */
  startup_app: {
    /**
     * The name of this builder instance, which can be specified in the only/except property of a provisioner.
     */
    accelerator?: {
      /**
       * If true, allows the Dev Tools to be opened with the keyboard shortcut: Ctrl+Shift+i.
       */
      devtools?: boolean
      /**
       * If true, allows a window to reload with the keyboard shortcuts: Ctrl+r or F5.
       */
      reload?: boolean
      /**
       * If true, allows a window to reload while ignoring the cache with the keyboard shortcuts: Ctrl+Shift or Shift+F5.
       */
      reloadIgnoreCache?: boolean
      /**
       * If true, enables the Zoom keyboard shortcuts: Ctrl+ (Zoom in), Ctrl- (Zoom out) and Ctrl+0 (Restore to 100%).
       */
      zoom?: boolean
    }
    /**
     * A flag to always position the window at the top of the window stack.
     */
    alwaysOnTop?: boolean
    /**
     * A URL for the icon to be shown in the window title bar.
     */
    applicationIcon?: string
    /**
     * A flag to automatically show the Window when it is created.
     */
    autoShow?: boolean
    /**
     * Allow non API created child windows, such as window.open, to authenticate.
     */
    childWindowAutoAuth?: boolean
    /**
     * Clear InterApplication subscriptions of all child windows when main window is reloaded.
     */
    clearChildSubscriptionsOnReload?: boolean
    /**
     * A flag to show the context menu when right-clicking on a window. Gives access to the Developer Console for the Window.
     */
    contextMenu?: boolean
    /**
     * This defines and applies rounded corners for the window.
     */
    cornerRounding?: {
      /**
       * This defines and applies rounded corners for the window.
       */
      height?: number
      /**
       * This defines and applies rounded corners for the window.
       */
      width?: number
    }
    /**
     * Specifies that the window will be positioned in the center of the primary monitor when loaded for the first time on a machine. When the window corresponding to that id is loaded again, the position from before the window was closed is used.
     */
    defaultCentered?: boolean
    /**
     * The default height of the window. Specifies the height of the window when loaded for the first time on a machine. When the window corresponding to that id is loaded again, the height is taken to be the last height of the window before it was closed.
     */
    defaultHeight?: number
    /**
     * The default left position of the window. Specifies the position of the left of the window when loaded for the first time on a machine. When the window corresponding to that id is loaded again, the value of left is taken to be the last value before the window was closed.
     */
    defaultLeft?: number
    /**
     * The default top position of the window. Specifies the position of the top of the window when loaded for the first time on a machine. When the window corresponding to that id is loaded again, the value of top is taken to be the last value before the window was closed.
     */
    defaultTop?: number
    /**
     * The default width of the window. Specifies the width of the window when loaded for the first time on a machine. When the window corresponding to that id is loaded again, the width is taken to be the last width of the window before it was closed.
     */
    defaultWidth?: number
    /**
     * The name for the window which must be unique within the context of the invoking Application.
     */
    description?: string
    /**
     * A flag to show the frame.
     */
    frame?: boolean
    /**
     * A URL for the icon to be shown in the window title bar.
     */
    icon?: string
    /**
     * The maximum height of a window. Will default to the OS defined value if set to -1.
     */
    maxHeight?: number
    /**
     * A flag that lets the window be maximized.
     */
    maximizable?: boolean
    /**
     * The maximum width of a window. Will default to the OS defined value if set to -1.
     */
    maxWidth?: number
    /**
     * The minimum height of a window.
     */
    minHeight?: number
    /**
     * The minimum width of a window.
     */
    minWidth?: number
    /**
     * The name for the window which must be unique within the context of the invoking Application.
     */
    name: string
    /**
     * A flag to configure the application as a non persistent. Runtime exits if there are no persistent apps running.
     */
    nonPersistent?: boolean
    /**
     * A flag that specifies how transparent the window will be. This value is clamped between 0.0 and 1.0.
     */
    opacity?: number
    /**
     * Enable secured APIs
     */
    permissions?: {
      ExternalWindow?: {
        wrap?: boolean
        [k: string]: any
      }
      System?: {
        downloadAsset?: boolean
        getAllExternalWindows?: boolean
        launchExternalProcess?: boolean
        readRegistryValue?: boolean
        terminateExternalProcess?: boolean
        [k: string]: any
      }
      [k: string]: any
    }
    /**
     * A flag to drop to allow the user to resize the window.
     */
    resizable?: boolean
    /**
     * Define the attributes of the window's resize region.
     */
    resizeRegion?: {
      /**
       * Defines a region in pixels of an additional square at the bottom right corner of a frameless window.
       */
      bottomRightCorner?: number
      /**
       * Defines a region in pixels that will respond to user mouse interaction for resizing a frameless window.
       */
      size?: number
    }
    /**
     * A flag to cache the location of the window or not.
     */
    saveWindowState?: boolean
    /**
     * A flag to show the Window’s icon in the taskbar.
     */
    showTaskbarIcon?: boolean
    /**
     * A string that sets the window to be “minimized”, “maximized”, or “normal” on creation.
     */
    state?: 'maximized' | 'minimized' | 'normal'
    /**
     * The URL of an icon to be shown on the desktop. Support formats: Portable Network Graphic (PNG); Size: 256 x 256.
     */
    taskbarIcon?: string
    /**
     * Group your OpenFin apps in the Taskbar. v5.0+
     */
    taskbarIconGroup?: string
    /**
     * The URL of the window.
     */
    url: string
    /**
     * The UUID of the application, unique within the set of all other Applications running in OpenFin Runtime.
     */
    uuid: string
    /**
     * When set to false, the page will render before the “load” event is fired on the window. Caution, when false you will see an initial empty white window.
     */
    waitForPageLoad?: boolean
  }
  /**
   * An optional object to customize error messages.
   */
  supportInformation?: {
    /**
     * Displays the company name in the title bar for the support error dialog that appears when an application fails to load.
     */
    company: string
    /**
     * Displays the email to contact in the support error dialog that appears when an application fails to load.
     */
    email: string
    /**
     * To disable the error reporting feature, set this value to false.
     */
    enableErrorReporting?: boolean
    /**
     * When set to true, prompts end users with a dialog when a deployment error occurs from within the RVM and enables them send along log files from their machine. Error reports are delivered to your email address set in supportInformation.
     */
    forwardErrorReports?: boolean
    /**
     * Displays the product name or application name in the support error dialog that appears when an application fails to load.
     */
    product: string
  }
}
