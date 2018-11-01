;
(function() {
    let tabId = -1;

    init();

    return void(0);

    function init() {
        getTabId(gotTabId);
        manageTab(gotTabs);
    }

    function manageTab(callback) {
        simpleMessage('manageTab', callback);
    }

    function getTabId(callback) {
        simpleMessage('getTabId', callback);
    }

    function gotTabId(response) {
        tabId = response.tabId;
        log('got tabId:', tabId);
    }

    function gotTabs(tabs) {
        console.log('got tabs:', tabs);
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

            if (_.isFunction(callback)) {
                callback(response);
            }
        };
    }

    function log() {
        console.log.apply(console, arguments);
    }

})();