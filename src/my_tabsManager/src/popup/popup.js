;
(function() {
    let bg = chrome.extension.getBackgroundPage();

    $(init);

    return void(0);

    function init() {
        bindTabs(bg.tabs);
    }

    function bindTabs(tabs) {
        let tabRowTemplate = getTabRowTemplate();
        let template = Handlebars.compile(tabRowTemplate);
        let html = template({
            tabs
        });

        $('#tabs')
            .empty()
            .append(html);
    }

    function getTabRowTemplate() {
        return `
			{{#each tabs}}
				<tr>
					<td>{{id}}</td>
					<td>{{title}}</td>
					<td>{{url}}</td>
					<td><button tabId="{{id}}">Close</button></td>
				</tr>
			{{/each}}
		`;
    }

})();