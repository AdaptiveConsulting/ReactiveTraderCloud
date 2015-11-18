using Microsoft.AspNet.Builder;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Logging;

namespace HelloWeb
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSignalR();
        }

        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            System.Console.WriteLine("Startup ...");

            app.UseWelcomePage("/welcome");
            app.UseStaticFiles();
            app.UseWebSockets();
            app.RunSignalR();
        }
    }
}