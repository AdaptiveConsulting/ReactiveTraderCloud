Service Client
--------------

ServiceClients encapsulate the details of the transport used under the hood and offer a public interface which is agnostic to the underlying transport.

The current contract of service clients is the following:
 - all methods exposed by service clients should be asynchronous (ie. not block the caller)
 - request/response style interactions should expose an IObservable<TResponse> which 
    - will OnNext ONCE, then OnComplete OR or OnError
    - send the request on subscription (ie. the service client method should be lazy)
 - streaming style interactions (prices and blotter in this case) should return an IObservable<TUpdate> which
    - will OnNext for each update received
	- will OnError with a TransportDisconnectedException if the connection with the transport drops. It is then the responsibility of the caller to resubscribey .
 - service clients should not cache data, any call on a service client should result on a message being send on the wire
 