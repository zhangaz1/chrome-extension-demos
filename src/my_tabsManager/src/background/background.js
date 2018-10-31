  ;
  (function() {
      let tabs = [];

      const actionHandlers = {
          getTabId,
          manageTab,
      };

      init();

      return void(0);

      function init() {
          addMessageHandler();
          addTabRemoveHandler();
          publishApi();
      }

      function publishApi() {
          window.tabsManagerApi = {
              getTabs,
          };
      }

      function getTabs() {
          return _.map(tabs, tab => {
              return {
                  id: tab.id,
                  title: tab.title,
                  url: tab.url
              };
          });
      }

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
          var tab = sender.tab;
          tabs.push(tab);
      }

      function addTabRemoveHandler() {
          chrome.tabs.onRemoved
              .addListener(tabRemoveHandler);
      }

      function tabRemoveHandler(tabId, removeInfo) {
          tabs = _.filter(tabs, tab => tab.id !== tabId);
      }

  })();