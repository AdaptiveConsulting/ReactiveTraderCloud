## NB! This manual is for running backend without docker, if you don't plan to debug back-end it may be easier to follow docker route: [Understand rtc build and deployments guide](./deployment/understand-rtc-build-and-deployments.md)

Reactive Trader Cloud - Server
===============

* [Getting Started on Windows](./setup/windows-setup.md)
* [Getting Started on Linux](./setup/linux-setup.md)
* [Getting Started on Mac OS](./setup/macos-setup.md)


## Overview

The server is made up of separate distributed services. They communicate with the client via a broker and can each be run in its own Docker container.

They are written in .NET running cross-platform with .NET Core with [.NET Platform Standard](https://github.com/dotnet/corefx/blob/master/Documentation/architecture/net-platform-standard.md) 1.3.

The cross-platform capability opens the door to a wide range of deployment tools and techniques such as Docker and Kubernetes. These in turn allow for consistent deployment environments and ease of management for deployed containers.

An event sourcing approach is used for persistence, with [Event Store](https://geteventstore.com/) as the backing implementation. This provides many advantages, including data resiliency and facilitates re-hydration of state.

Multiple instances of each service run concurrently for fail-over purposes. Each service instance broadcasts heartbeats, and the client is able to switch to a different instance if the connected instance is no longer reachable. Using this mechanism, load balancing strategies can also be implemented.
