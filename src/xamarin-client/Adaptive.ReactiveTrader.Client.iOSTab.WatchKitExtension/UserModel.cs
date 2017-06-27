using System;
using System.Diagnostics;

namespace Adaptive.ReactiveTrader.Client.iOSTab.WatchKitExtension
{

    public sealed class UserModel 
    {
        private static readonly UserModel instance = new UserModel();
        private readonly string _traderId; // Note that these IDs are random; not unique, yet!

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
            _traderId = String.Format("watchOS-{0}-{1}", Process.GetCurrentProcess ().Id, random.Next(65536).ToString("X4"));
            System.Console.WriteLine ("UserModel's random TraderId is {0}", _traderId);
        }

        public static UserModel Instance
        {
            get
            {
                return instance;
            }
        }

        public String TraderId
        {
            get {
                return _traderId;
            }
        }
    }
}
