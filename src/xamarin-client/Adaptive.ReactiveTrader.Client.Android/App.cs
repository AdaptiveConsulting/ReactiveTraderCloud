using Adaptive.ReactiveTrader.Client.Android.Configuration;
using Adaptive.ReactiveTrader.Client.Configuration;
using Adaptive.ReactiveTrader.Client.Domain;
using Android.App;
using Android.Content.Res;
using Android.Util;
using Autofac;
using Java.Lang;

namespace Adaptive.ReactiveTrader.Client.Android
{
    static class App
    {
        private static IContainer _container;

        public static IContainer Container
        {
            get
            {
                if (_container == null)
                {
                    var bootstrapper = new Bootstrapper(Application.Context);
                    _container = bootstrapper.Build();
                }

                return _container;
            }
        }

        public static void Initialize()
        {
            var reactiveTraderApi = Container.Resolve<IReactiveTrader>();
            var username = Username;
            var servers = Container.Resolve<IConfigurationProvider>().Servers;

            reactiveTraderApi.Initialize(username, servers);
        }

        private static string _username;

        public static string Username
        {
            get
            {
                if (_username == null)
                {
                    _username = new UserProvider().Username;
                }

                return _username;
            }
        }

        public static bool IsTablet
        {
            get
            {
                
                var metrics = Resources.System.DisplayMetrics;
                float scaleFactor = metrics.Density;
                float widthDp = metrics.WidthPixels / scaleFactor;
                float heightDp = metrics.HeightPixels / scaleFactor;
                float smallestWidth = Math.Min(widthDp, heightDp);

                return (smallestWidth > 600);

            }
        }
    }
}