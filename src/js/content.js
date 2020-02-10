document.addEventListener('getLamdenWalletInfo', () => getWalletInfo());
document.addEventListener('signTx', (event) => {
    signData = {type: 'signTx', data: event.detail};
    chrome.runtime.sendMessage(signData, (response) => {
        document.dispatchEvent(new CustomEvent('txStatus', {detail: response}));
    });
});

function getWalletInfo(){
    chrome.runtime.sendMessage({type: 'getWalletInfo'}, (response) => {
        if(!chrome.runtime.lastError){
            document.dispatchEvent(new CustomEvent('lamdenWalletInfo', {detail: response}));
        }
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "txStatus"){
        let detail = {
            status: message.status,
            data: message.data
        }
        document.dispatchEvent(new CustomEvent('txStatus', {detail}));
    }

    if (message.type === "sendWalletInfo"){
        getWalletInfo();
    }
});
