//获取当前域名
function getDomainFromUrl(url) {
    var host = "null";
    if (typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match)
        host = match[1];
    return host;
}

//检测域名，显示插件图标
function checkForValidUrl(tabId, changeInfo, tab) {
    if (getDomainFromUrl(tab.url).toLowerCase() == "fontawesome.io") {
        chrome.pageAction.show(tabId);
    }
};

//监听地址栏变化
chrome.tabs.onUpdated.addListener(checkForValidUrl);

var iconData = {};
iconData.error = '请等待页面加载完毕……';

chrome.runtime.onMessage.addListener(function(request, sender, sendRequest) {
    if (request.type !== 'fa-information')
        return;
    iconData = request;

});

function submitIcons() {

    if (!iconData.error) {
        $.ajax({
            url: 'http://接口URL/font_awesome.php',
            cache: false,
            type: 'POST',
            data: JSON.stringify(iconData.list),
            dataType: 'text'
        }).done(function(msg) {
            alert(msg);
        }).fail(function(jqXHR, textStatus) {
            alert(textStatus);
        });
    }
}