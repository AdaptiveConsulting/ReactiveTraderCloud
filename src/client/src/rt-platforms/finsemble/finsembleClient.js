import FSBL from '@chartiq/finsemble'

const LOG_NAME = 'FSBL:'

export function addListener(channel, callback) {
  console.log(`${LOG_NAME} listen on channel ${channel}`)
  FSBL.Clients.RouterClient.addListener(channel, callback)
}

export function transmit(channel, message) {
  console.log(`${LOG_NAME} transmit message ${message} on channel ${channel}`)
  FSBL.Clients.RouterClient.transmit(channel, message)
}

export function query(channel, payload, callback) {
  console.log(`${LOG_NAME} query with payload ${payload} on channel ${channel}`)
  FSBL.Clients.RouterClient.query(channel, payload, callback)
}

export function getActiveDescriptors(callback) {
  console.log(`${LOG_NAME} get active descriptors`)
  FSBL.Clients.LauncherCLient.getActiveDescriptors(callback)
}

export function spawn(command, args, callback) {
  console.log(`${LOG_NAME} spawn command ${command} with args ${args}`)
  FSBL.Clients.LauncherCLient.spawn(command, args, { addToWorkspace: true }, callback)
}

export function alert(topic, frequency, identifier, message, params) {
  console.log(`${LOG_NAME} alert on ${topic} message ${message}`)
  FSBL.UserNotification.alert(topic, frequency, identifier, message, params)
}
