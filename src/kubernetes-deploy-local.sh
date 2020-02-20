# set environment variables
export DOCKER_USER=reactivetradercloud
export BUILD_VERSION=0.0.0

# build images
docker-compose -f ./docker-compose.yml -f ./docker-compose.deploy.yml build

# create ccyPairs in Event Store
docker-compose -f ./docker-compose.yml run servers
docker commit eventstore_base ${DOCKER_USER}/eventstore:${BUILD_VERSION}

# deployments and services
kubectl scale deploy --replicas=0 --all
for f in ./services/kubernetes/*-deployment.yaml; do     cat $f | /usr/bin/envsubst | kubectl apply -f -; done
for f in ./services/kubernetes/*-service.yaml; do     cat $f | /usr/bin/envsubst | kubectl apply -f -; done

# wait for deployments
kubectl wait deployment.apps/web-deployment --for condition=available
kubectl wait deployment.apps/broker-deployment --for condition=available

# port forwarding to kubernetes 
kubectl port-forward svc/web 80