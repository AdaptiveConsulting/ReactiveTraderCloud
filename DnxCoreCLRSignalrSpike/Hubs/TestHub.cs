using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

namespace HelloWeb.Hubs
{
    public class TestHub : Hub
    {
        public TestHub()
        {
            System.Console.WriteLine("TestHub ctor");
        }

        public override Task OnConnected()
        {
            System.Console.WriteLine("Client connected :" + Context.ConnectionId);
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            System.Console.WriteLine("Client disconnected :" + Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }
    }
} 