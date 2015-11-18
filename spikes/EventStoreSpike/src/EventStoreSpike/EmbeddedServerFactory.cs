using System;
using System.Net;
using System.Threading;
using EventStore.ClientAPI.Embedded;
using EventStore.Core;
using EventStore.Core.Data;
using EventStore.Core.Services.Transport.Http.Controllers;

namespace EventStoreSpike
{
    public class EmbeddedServerFactory
    {
        public static ClusterVNode Create()
        {
            var timeout = TimeSpan.FromSeconds(10);

            const int httpExternalPort = 2113;

            var builder = EmbeddedVNodeBuilder.AsSingleNode()
                //Getting OOM exception on TC builds.
                // This link seems to suggest that we can se the chunksize to something smaller (https://groups.google.com/forum/#!topic/event-store/bER82NC1wDY)
                .WithTfChunkSize(10 * 1024 * 1024)
                .RunInMemory()
                .RunProjections(ProjectionsMode.All)
                .NoStatsOnPublicInterface()
                .WithInternalTcpOn(new IPEndPoint(IPAddress.Loopback, 1112))
                .WithExternalTcpOn(new IPEndPoint(IPAddress.Loopback, 1113))
                .WithInternalHttpOn(new IPEndPoint(IPAddress.Loopback, 2112))
                .WithExternalHttpOn(new IPEndPoint(IPAddress.Loopback, httpExternalPort))
                .AddExternalHttpPrefix($"http://localhost:{httpExternalPort}/")
                .AddExternalHttpPrefix($"http://127.0.0.1:{httpExternalPort}/")
                .RunInMemory();

            var clusterVNode = builder.Build();

            var startedEvent = new ManualResetEventSlim(false);

            EventHandler<VNodeStatusChangeArgs> clusterVNodeOnNodeStatusChanged = (sender, args) =>
            {
                if (args.NewVNodeState != VNodeState.Master)
                {
                    return;
                }

                // This sets up the handler for the web UI. Needed if we want to browse the streams
                clusterVNode.ExternalHttpService.SetupController(new ClusterWebUiController(clusterVNode.MainQueue, new NodeSubsystems[0]));

                startedEvent.Set();
            };

            clusterVNode.NodeStatusChanged += clusterVNodeOnNodeStatusChanged;

            try
            {
                clusterVNode.Start();

                if (!startedEvent.Wait(timeout))
                {
                    throw new TimeoutException($"EventStore hasn't started in {timeout} seconds.");
                }

                return clusterVNode;
            }
            finally
            {
                clusterVNode.NodeStatusChanged -= clusterVNodeOnNodeStatusChanged;
            }
        }
    }
}