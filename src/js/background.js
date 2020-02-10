import '../img/icon-128.png'
import '../img/icon-34.png'

import { TransactionBuilder } from './lamden/transactionBuilder.js'
import { decryptStrHash } from './utils.js'
import { createCoinStore } from './stores/coinStore.js'
import { createNetworksStore } from './stores/networksStore.js' 

let password;
let locked;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	//only try to preform these actions if the wallet is not locked
	if (!locked) {
		if (message.type === 'expand') {
			chrome.tabs.create({ url: '/app.html' });
		}
	
		if (message.type === 'signTx') {	
			let txDetails = message.data
			try{
				let newTx = new TransactionBuilder(
					getCurrentNetwork(), 
					txDetails.senderVk, 
					txDetails.contractName, 
					txDetails.methodName, 
					txDetails.kwargs, 
					50000
				)
				sendResponse({status: 'Created Tx, sending...'})
				sendTx(newTx, getWallet(txDetails.senderVk))
			}catch (e){
				sendResponse({status: `Failed to create Tx: ${e}`})
			}
		}
	}

	if (message.type === 'storeLockStatusChanged'){
		password = message.pwd
		locked = message.locked
		sendMsgToAllTabs({type: 'sendWalletInfo'})
	}

	if (message.type === 'currentNetworkChanged'){
		sendMsgToAllTabs({type: 'sendWalletInfo'})
	}

	if (message.type === 'getWalletInfo') {
		let installedStatus = {
			installed: false,
			setup: false,
			locked: typeof locked === 'undefined' ? true : locked,
			wallets: getWallets(),
			currentNetwork: {name: '', ip: '', port: ''}
		}
		if (installedStatus.locked === false){
			installedStatus.currentNetwork = getCurrentNetwork()
		}
		const json = localStorage.getItem("settings");
		if (json) {
			let settings = JSON.parse(localStorage.getItem("settings"))
			installedStatus.installed = true;
			installedStatus.setup = !settings.firstRun
			sendResponse(installedStatus)
		}else{
			sendResponse(installedStatus)
		}
	}
});

function getWallets(){
	if (locked) return [];
	let CoinStore = createCoinStore()
	CoinStore.setPwd(password);
	return CoinStore.getValue().map(coin => {
		return {
			name: coin.nickname !== '' ? coin.nickname : coin.name,
			vk: coin.vk
		}
	})
}

function getWallet(vk){
	let wallet;
	let CoinStore = createCoinStore()
	CoinStore.setPwd(password);
	CoinStore.getValue().forEach(coin => {
		if (coin.vk === vk) wallet = coin;
	})
	return wallet;
}

function getCurrentNetwork(){
	let wallet;
	let NetworksStore = createNetworksStore()
	return NetworksStore.getCurrentNetwork()
}

function sendTx(newTx, wallet){
	newTx.send(decryptStrHash(password, wallet.sk), (res, err) =>{
		let status = typeof err === 'undefined' ? 'success' : 'error';
		let data = status === 'success' ? res : err;
		sendMsgToActiveTab({type: 'txStatus', status, data})
	})
}

function sendMsgToActiveTab(message){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, message);  
	});
}

function sendMsgToAllTabs(message){
	chrome.tabs.query({}, function(tabs) {
		tabs.forEach(function(tab) {
		  	chrome.tabs.sendMessage(tab.id, message);
		});
	});
}