export let keywords = ['tangled', 'itpedia', 'english', 'rocket league', 'angular', 'mandalorian', 'rapunzel', 'clone wars', 'звездные войны']
chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab => {
        if (/^https:\/\/www\.youtube/.test(current_tab.url)) {
            console.log(current_tab)
        }
    })
})