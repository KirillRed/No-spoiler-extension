console.log('hello!')
// chrome.webNavigation.onTabReplaced.addListener(() => {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, 'Hello');
//         console.log('hello')
//     });
// })
chrome.storage.sync.get(['keywords'], result => {
    if (result.keywords === undefined) {
        chrome.storage.sync.set({ keywords: [] });
    }
})
chrome.storage.sync.get(['keywords'], result => {
    console.log(result.keywords)
})
chrome.tabs.onUpdated.addListener(function (tabID, info, tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log('here you are')
        chrome.scripting.executeScript(
            {
                target: { tabId: tabID },
                files: ['delete-div-blocks.js']
            },
            () => { });
        if (/https:\/\/www.youtube.com\/watch*/.test(tab.url)) {
            chrome.storage.local.set({ injectUnderVideoTime: 1 }, () => { })
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabID },
                    files: ['under-video/under-video.js']
                },
                () => { });
        }

        else if (/https:\/\/www.youtube.com\/results*/.test(tab.url)) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabID },
                    files: ['search-results/search-results.js']
                },
                () => { });
        }

        else if (/https:\/\/www.youtube.com/.test(tab.url)) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabID },
                    files: ['index.js'],
                },
                () => { });
        }
    });;
});