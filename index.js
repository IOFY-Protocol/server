import * as mqtt from "mqtt"
import * as dotenv from 'dotenv'

dotenv.config()


const host = process.env.BROKER;
const port = process.env.PORT;
const lockTopic = process.env.LOCK_TOPIC;

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
client.on('message', (lockTopic, payload) => {
  console.log('Received Message:', lockTopic, payload.toString())
})

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
  client.subscribe([lockTopic], () => {
    console.log(`Subscribe to Topic '${lockTopic}'`)
  })

  client.publish(lockTopic, '0', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

function mqtt_connect_lock() {
  client.subscribe([lockTopic], () => {
    console.log(`Subscribe to Topic '${lockTopic}'`)
  })

  client.publish(lockTopic, '1', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

lockDevice();