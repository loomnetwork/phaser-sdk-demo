import {
  NonceTxMiddleware, SignedTxMiddleware, Client,
  Contract, Address, LocalAddress, CryptoUtils
} from 'loom-js'

import { MapEntry } from './assets/protobuff/setscore_pb'


class SimpleContract extends Contract {

  constructor () {

	  const privateKey = CryptoUtils.generatePrivateKey()
  	const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
	  const client = new Client(
	    'default',
	    'ws://127.0.0.1:46657/websocket',
	    'ws://127.0.0.1:9999/queryws'
	  )

	  client.txMiddleware = [
	    new NonceTxMiddleware(publicKey, client),
	    new SignedTxMiddleware(privateKey)
	  ]

	  const contractAddr = new Address(
	    client.chainId,
	    LocalAddress.fromHexString('0x005B17864f3adbF53b1384F2E6f2120c6652F779')
	  )

	  const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey))

		super({contractAddr, callerAddr, client})	

  }

	async store(key, value) {
	  const params = new MapEntry()
	  params.setKey(key)
	  params.setValue(value)
	  await this.callAsync('SetMsg', params)
	}

	async load(key) {
	  const params = new MapEntry()
	  params.setKey(key)
	  const result = await this.staticCallAsync('GetMsg', params, new MapEntry())	 
	  return result.getValue()
	}


}


export default SimpleContract


