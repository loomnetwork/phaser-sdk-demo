import {
  NonceTxMiddleware, SignedTxMiddleware, Client,
  Contract, Address, LocalAddress, CryptoUtils
} from 'loom-js'

import { MapEntry } from './assets/protobuff/setscore_pb'


class SimpleContract extends Contract {

  constructor(config) {
		super(config)	
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

export default async function() {
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
  const contractAddr = await client.getContractAddressAsync('BluePrint')
  const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey))
  return new SimpleContract({
    contractAddr,
    callerAddr,
    client
  })

}


