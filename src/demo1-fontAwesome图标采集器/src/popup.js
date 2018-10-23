var bg = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function() {

    var data = bg.iconData;
    if (data.error) {
        $("#loading").text(data.error);
        $("#content").hide();
    } else {
        $("#loading").hide();
        $("#icon-length").text(data.num);
        $("#list-length").text(data.list.length);
    }

    $('#submit-btn').bind('click', function() {
        bg.submitIcons();
    })

});