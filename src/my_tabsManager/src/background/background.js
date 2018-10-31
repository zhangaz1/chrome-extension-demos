 var tabs = [];

 ;
 (function() {

     let actionHandlers = {
         getTabId,
         manageTab,
     };

     addMessageHandler();

     return void(0);

     function addMessageHandler() {
         chrome.runtime.onMessage
             .addListener(messageHandler);
     }

     function messageHandler(request, sender, response) {
         let actionHandler = actionHandlers[request.action];

         if (actionHandler) {
             actionHandler(request, sender, response);
         } else {
             response({
                 error: `has no action handler of: ${request.action}`
             });
         }
     }

     function getTabId(request, sender, response) {
         response({
             tabId: sender.tab.id
         });
     }

     function manageTab(request, sender, response) {
         tabs.push(sender.tab);
     }

 })();