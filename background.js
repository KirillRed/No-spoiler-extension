chrome.storage.sync.set({ free: false })
chrome.tabs.onUpdated.addListener(function (tabID, info, tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (/https:\/\/www.youtube.com\/*/.test(tab.url)) {
            if (/https:\/\/www.youtube.com\/watch*/.test(tab.url)) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabID },
                        files: ['hints.js']
                    },
                    () => { });
            }
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabID },
                    files: ['foreground.js']
                },
                () => { });
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabID },
                    files: ['delete-div-blocks.js']
                },
                () => { });
        }
    }
    );;
});