Reactive Trader 2 - Server
===============

[Getting Started on Windows](../../docs/vs-setup.md)

[Getting Started on Linux](../../docs/linux-setup.md)

[Getting Started on Mac OS](../../docs/macos-setup.md)


## Overview

The server is made up of separate distributed services. They communicate with the client via a broker and can each be run in its own Docker container.

They are written in .NET running cross-platform with DNX. Specifically with the full clr on Windows and mono on Linux/OSX. A migration to [.NET Platform Standard](https://github.com/dotnet/corefx/blob/master/Documentation/project-docs/standard-platform.md) is planned when support from dependent libraries become available.

The cross-platform capability opens the door to a wide range of deployment tools and techniques such as Docker and Kubernetes. These in turn allow for consistent deployment environments and ease of management for deployed containers. 

An event sourcing approach is used for persistence, with [Event Store](https://geteventstore.com/) as the backing implementation. This provides many advantages, including data resiliency and facilitates rehydration of state.

Multiple instances of each service run concurrently for fail-over purposes. Each service instance broadcasts heartbeats, and the client is able to switch to a different instance if the connected instance is no longer reachable. Using this mechanism, load balancing strategies can also be implemented.