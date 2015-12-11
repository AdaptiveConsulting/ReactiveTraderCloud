import _ from 'lodash';

export default class StubAutobahnProxy {
    constructor(){
        this.onOpenCallbacks = [];
        this.onCloseCallbacks = [];
        this.openCallCount = 0;

        this.session = {
            subscribe: (topic, callback) => {}
        };
    }
    open() {
        this.openCallCount++;
    }
    onopen(callback) {
        this.onOpenCallbacks.push(callback);
    }
    onclose(callback) {
        this.onCloseCallbacks.push(callback);
    }

    setIsConnected(isConnected) {
        if(isConnected) {
            _.forEach(this.onOpenCallbacks, onOpen => onOpen());
        } else {
            _.forEach(this.onCloseCallbacks, onClose => onClose());
        }
    }
}


class StubAutobahnSession {
    subscribe(operationName, onResultsCallback) {
        return  new Promise((resolve, reject) =>{

            if (!pickedInstanceID){
                return reject(new Error('No instance for ' + proc));
            }
            this.transport.remoteCall(subscription, pickedInstanceID).then(resolve, reject);

        });
    }

    unsubscribe(operationName) {

    }
}
