

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('search')
    sendResponse('Got it')
    setInterval(searchResultsBlock, 1000)

});

try {
    var keywords = [];
    var exceptionKeywords = []
    chrome.storage.sync.get(['keywords'], result => {
        keywords = result.keywords;
    })
    chrome.storage.sync.get(['exceptions'], result => {
        exceptionKeywords = result.exceptions;
    })
}
catch (ReferenceError) {

}


setInterval(searchResultsBlock, 1000)

function searchResultsBlock() {
    let videos = document.getElementsByTagName('ytd-video-renderer');
    for (let video of Array.from(videos)) {
        let titleTag = video.getElementsByTagName('h3')[0];
        let title = titleTag.getElementsByTagName('a')[0].getAttribute('title')
        let blockedKeywords = []

        for (let keyword of keywords) {
            if (title.toLowerCase().includes(keyword) && !exceptionKeywords.some(word => title.toLowerCase().includes(word))) {
                blockedKeywords.push(keyword)

            }
        }
        if (video.getElementsByClassName('div-blocked').length === 0 && blockedKeywords.length > 0) {
            let contentDiv = video.getElementsByTagName('div')[0]
            video.classList.add('blocked')
            contentDiv.setAttribute('hidden', 'true')
            let blockedKeywordsString = ''
            if (blockedKeywords.length === 1) {
                blockedKeywordsString = 'this keyword: ' + blockedKeywords[0]
            }
            else {
                blockedKeywordsString = 'these keywords: ' + blockedKeywords.join(', ')
            }
            video.insertAdjacentHTML('beforeend', `<div style="height: 20rem;" class="div-blocked">Video blocked because of ${blockedKeywordsString} <br> If you want to restore it click <a>HERE</a></div>`)

            video.getElementsByClassName('div-blocked')[0].getElementsByTagName('a')[0].addEventListener('click', () => {
                contentDiv.removeAttribute('hidden')
                video.classList.remove('blocked')
                video.getElementsByClassName('div-blocked')[0].setAttribute('hidden', 'true')
            })


        }
    }
    let mixVideos = Array.from(document.getElementsByTagName('ytd-radio-renderer'));
    mixVideos = mixVideos.concat(Array.from(document.getElementsByTagName('ytd-playlist-renderer')))
    for (let mix of mixVideos) {
        let title = mix.getElementsByTagName('h3')[0].getElementsByTagName('span')[0].title

        let blockedKeywords = []

        for (let keyword of keywords) {
            if (title.toLowerCase().includes(keyword)) {
                blockedKeywords.push(keyword)

            }
        }
        if (mix.getElementsByClassName('div-blocked').length === 0 && blockedKeywords.length > 0) {
            for (let element of Array.from(mix.children)) {
                element.setAttribute('hidden', true)
            }
            mix.classList.add('blocked')
            let blockedKeywordsString = ''
            if (blockedKeywords.length === 1) {
                blockedKeywordsString = 'this keyword: ' + blockedKeywords[0]
            }
            else {
                blockedKeywordsString = 'these keywords: ' + blockedKeywords.join(', ')
            }
            mix.insertAdjacentHTML('beforeend', `<div style="height: 20rem; width: 150rem;" class="div-blocked">Video blocked because of ${blockedKeywordsString} <br> If you want to restore it click <a>HERE</a></div>`)
            mix.getElementsByClassName('div-blocked')[0].getElementsByTagName('a')[0].addEventListener('click', () => {
                for (let element of Array.from(mix.children)) {
                    element.removeAttribute('hidden')
                }
                mix.classList.remove('blocked')
                mix.getElementsByClassName('div-blocked')[0].setAttribute('hidden', 'true')
            })
        }

    }
}

