import { Elm } from './Main.elm';

async function check () {
	await window.fetch('https://rpc.octano.dev/', {
		method: 'POST',
		body: JSON.stringify({
		id: 1,
		jsonrpc: "2.0",
		method: "eth_getBalance",
		params: [
			"0x798A99EE5079c7D0F99FA15f5f1D903C14247309"
		]
		})
	})
}
Elm.Main.init({ node: document.getElementById('app') });