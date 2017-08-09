# You want to: build RTC

### DOCKER IMAGES
- `Build`: we use several docker images to build RTC:
    - **Base images**:
        - *Crossbar*: base for Broker
        - *Dotnet*: base for Servers
        - *Eventstore*: base for PopulatedEventstore
        - *Nginx*: base for web, nsgate and minikubegate
        - *Node*: base to build web content
    - **RTC**:
        - *servers*: An image to run all backends services containers:
            - Analytics
            - Blotter
            - Broker
            - Pricing
            - ReferenceDataRead
            - TradeExecution
        - *Web*: This service host the static content and act as a proxy in fron of the broker
        - *PopulatedEventstore*: A populated version of the eventstore image. We use servers to populate
        - *Broker*: A crossbar image with the configuration
    - **Utilities**:
        - *Gcloud*: image used for the clis Gcloud and Kubectl
        - *Minikugegate*: image that give access to RTC when running on local minikube cluster
        - *Nsgate*: image that give access to RTC when running on google cloud
        - *Testtools*: image with simple utilitise to connect and debug other services

TODO
