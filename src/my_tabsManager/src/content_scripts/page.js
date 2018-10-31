;
(function() {
    let tabId = -1;

    getTabId();
    manageTab();

    return void(0);

    function manageTab() {
        simpleMessage('manageTab');
    }

    function getTabId() {
        simpleMessage('getTabId', gotTabId);
    }

    function gotTabId(response) {
        tabId = response.tabId;
        log('got tabId:', tabId);
    }

    function simpleMessage(action, callback) {
        let message = {
            action: action
        };
        sendMessage(message, callback);
    }

    function sendMessage(message, callback) {
        var backHandler = checkError(callback);
        chrome.runtime
            .sendMessage(message, backHandler);
    }

    function checkError(callback) {
        return (response) => {
            if (response && response.error) {
                log('got error from server:', response.error);
                return;
            }

            if (typeof callback === 'function') {
                callback(response);
            }
        };
    }

    function log() {
        console.log.apply(console, arguments);
    }

})();