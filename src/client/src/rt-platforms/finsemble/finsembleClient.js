import { getTradeNotificationContents } from "rt-platforms/browser/utils/sendNotification"

const LOG_NAME = 'FSBL:'

let FSBL = window.FSBL

export function addListener(channel, callback) {
  if (FSBL) {
    console.log(`${LOG_NAME} listen on channel ${channel}`)
    FSBL.Clients.RouterClient.addListener(channel, callback)
  }
}

export function transmit(channel, message) {
  if (FSBL) {
    console.log(`${LOG_NAME} transmit message ${message} on channel ${channel}`)
    FSBL.Clients.RouterClient.transmit(channel, message)
  }
}

export function query(channel, payload, callback) {
  if (FSBL) {
    console.log(`${LOG_NAME} query with payload ${payload} on channel ${channel}`)
    FSBL.Clients.RouterClient.query(channel, payload, callback)
  }
}

export function getActiveDescriptors(callback) {
  if (FSBL) {
    console.log(`${LOG_NAME} get active descriptors`)
    FSBL.Clients.LauncherCLient.getActiveDescriptors(callback)
  }
}

export function spawn(command, args, callback) {
  if (FSBL) {
    console.log(`${LOG_NAME} spawn command ${command} with args ${args}`)
    FSBL.Clients.LauncherCLient.spawn(command, args, { addToWorkspace: true }, callback)
  }
}

export function alert(message) {
  const tradeNotification = message.tradeNotification;
  const { title, body } = getTradeNotificationContents(tradeNotification);

  if (FSBL) {
    console.log(`${LOG_NAME} alert with message ${message}`)

    const notification = new FSBL.Clients.NotificationClient.Notification();
    notification.title = title;
    notification.details = body;
    notification.type = 'trade';

    FSBL.Clients.NotificationClient.notify([notification]);
  }
}
