using System;
using System.Net;
using System.Threading;
using Adaptive.ReactiveTrader.EventStore.Connection;
using EventStore.ClientAPI;
using EventStore.ClientAPI.Embedded;
using EventStore.Core;
using EventStore.Core.Data;
using EventStore.Core.Services.Transport.Http.Controllers;

namespace Adaptive.ReactiveTrader.EventStore
{
    public class EmbeddedEventStore : IEventStore
    {
        private readonly Uri _uri;

        public EmbeddedEventStore()
        {
            _uri = EventStoreUri.Local;
            StartEmbeddedEventStore();

            Connection = EventStoreConnection.Create(EventStoreConnectionSettings.Default, _uri);
        }

        public IEventStoreConnection Connection { get; }

        private void StartEmbeddedEventStore()
        {
            var timeout = TimeSpan.FromSeconds(10);

            var internalTcpPort = _uri.Port - 1;
            var externalTcpPort = _uri.Port;
            var externalHttpPort = externalTcpPort + 1000;
            var internalHttpPort = internalTcpPort + 1000;

            var builder = EmbeddedVNodeBuilder.AsSingleNode()
                //Getting OOM exception on TC builds.
                // This link seems to suggest that we can se the chunksize to something smaller (https://groups.google.com/forum/#!topic/event-store/bER82NC1wDY)
                                              .WithTfChunkSize(10*1024*1024)
                                              .RunInMemory()
                                              .RunProjections(ProjectionsMode.All)
                                              .NoStatsOnPublicInterface()
                                              .WithInternalTcpOn(new IPEndPoint(IPAddress.Loopback, internalTcpPort))
                                              .WithExternalTcpOn(new IPEndPoint(IPAddress.Loopback, externalTcpPort))
                                              .WithInternalHttpOn(new IPEndPoint(IPAddress.Loopback, internalHttpPort))
                                              .WithExternalHttpOn(new IPEndPoint(IPAddress.Loopback, externalHttpPort))
                                              .AddExternalHttpPrefix($"http://localhost:{externalHttpPort}/")
                                              .AddExternalHttpPrefix($"http://127.0.0.1:{externalHttpPort}/")
                                              .WithExternalHeartbeatTimeout(TimeSpan.FromMinutes(5))
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
            }
            finally
            {
                clusterVNode.NodeStatusChanged -= clusterVNodeOnNodeStatusChanged;
            }
        }
    }
}