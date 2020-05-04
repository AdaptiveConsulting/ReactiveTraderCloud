export function listen(channel, callback) {
    FSBL.Clients.RouterClient.addListener(channel, callback);
}

export function query(channel, payload, callback) {
    FSBL.Clients.RouterClient.query(channel, payload, callback);
}