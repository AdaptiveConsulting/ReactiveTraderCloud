import FSBL from '@chartiq/finsemble'

export class FinsembleClient {
  addListener(channel, callback) {
    FSBL.Clients.RouterClient.addListener(channel, callback)
  }

  transmit(topic, message) {
    FSBL.Clients.RouterClient.transmit(topic, message)
  }

  query(channel, payload, callback) {
    FSBL.Clients.RouterClient.query(channel, payload, callback)
  }

  getActiveDescriptors() {
    FSBL.Clients.LauncherCLient.getActiveDescriptors((error, activeWindows) => {})
  }

  spawn(command, args, callback) {
    FSBL.Clients.LauncherCLient.spawn(command, args, { addToWorkspace: true }, callback)
  }

  alert(topic, frequency, identifier, message, params) {
    FSBL.UserNotification.alert(topic, frequency, identifier, message, params)
  }
}
