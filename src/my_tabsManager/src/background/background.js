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
              activeTab,
              closeTab,
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

      function activeTab(tabId) {
          chrome.tabs.update(
              Number(tabId), {
                  active: true,
              },
              () => console.log('active tab:', tabId)
          );
      }

      function closeTab(tabId) {
          chrome.tabs.remove(
              Number(tabId),
              () => console.log('close tab:', tabId)
          );
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