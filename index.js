import * as mqtt from "mqtt"
import * as dotenv from 'dotenv'

dotenv.config()


const host = process.env.BROKER;
const port = process.env.PORT;
const lockTopic = process.env.LOCK_TOPIC;
const ackTopic = process.env.ACK_TOPIC;

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
})


/*client.on('connect', () => {
  console.log('Connected')
  client.subscribe([lockTopic], () => {
    console.log(`Subscribe to Topic '${lockTopic}'`)
  })
  client.publish(lockTopic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
})*/
/*client.on('message', (lockTopic, payload) => {
  console.log('Received Message:', lockTopic, payload.toString())
})*/

async function lockDevice() {

  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
  })

  client.on('connect', mqtt_connect_lock)
}


async function unlockDevice() {
  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
  })

  client.on('connect', mqtt_connect_unlock)

}
function mqtt_connect_unlock() {
  client.subscribe([ackTopic], () => {
    console.log(`Subscribe to Topic '${ackTopic}'`)
  })

  client.publish(lockTopic, '0', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })

  client.on('message', (ackTopic, payload) => {
    ack_res(ackTopic, payload)
  })
}

function mqtt_connect_lock() {
  client.subscribe([ackTopic], () => {
    console.log(`Subscribe to Topic '${lockTopic}'`)
  })

  client.publish(lockTopic, '1', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })

  client.on('message', (ackTopic, payload) => {
    ack_res(ackTopic, payload)
  })
}

function ack_res(ackTopic, payload) {
  console.log('Received Message:', ackTopic, payload.toString())
  if (payload.toString() == "ACK") {
    console.log("the IOT Device received the msg")
  } else if (payload.toString() == "NACK") {
    console.log("unable to change the state of the device")
  } else {
    console.log("ack res error")
  }
}

lockDevice();