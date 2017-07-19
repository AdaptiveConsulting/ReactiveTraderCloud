Adaptive.ReactiveTrader.Client.Domain
-------------------------------------

This projects contains the reactive trader client API one can use to interact with the server.

The API entry point is the ReactiveTrader class.

You can find a sample usage of this API in ..\ReactiveTraderLinqPad.linq

The API is designed following a layered architecture:
 - the upper level is composed of domain objects and repositories:
   - repositories allow the consumer to load and access domain objects, their public API uses domain objects
   - domain objects encapsulate business logic and allow to perform actions such as listening to a price stream, executing a trade, etc. 
 - repositories are seating on top of ServiceClients. ServiceClients wrap the details of the transport used and offer a public interface which is agnostic to the underlying transport
 - finally ServiceClients use the transport layer, which implements the connectivity with the backend (in this case using SignalR)