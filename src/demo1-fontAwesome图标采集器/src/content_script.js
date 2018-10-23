var postInfo = $('#icons section');

var msg = {
    type: 'fa-information',
    num: 0,
    list: []
};

if (postInfo.length) {
    postInfo.each(function() {
        var name = $(this).find('h2').text();
        var icons = [];

        $(this).find('.fontawesome-icon-list a').each(function() {
            var icon = $(this).find('i').attr('class').substring(3);
            icons.push(icon);
            msg.num += 1;

        });
        msg.list.push({
            name: name,
            icons: icons
        });
    });

} else {
    msg['error'] = '获取图标失败';

}

chrome.runtime.sendMessage(msg);