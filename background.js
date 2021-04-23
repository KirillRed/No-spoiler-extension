console.log('hello!')
// chrome.webNavigation.onTabReplaced.addListener(() => {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, 'Hello');
//         console.log('hello')
//     });
// })
chrome.storage.sync.set({ free: false })
chrome.tabs.onUpdated.addListener(function (tabID, info, tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (/https:\/\/www.youtube.com\/*/.test(tab.url)) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabID },
                    files: ['foreground.js', 'delete-div-blocks.js']
                },
                () => { });
        }
        // if (/https:\/\/www.youtube.com\/watch*/.test(tab.url)) {
        //     chrome.storage.local.set({ injectUnderVideoTime: 1 }, () => { })
        //     chrome.scripting.executeScript(
        //         {
        //             target: { tabId: tabID },
        //             files: ['under-video/under-video.js']
        //         },
        //         () => { });
        // }

        // else if (/https:\/\/www.youtube.com\/results*/.test(tab.url) || /https:\/\/www.youtube.com\/feed\/explore|history|trending*/.test(tab.url)) {
        //     chrome.scripting.executeScript(
        //         {
        //             target: { tabId: tabID },
        //             files: ['search-results/search-results.js']
        //         },
        //         () => { });
        // }

        // else if (/https:\/\/www.youtube.com/.test(tab.url)) {
        //     chrome.scripting.executeScript(
        //         {
        //             target: { tabId: tabID },
        //             files: ['index.js'],
        //         },
        //         () => { });
    }
    );;
});