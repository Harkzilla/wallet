import '../img/icon-128.png'
import '../img/icon-34.png'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'expand') {
        chrome.tabs.create({ url: '/app.html' });
	}

	if (message.type === 'sign') {
		chrome.windows.create({
			url: '/confirm.html', width: 620, height: 700, type: 'popup',
		});
	}
	
	if (message.type === 'checkLamdenWalletInstalled') {
		let installedStatus = {
			installed: false,
			setup: false
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

	if (message.type === 'checkLamdenWalletLocked'){
		chrome.runtime.sendMessage({type: 'coinStoreLocked'}, (coinStoreResponse) => {
			sendResponse(coinStoreResponse)
		})
	}
});


