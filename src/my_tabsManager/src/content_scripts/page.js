;
(function() {
    let tabId = -1;

    const actionHandlers = {
        gotTabs: gotTabsHandler,
    };

    init();

    return void(0);

    function init() {
        addMessageHandler();
        getTabId(gotTabId);
        manageTab();
        getTabs();
    }

    function addMessageHandler() {
        chrome.runtime.onMessage
            .addListener(messageHandler);
    }

    function messageHandler(request, sender, response) {
        const actionHandler = actionHandlers[request.action];

        if (actionHandler) {
            actionHandler(request, sender, response || _.noop);
        } else {
            const errorMessage = `has no action handler of: ${request.action}`;
            if (_.isFunction(response)) {
                response({
                    error: errorMessage
                });
            } else {
                console.log(errorMessage);
            }
        }
    }

    function gotTabsHandler(response, extension, callback) {
        gotTabs(response.tabs);
        callback();
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

    function getTabs(callback) {
        sendMessage({
            action: 'getTabs',
            handler: 'gotTabs',
        }, callback);
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