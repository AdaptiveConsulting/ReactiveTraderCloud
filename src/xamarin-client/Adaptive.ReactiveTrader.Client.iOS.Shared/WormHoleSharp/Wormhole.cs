using System;
using Foundation;
using System.IO;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace WormHoleSharp
{
	public class Wormhole : NSObject
	{
		// #include <CoreFoundation/CoreFoundation.h>
		const string WormholeNotificationName = "WormholeNotificationName";

		public string ApplicationGroupIdentifier { get; set; }

		public string Directory { get; set; }

		public NSFileManager FileManager { get; set; }


		public Wormhole (string identifier, string directory)
		{

			this.ApplicationGroupIdentifier = identifier;
			this.Directory = directory;
			this.FileManager = new NSFileManager ();
			NSNotificationCenter.DefaultCenter.AddObserver ((NSString)WormholeNotificationName, DidReceiveMessageNotification);
			CFNotificationCenter.DarwinCenter.NotificationChanged += wormholeNotificationCallback;
		

		}

		protected override void Dispose (bool disposing)
		{
			base.Dispose (disposing);
			NSNotificationCenter.DefaultCenter.RemoveObserver (this);
			CFNotificationCenter.DarwinCenter.RemoveEveryObserver ();
		}

		string MessagePassingDirectoryPath ()
		{
			var appGroupContainer = FileManager.GetContainerUrl (ApplicationGroupIdentifier);
			if (appGroupContainer == null)
				throw new Exception ("App groups are not properly setup. Make sure you added the app group to the entitlements");
			string appGroupContainerPath = appGroupContainer.Path;
			string directoryPath = appGroupContainerPath;
			if (this.Directory != null) {
				directoryPath = Path.Combine (appGroupContainerPath, this.Directory);
			}

			this.FileManager.CreateDirectory (directoryPath, true, null);
			return directoryPath;
		}

		string FilePathForIdentifier (string identifier)
		{
			if (identifier == null || identifier.Length == 0) {
				return null;
			}

			string directoryPath = this.MessagePassingDirectoryPath ();
			string fileName = string.Format ("{0}.archive", identifier);
			string filePath = Path.Combine (directoryPath, fileName);
			return filePath;
		}

		void WriteMessageObjectToFileWithIdentifier (object messageObject, string identifier)
		{
			if (identifier == null) {
				return;
			}


			string filePath = this.FilePathForIdentifier (identifier);
			if (filePath == null) {
				return;
			}

			try {
                File.WriteAllText (filePath, Newtonsoft.Json.JsonConvert.SerializeObject (messageObject, new JsonSerializerSettings { 
                    ReferenceLoopHandling = ReferenceLoopHandling.Serialize
                }));
				this.SendNotificationForMessageWithIdentifier (identifier);
			} catch (Exception ex) {
				Console.WriteLine (ex);
			}


		}

		string MessageObjectFromFileWithIdentifier (string identifier)
		{
			try {
				if (identifier == null) {
					return null;
				}
				return File.ReadAllText (this.FilePathForIdentifier (identifier));

			} catch (Exception ex) {
				Console.WriteLine (ex);
			}

			return string.Empty;
		}

		void DeleteFileForIdentifier (string identifier)
		{
			NSError error;
			this.FileManager.Remove (this.FilePathForIdentifier (identifier), out error);
		}

		void SendNotificationForMessageWithIdentifier (string identifier)
		{
			CFNotificationCenter.DarwinCenter.PostNotification (identifier);
		}

		void RegisterForNotificationsWithIdentifier (string identifier)
		{
			CFNotificationCenter.DarwinCenter.AddObserver (identifier);
		}

		void UnregisterForNotificationsWithIdentifier (string identifier)
		{
			CFNotificationCenter.DarwinCenter.RemoveNotificationObserver (identifier);
		}

		void wormholeNotificationCallback (object sender, CFNotificationCenter.NoticationEventArgs message)
		{
			NSNotificationCenter.DefaultCenter.PostNotificationName (WormholeNotificationName, null, NSDictionary.FromObjectAndKey ((NSString)message.Message, (NSString)"identifier"));
		}

		void DidReceiveMessageNotification (NSNotification notification)
		{

			var userInfo = notification.UserInfo;
			var identifier = userInfo.ObjectForKey ((NSString)"identifier");
			if (identifier == null)
				return;
			var id = identifier.ToString ();
			var type = TypeForId (id);
			if (type == null)
				return;

			var message = this.MessageObjectFromFileWithIdentifier (identifier.ToString ());
			var messageObject = Newtonsoft.Json.JsonConvert.DeserializeObject (message, type);
			this.InvokeActions (id, messageObject);

		}


		public void PassMessage (string identifier, object message)
		{
			this.WriteMessageObjectToFileWithIdentifier (message, identifier);
		}

		public T MessageWithIdentifier<T> (string identifier)
		{
			try {
				var messageObject = this.MessageObjectFromFileWithIdentifier (identifier);

				return Newtonsoft.Json.JsonConvert.DeserializeObject<T> (messageObject);
			} catch (Exception ex) {
				Console.WriteLine (ex);
			}
			return default(T);
		}

		void ClearMessageContentsForIdentifier (string identifier)
		{
			this.DeleteFileForIdentifier (identifier);
		}

		void ClearAllMessageContents ()
		{
			if (this.Directory != null) {
				NSError error;
				var messageFiles = this.FileManager.GetDirectoryContent (this.MessagePassingDirectoryPath (), out error);
				string directoryPath = this.MessagePassingDirectoryPath ();
				foreach (string path in messageFiles) {
					string filePath = Path.Combine (directoryPath, path);
					this.FileManager.Remove (filePath, out error);
				}
			}

		}

		public void ListenForMessage<T> (string identifier, Action<T> listener)
		{
			if (identifier != null) {

				identifierTypes [identifier] = typeof(T);
				this.delegateMap [identifier] = listener;
				this.RegisterForNotificationsWithIdentifier (identifier);
			}

		}

		public void StopListeningForMessageWithIdentifier (string identifier)
		{
			if (identifier != null) {

				this.delegateMap [identifier] = null;
				this.UnregisterForNotificationsWithIdentifier (identifier);
			}

		}

		Dictionary<string, object> delegateMap = new Dictionary<string, object> ();
		Dictionary<string, Type> identifierTypes = new Dictionary<string, Type> ();

		void InvokeActions<T> (string id, T item)
		{
			object tmp;
			if (delegateMap.TryGetValue (id, out tmp)) {
				var action = (tmp as Delegate);
				action.DynamicInvoke (item);
			}
		}

		Type TypeForId (string id)
		{
			Type type;
			if (identifierTypes.TryGetValue (id, out type)) {
				return type;
			}
			return null;
		}

	}
}

