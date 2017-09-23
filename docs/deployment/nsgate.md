# Nsgate - Gcloud Cluster Front Loadbalancer
## Cluster access
There are different approach to connect to a Kubernetes cluster.
- [Kubernetes service resource][service-official-doc]
- [Kubernetes ingress resource][ingress-official-doc]

### Problematic
The problem we encounter is how to access the different containers. Do you want an IP per container or one IP for everything ?  
A **Kubernetes service** can give you an external IP. That external IP can be generated when you create the **Kubernetes service** or be reserved in advance. You optionaly have to manage the new dns records to access your environments. These records then require time to propagate ...

Depending on the project context, you can or cannot predict the numbers of environments you need. In Reactive Trader Cloud, we start and stop environments all the time. So we decided to have one IP and that we would differentiate environments access with the subdomain of the DNS record.

The **Kubernetes ingress** are load balancer level 7, but these one didn't exist at Reactive Trader Cloud creation time. Anyway, the **Kubernetes ingress** comes with websocket limitations that doesn't match our current case.

The **Kubernetes service** resource is a load balancers level 4. So we did have to implement a small program named **nsgate** based on **nginx** that do the load balancers level 7 for us without the ingress limitations.

## High level
**nsgate** means **namespace-gate**. It concists of 2 containers running behind a **Kubernetes service** with one static external ip. We have created a domain for the cluster **adaptivecluster.com** and we redirect all subdomains **wildcard.adaptivecluster.com** to this static ip in order that every connection goes through **nsgate**. **nsgate** is a nginx service that will read the subdomain to dynamicly choose the backend to proxy the connection to.

## Mechanism
### Configuration
In a loop:
1) get all namespaces definitions
1) foreach namespace, get all service that ask to be public (we use Kubernetes label to define that)
1) foreach service, create a nginx proxy rule that will handle **<SERVICE_NAME>-<NAMESPACE_NAME>.<CLUSTER_NAME>**: (ie: web-demo.adaptivecluster.com will be redirected to the service web in the namespace demo)

### SSL
**nsgate** also provide SSL.  
You can connect to services with **http** or **https**

### Issue with 404
At the moment, the default 404 rule is not handled well.  
This will result in **https://foo-bar.adaptivecluster.com** being redirected to the first proxy configuration.  
The issue is only present with https. **http://foo-bar.adaptivecluster.com** is redirected to 404.

[service-official-doc]: https://Kubernetes.io/docs/concepts/services-networking/service/
[ingress-official-doc]: https://Kubernetes.io/docs/concepts/services-networking/ingress/

## Update
- update the code as expected (/deploy/docker/nsgate)
- choose the build number by looking latest nsgate built
- `./deploy/docker/helpers/listAllTags.sh weareadaptive/nsgate`
- `./deploy/debug/build-and-update-nsgate.sh build`
