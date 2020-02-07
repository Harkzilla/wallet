document.addEventListener('getLamdenWalletStatus', () => getStatus());
document.addEventListener('signTx', (event) => {
    let signData = event.detail;
    signData.type = 'sign';
    chrome.runtime.sendMessage(signData, (response) => {
        if (response) {
            if (response.error) {
                window.postMessage(response, '*');
            }
        }
    });
});

function getStatus(){
    let status = {installed: undefined, setup: undefined, locked: undefined} 
    chrome.runtime.sendMessage({type: 'checkLamdenWalletInstalled'}, (installedResponse) => {
        if(!chrome.runtime.lastError){
            let status = {
                installed: installedResponse.installed,
                setup: installedResponse.setup, 
                locked: undefined
            } 
            if (installedResponse.installed && installedResponse.setup){
                chrome.runtime.sendMessage({type: 'coinStoreLocked'}, (lockedResponse) => {
                    if(!chrome.runtime.lastError){
                        try{
                            status.locked = lockedResponse.locked;
                        } catch {
                            status.locked = true;
                        }
                    }else{
                        status.locked = true;
                    }
                    document.dispatchEvent(new CustomEvent('lamdenWalletStatus', {detail: status}));
                })
            }
        }
        document.dispatchEvent(new CustomEvent('lamdenWalletStatus', {detail: status}));
    });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'signedTx') {
        window.postMessage(message, '*');
    }
});
