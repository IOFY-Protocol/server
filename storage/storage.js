import * as IPFS from "ipfs";
import OrbitDB from 'orbit-db'


/*async function initGlobalIPFS(ipfsOptions) {
  global.IPFS = await IPFS.create(ipfsOptions)
};
initGlobalIPFS()*/

async function createDb(req) {
  // Create IPFS instance
  console.log("req ", req)
  const ipfsOptions = { repo: './ipfs', }
  const ipfs = await IPFS.create(ipfsOptions)

  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs)

  // Create database instance
  console.log("req id", req.id)
  const db = await orbitdb.docs(req.id)
  console.log("address", db.address.toString())
  const identity = db.identity
  console.log("identity ", identity.toJSON())
  console.log("put data")
  await db.put({
     _id: req.id , 
     category: req.category , 
     DeviceName: req.deviceName, 
     RentalFee: req.rentalFee, 
     Description: req.description,
     Img: req.imgCid
    })
  console.log("get Data")
  const profile = db.get('')
  console.log("profile = ", profile)
  console.log("close")
  await db.close();
  //console.log("disconnect")
  await orbitdb.disconnect();
  await ipfs.stop();
  return db.address;
}

async function readDb(fullAddress) {
  console.log("read function")
  // Create IPFS instance
  const ipfsOptions = { repo: './ipfs', }
  const ipfs = await IPFS.create(ipfsOptions)

  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs)

  const db = await orbitdb.open(fullAddress);
  console.log("address", db.address.toString())
  await db.load()
  //await delay(4000)
  console.log("get data")
  const metadata = await db.get('')
  //console.log("metadata = ", metadata)
  //console.log("close")
  await db.close();
  //console.log("disconnect")
  await orbitdb.disconnect();
  await ipfs.stop();
  return metadata;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
//createDb('IOFY')
//readDb('/orbitdb/zdpuAqTW9MoEnSkDQitmfpdw2za3Wa7LFeJKoHQchBDY5EwuZ/IOFY')
 export {createDb, readDb}