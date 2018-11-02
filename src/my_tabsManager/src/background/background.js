  ;
  (function() {
      let tabIds = [];

      const actionHandlers = {
          getTabId,
          manageTab,
          getTabs: getTabByMessage,
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
          return new Promise(function(resolve, reject) {
              getTabsByCb(resolve);
          });
      }

      function getTabsByCb(callback) {
          chrome.tabs.query({}, tabs => {
              const result = _.chain(tabs)
                  .filter(tab => _.includes(tabIds, tab.id))
                  .map(getTabSummary)
                  .value();

              callback(result);
          });
      }

      function getTabSummary(tab) {
          return {
              id: tab.id,
              title: tab.title,
              url: tab.url,
              active: tab.active
          };
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

      function getTabId(request, sender, response) {
          response({
              tabId: sender.tab.id
          });
      }

      function manageTab(request, sender, response) {
          var tabId = sender.tab.id;
          tabIds.push(tabId);
          tabIds = _.uniq(tabIds);
          response();
      }

      function getTabByMessage(request, sender, response) {
          //   getTabsByCb(response);
          getTabs().then(tabs => {
              chrome.tabs.sendMessage(sender.tab.id, {
                  tabs,
                  action: request.handler
              });
          });
      }

      function addTabRemoveHandler() {
          chrome.tabs.onRemoved
              .addListener(tabRemoveHandler);
      }

      function tabRemoveHandler(tabId, removeInfo) {
          tabIds = _.filter(tabIds, tab => tab !== tabId);
      }

  })();