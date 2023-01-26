import * as IPFS from "ipfs";
import OrbitDB from 'orbit-db'

async function createDb() {
  // Create IPFS instance
  const ipfsOptions = { repo: './ipfs', }
  const ipfs = await IPFS.create(ipfsOptions)

  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs)

  // Create database instance
  const db = await orbitdb.docs('IOFY')
  console.log("address", db.address.toString())
  const identity = db.identity
  console.log("identity ", identity.toJSON())
  console.log("put data")
  await db.put({ _id: 'ip2', name: 'shamb0t', followers: 600 })
  console.log("get Data")
  const profile = db.get('')
  console.log("profile = ", profile)
  console.log("close")
  await db.close();
  console.log("disconnect")
  await orbitdb.disconnect();
}

async function readDb(fullAdress) {
  console.log("read function")
  // Create IPFS instance
  const ipfsOptions = { repo: './ipfs', }
  const ipfs = await IPFS.create(ipfsOptions)

  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs)

  const db = await orbitdb.open(fullAdress);
  console.log("address", db.address.toString())
  await db.load()
  //await delay(4000)
  console.log("get data")
  const value = await db.get('')
  console.log("value = ", value)
  console.log("close")
  await db.close();
  console.log("disconnect")
  await orbitdb.disconnect();
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
//createDb()
readDb('/orbitdb/zdpuAqTW9MoEnSkDQitmfpdw2za3Wa7LFeJKoHQchBDY5EwuZ/IOFY')
