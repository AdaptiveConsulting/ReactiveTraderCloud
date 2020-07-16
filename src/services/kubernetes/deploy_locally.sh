export DOCKER_USER='localhost:32000'
export BUILD_VERSION='0.0.0'
cd ../..
docker-compose build
docker-compose push

microk8s kubectl delete --all deployments -n reactive-trader-local
microk8s kubectl delete --all services -n reactive-trader-local

for f in ./services/kubernetes/*.yaml; do cat $f | /usr/bin/envsubst | microk8s kubectl apply -n reactive-trader-local -f -; done
