;
(function() {
    const api = chrome.extension
        .getBackgroundPage()
        .tabsManagerApi;

    $(init);

    return void(0);

    function init() {
        const tabs = api.getTabs();
        bindTabs(tabs);
    }

    function bindTabs(tabs) {
        const tabRowTemplate = getTabRowTemplate();
        const template = Handlebars.compile(tabRowTemplate);
        const html = template({
            tabs
        });

        const rows = $(html);
        bindActionHandlers(rows);

        $('#tabs')
            .empty()
            .append(rows);
    }

    function bindActionHandlers(rows) {
        rows.find('button')
            .click(actionHandler);
    }

    function actionHandler() {
        const btn = $(this);
        const action = btn.attr('action');
        const tabId = btn.attr('tabId');

        const handler = api[action];
        if (_.isFunction(handler)) {
            handler(tabId);
        }
    }

    function getTabRowTemplate() {
        return `
			{{#each tabs}}
				<tr>
					<td>{{id}}</td>
					<td>{{title}}</td>
					<td>{{url}}</td>
					<td>
						<button tabId="{{id}}" action="activeTab">Active</button>
						<button tabId="{{id}}" action="closeTab">Close</button>
					</td>
				</tr>
			{{/each}}
		`;
    }

})();