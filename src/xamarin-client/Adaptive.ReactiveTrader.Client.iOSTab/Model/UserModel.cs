using System;
using System.Diagnostics;

namespace Adaptive.ReactiveTrader.Client.iOSTab
{
	public sealed class UserModel : NotifyingModel<UserModel>
	{
		private static readonly UserModel instance = new UserModel();

		private Boolean _oneTouchTradingEnabled = true;
		private String _traderId; // Note that these IDs are random; not unique, yet!

		//
		// Explicit static constructor to tell C# compiler not to mark type as beforefieldinit
		// See http://csharpindepth.com/Articles/General/Singleton.aspx .
		//

		static UserModel()
		{
		}

		//
		// Private constructor for singleton pattern.
		//

		private UserModel()
		{
			var random = new System.Random();
			_traderId = String.Format("iOS-{0}-{1}", Process.GetCurrentProcess ().Id, random.Next(65536).ToString("X4"));
			System.Console.WriteLine ("UserModel's random TraderId is {0}", _traderId);
		}

		public static UserModel Instance => instance;

	    public String TraderId => _traderId;

	    public Boolean OneTouchTradingEnabled
		{
			get {
				return (_oneTouchTradingEnabled);
			}
			set {
				if (_oneTouchTradingEnabled != value) {
					_oneTouchTradingEnabled = value;
					NotifyOnChanged (this);
				}
			}
		}
			
	}
}

