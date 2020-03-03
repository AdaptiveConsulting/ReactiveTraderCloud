# Reactive Trader Cloud - Server

## Overview

The server is made up of separate distributed services. They communicate with the client via a broker and can each be run in its own Docker container.

They are written in .NET running cross-platform with .NET Core with [.NET Core](https://github.com/dotnet/corefx/blob/master/Documentation/architecture/net-core-applications.md) 3.1.

The cross-platform capability opens the door to a wide range of deployment tools and techniques such as Docker and Kubernetes. These in turn allow for consistent deployment environments and ease of management for deployed containers.

An event sourcing approach is used for persistence, with [Event Store](https://geteventstore.com/) as the backing implementation. This provides many advantages, including data resiliency and facilitates re-hydration of state.

Multiple instances of each service run concurrently for fail-over purposes. Each service instance broadcasts heartbeats, and the client is able to switch to a different instance if the connected instance is no longer reachable. Using this mechanism, load balancing strategies can also be implemented.

## DotNet server components

[Getting Started](./setup/setup.md)

## Node server components

Some services are using node.js and can be started independently with [Node](./server-node.md).

- Price History
- Nlp
- Bot
- Openfin Config
