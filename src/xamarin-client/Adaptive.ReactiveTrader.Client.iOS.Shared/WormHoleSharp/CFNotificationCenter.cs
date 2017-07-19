using System;
using System.Runtime.InteropServices;
using CoreFoundation;
using System.Collections;
using System.Collections.Generic;
using Foundation;
using CFNotificationCenterRef=global::System.IntPtr;
using ObjCRuntime;


namespace WormHoleSharp
{
	public enum CFNotificationSuspensionBehavior
	{
		Drop = 1,
		Coalesce = 2,
		Hold = 3,
		DeliverImmediately = 4
	}

	delegate void CFNotificationCallback (CFNotificationCenterRef center, IntPtr observer, IntPtr name, IntPtr obj, IntPtr userInfo);
	public class CFNotificationCenter  : INativeObject, IDisposable
	{
		public class NoticationEventArgs : EventArgs
		{
			public NoticationEventArgs(string message)
			{
				Message = message;
			}
			public string Message {get; }
		}
		#region INativeObject implementation

		CFNotificationCenterRef handle;
		public CFNotificationCenterRef Handle => handle;

	    #endregion

		public delegate void NotificationChangeEventHandler (object sender, NoticationEventArgs notification);

		public event NotificationChangeEventHandler NotificationChanged;


		internal CFNotificationCenter (CFNotificationCenterRef reference)
		{
			this.handle = reference;
		}

		static CFNotificationCenter darwinCenter;

		public static CFNotificationCenter DarwinCenter => darwinCenter ?? (darwinCenter = new CFNotificationCenter (GetDarwinNotifyCenter ()));


	    static CFNotificationCenter localCenter;

		public static CFNotificationCenter LocalCenter => localCenter ?? (localCenter = new CFNotificationCenter (GetLocalCenter ()));

	    public void Dispose ()
		{
			Dispose (true);
			GC.SuppressFinalize (this);
		}

		protected virtual void Dispose (bool disposing)
		{
			if (handle != IntPtr.Zero) {
				handle = IntPtr.Zero;
			}
			RemoveEveryObserver ();
		}

		static Dictionary<CFNotificationCenterRef,CFNotificationCenter> centers = new Dictionary<CFNotificationCenterRef,CFNotificationCenter> ();
		int ObserverCount = 0;

		public void AddObserver (string value, CFNotificationSuspensionBehavior suspensionBehavior = CFNotificationSuspensionBehavior.DeliverImmediately)
		{
			ObserverCount++;
			centers [handle] = this;
			var strHandle = value == null ? IntPtr.Zero : NSString.CreateNative (value);
			AddObserver (center: handle,
				observer: handle,
				callback: NotificationCallback,
				name: strHandle,
				obj: IntPtr.Zero,
				suspensionBehavior: suspensionBehavior);
			if (value != null)
				NSString.ReleaseNative (strHandle);

		}

		void notification (CFString name, NSDictionary userInfo)
		{
			var evt = NotificationChanged;
			if (evt == null)
				return;
			evt (this,new NoticationEventArgs(name.ToString ()));
		}

		[ObjCRuntime.MonoPInvokeCallback (typeof(CFNotificationCallback))]
		static void NotificationCallback (CFNotificationCenterRef center, IntPtr observer, IntPtr name, IntPtr obj, IntPtr userInfo)
		{
			CFNotificationCenter cfn;
			if (centers.TryGetValue (center, out cfn))
				cfn.notification (new CFString(name), Runtime.GetNSObject<NSDictionary> (userInfo));
		}

		public void PostNotification(string notification)
		{
			var strHandle = NSString.CreateNative (notification);
			PostNotification (handle, strHandle, IntPtr.Zero, IntPtr.Zero, true);
			NSString.ReleaseNative (strHandle);
		}

		public void RemoveNotificationObserver(string notification)
		{
			ObserverCount--;
			var strHandle = NSString.CreateNative (notification);
			RemoveObserver (handle, this.Handle, NotificationCallback, new CFString (notification).Handle, IntPtr.Zero);
			NSString.ReleaseNative (strHandle);
			if (ObserverCount <= 0 && centers.ContainsKey(handle))
				centers.Remove (handle);
		}

		public void RemoveEveryObserver()
		{
			ObserverCount = 0;
			RemoveEveryObserver (handle, handle);
			var evt = NotificationChanged.GetInvocationList ();
			foreach (var e in evt)
				NotificationChanged -= (NotificationChangeEventHandler)e;

			if (centers.ContainsKey(handle))
				centers.Remove (handle);
		}


		[DllImport ("__Internal", CharSet = CharSet.Auto, EntryPoint = "CFNotificationCenterGetDarwinNotifyCenter")]
	 	static extern CFNotificationCenterRef GetDarwinNotifyCenter ();

		[DllImport ("__Internal", CharSet = CharSet.Auto, EntryPoint = "CFNotificationCenterGetLocalCenter")]
		static extern CFNotificationCenterRef GetLocalCenter ();

		[DllImport ("__Internal", CharSet = CharSet.Auto, EntryPoint = "CFNotificationCenterAddObserver")]
		static extern unsafe void AddObserver (CFNotificationCenterRef center, IntPtr observer, CFNotificationCallback callback, IntPtr name, IntPtr obj, CFNotificationSuspensionBehavior suspensionBehavior);

		[DllImport ("__Internal", CharSet = CharSet.Auto, EntryPoint = "CFNotificationCenterPostNotification")]
		static extern unsafe void PostNotification (CFNotificationCenterRef center,IntPtr name,  IntPtr obj, IntPtr userInfo, bool deliverImmediately);

		[DllImport ("__Internal", CharSet = CharSet.Auto, EntryPoint = "CFNotificationCenterRemoveObserver")]
		static extern unsafe void RemoveObserver (CFNotificationCenterRef center, IntPtr observer, CFNotificationCallback callback, IntPtr name, IntPtr obj);


		[DllImport ("__Internal", CharSet = CharSet.Auto, EntryPoint = "CFNotificationCenterRemoveEveryObserver")]
		static extern unsafe void RemoveEveryObserver (CFNotificationCenterRef center, IntPtr observer);
	}
}

