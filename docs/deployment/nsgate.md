# Nsgate - Gcloud Cluster Front Loadbalancer
There are different approach to connect to a kubernetes cluster.
- [kubernetes service resource][service-official-doc]
- [kubernetes ingress resource][ingress-official-doc]

The solution we use is the **kubernetes service** resource. It's a load balancers level 4.  
The problem you can encounter is that a service comes with an external IP. That external IP can be generated when you create the service or reserved in advance. But how to predict the numbers of environments you need. You also have to manage the new dns records to access your environments. These records then have to propagate ...

## High level
To bypass all these problems, we have created a container that we name **nsgate** as **namespace-gate**. This one is running scaled behind a **kubernetes service** with one static external ip. We have created a domain for the cluster **adaptivecluster.com** and we redirect all subdomains ***.adaptivecluster.com** to this static ip in order that every connection goes through **nsgate**. **nsgate** is a nginx service that will read the subdomain to dynamicly choose the backend to proxy the connection to.

## Mechanism
### Configuration
In a loop:
1) get all namespaces definitions
1) foreach namespace, get all service that ask to be public (we use kubernetes label to define that)
1) foreach service, create a nginx proxy rule that will handle **<SERVICE_NAME>-<NAMESPACE_NAME>.<CLUSTER_NAME>**: (ie: web-demo.adaptivecluster.com will be redirected to the service web in the namespace demo)

### SSL
**nsgate** also provide SSL.  
You can connect to services with **http** or **https**

### Issue with 404
At the moment, the default 404 rule is not handled well.  
This will result in **https://foo-bar.adaptivecluster.com** being redirected to the first proxy configuration.  
The issue is only present with https. **http://foo-bar.adaptivecluster.com** is redirected to 404.

[service-official-doc]: https://kubernetes.io/docs/concepts/services-networking/service/
[ingress-official-doc]: https://kubernetes.io/docs/concepts/services-networking/ingress/
