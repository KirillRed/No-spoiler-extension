console.log('hello!')
// chrome.webNavigation.onTabReplaced.addListener(() => {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, 'Hello');
//         console.log('hello')
//     });
// })
chrome.tabs.onUpdated.addListener(function (tabID, info, tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (/https:\/\/www.youtube.com\/watch*/.test(tab.url)) {
            console.log('watch')
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
        // chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
        //     console.log(tabs)
        //  });
    });;
});