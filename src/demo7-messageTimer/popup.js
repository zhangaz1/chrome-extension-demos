// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function setChildTextNode(elementId, text) {
    document.getElementById(elementId).innerText = text;
}

// Tests the roundtrip time of sendMessage().
function testMessage() {
    setChildTextNode("resultsRequest", "running...");

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        var time = 1000;
        var timer = createTimer(time);
        timer.start();
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, {
            counter: 1
        }, function handler(response) {
            if (timer.isEnd()) {
                var usec = time / response.counter;
                setChildTextNode("resultsRequest", usec + "usec");
            } else {
                chrome.tabs.sendMessage(tab.id, {
                    counter: response.counter
                }, handler);
            }
        });
    });
}

function createTimer(timeout) {
    let timer = {
        status: 'pending',
        start: () => {
            setTimeout(() => timer.status = 'stop', timeout);
            timer.status = 'runing';
        },
        isEnd: () => timer.status === 'stop'
    };

    return timer;
}

// Tests the roundtrip time of Port.postMessage() after opening a channel.
function testConnect() {
    setChildTextNode("resultsConnect", "running...");

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        var time = 1000;
        var timer = createTimer(time);
        timer.start();

        var port = chrome.tabs.connect(tabs[0].id);
        port.postMessage({
            counter: 1
        });
        port.onMessage.addListener(function getResp(response) {
            if (timer.isEnd()) {
                var usec = time / response.counter;
                setChildTextNode("resultsConnect", usec + "usec");
            } else {
                port.postMessage({
                    counter: response.counter
                });
            }
        });
    });
}

(function() {
    // if (!chrome.benchmarking) {
    //     alert("Warning:  Looks like you forgot to run chrome with " +
    //         " --enable-benchmarking set.");
    //     // return;
    // }
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelector('#testMessage')
            .addEventListener('click', testMessage);

        document.querySelector('#testConnect')
            .addEventListener('click', testConnect);
    });
})();