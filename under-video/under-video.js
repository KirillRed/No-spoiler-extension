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

function getTitleByDivBlock(divBlock) {
    const video = divBlock.parentElement
    const parentTagName = video.tagName.toLowerCase();
    if (/ytd-.*-renderer/.test(parentTagName)) {
        const videoH3 = video.getElementsByTagName('h3');
        const videoH4 = video.getElementsByTagName('h4');
        const titleTag = videoH3[0] || videoH4[0] //If videoH3, then it is simple under video video, if videoH4, then it is mix video
        return titleTag.getElementsByTagName('span')[titleTag.getElementsByTagName('span').length - 1].innerText
    }
    else if (video.classList.contains('ytp-videowall-still ytp-suggestion-set')) {
        return video.getAttribute('aria-label');
    }
    else if (video.classList.contains('ytp-ce-element')) {
        let titleTag;
        if (video.classList.contains('ytp-ce-video')) {
            titleTag = video.getElementsByClassName('ytp-ce-video-title')[0];
            return titleTag.innerText
        }
        else if (video.classList.contains('ytp-ce-playlist')) {
            titleTag = video.getElementsByClassName('ytp-ce-playlist-title')[0];
            return titleTag.innerText
        }
        else if (video.classList.contains('ytp-ce-radio')) {
            titleTag = video.getElementsByClassName('ytp-ce-radio-title')[0];
            return titleTag.innerText
        }

    }
    else if (video.classList.contains('iv-card')) {
        return video.getElementsByClassName('iv-card-primary-link')[0].innerText;
    }
}


function checkVideoTitle() { //If title in div does not equal to video title, it will be removed
    for (const block of Array.from(document.getElementsByClassName('div-blocked'))) {
        if (block.parentElement.classList.contains('checked')) {
            continue;
        }
        const divTitle = block.getElementsByTagName('div')[0].innerText;
        const videoTitle = getTitleByDivBlock(block).trim();
        if (divTitle !== videoTitle) {
            block.parentElement.classList.remove('blocked')
            for (const contentDiv of Array.from(block.parentElement.children)) {
                contentDiv.removeAttribute('hidden')
            }
            block.parentElement.classList.add('checked');
            block.remove();
        }
    }
}

function getBlockedKeywords(title, video) {
    let blockedKeywords = []
    for (const keyword of keywords) {
        if (title.toLowerCase().includes(keyword) && !(exceptionKeywords.some(word => title.toLowerCase().includes(word)))) {
            blockedKeywords.push(keyword)

        }
    }
    //return video.getElementsByClassName('div-blocked').length === 0 && blockedKeywords.length > 0
    return blockedKeywords
}

function blockVideo(video, contentDivs, blockedKeywords, videoTitle, extraFunction = (...args) => { }) {
    video.classList.add('blocked')
    for (const contentDiv of contentDivs) {
        contentDiv.setAttribute('hidden', 'true')
    }

    let blockedKeywordsString = ''
    if (blockedKeywords.length === 1) {
        blockedKeywordsString = 'this keyword: ' + blockedKeywords[0]
    }
    else {
        blockedKeywordsString = 'these keywords: ' + blockedKeywords.join(', ')
    }
    video.insertAdjacentHTML('beforeend', `<div class="div-blocked"><div hidden>${videoTitle}</div> Video blocked because of ${blockedKeywordsString} <br> If you want to restore it click <a>HERE</a></div>`)
    extraFunction(blockedKeywordsString)
}

function addUnblockVideo(video, contentDivs, extraFunction = () => { }) {
    video.getElementsByClassName('div-blocked')[0].getElementsByTagName('a')[0].addEventListener('click', () => {
        for (const contentDiv of contentDivs) {
            contentDiv.removeAttribute('hidden')
        }
        video.classList.remove('blocked')
        video.getElementsByClassName('div-blocked')[0].setAttribute('hidden', 'true')
        extraFunction()
    })

}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    setInterval(underVideoBlock, 1000)
    //setInterval(checkVideoTitle, 1000)
    sendResponse('Got it')
});




setInterval(underVideoBlock, 1000);
//setInterval(checkVideoTitle, 1000)

try {
    var hideMix = true;
}
catch (ReferenceError) {

}

function underVideoBlock() {

    //Feed and mix
    let videos = Array.from(document.getElementsByTagName('ytd-compact-video-renderer'))
    videos = videos.concat(Array.from(document.getElementsByTagName('ytd-compact-playlist-renderer')))
    videos = videos.concat(Array.from(document.getElementsByTagName('ytd-compact-radio-renderer')))
    if (hideMix) {
        videos = videos.concat(Array.from(document.getElementsByTagName('ytd-playlist-panel-video-renderer') || null))
    }
    for (const video of videos) {
        const videoH3 = video.getElementsByTagName('h3');
        const videoH4 = video.getElementsByTagName('h4');
        const titleTag = videoH3[0] || videoH4[0] //If videoH3, then it is simple under video video, if videoH4, then it is mix video
        const title = titleTag.getElementsByTagName('span')[titleTag.getElementsByTagName('span').length - 1].innerText

        const contentDiv = video.getElementsByTagName('div')[0]
        const blockedKeywords = getBlockedKeywords(title, video)

        if ((video.getElementsByClassName('div-blocked').length === 0) && (blockedKeywords.length > 0)) {
            blockVideo(video, [contentDiv], blockedKeywords, title);
            addUnblockVideo(video, [contentDiv]);
        }

    }

    //Watch next after end videos 

    const watchNextVideos = document.getElementsByClassName('ytp-videowall-still ytp-suggestion-set');
    for (const video of watchNextVideos) {
        const title = video.getAttribute('aria-label');
        const blockedKeywords = getBlockedKeywords(title, video)


        if ((video.getElementsByClassName('div-blocked').length === 0) && (blockedKeywords.length > 0)) {
            blockVideo(video, Array.from(video.children), blockedKeywords, title, extraFunction = blockedKeywordsString => {
                video.getElementsByClassName('div-blocked')[0].innerHTML = `Video blocked because of ${blockedKeywordsString} <br> If you want to watch, click <a>anywhere</a> on this text`
            });
            addUnblockVideo(video, Array.from(video.children), () => { video.classList.remove('disabled') })
        }
        delete title;
    }

    //Watch next before end videos

    const beforeEndVideos = document.getElementsByClassName('ytp-ce-element');
    for (const video of beforeEndVideos) {
        let titleTag;
        if (video.classList.contains('ytp-ce-video')) {
            titleTag = video.getElementsByClassName('ytp-ce-video-title')[0];
        }
        else if (video.classList.contains('ytp-ce-playlist')) {
            titleTag = video.getElementsByClassName('ytp-ce-playlist-title')[0];
        }
        else if (video.classList.contains('ytp-ce-radio')) {
            titleTag = video.getElementsByClassName('ytp-ce-radio-title')[0];
        }
        else {
            continue //It is not a video
        }
        const title = titleTag.innerText
        const blockedKeywords = getBlockedKeywords(title, video)
        if ((video.getElementsByClassName('div-blocked').length === 0) && (blockedKeywords.length > 0)) {
            blockVideo(video, Array.from(video.children), blockedKeywords, title, extraFunction = blockedKeywordsString => {
                video.getElementsByClassName('div-blocked')[0].innerHTML = `Video blocked because of ${blockedKeywordsString} <br> If you want to watch, click <a>anywhere</a> on this text`
            });
            addUnblockVideo(video, Array.from(video.children), () => { video.classList.remove('disabled') })
        }
        delete title;
    }

    //Hints

    const hintVideos = document.getElementsByClassName('iv-card');
    for (const video of hintVideos) {
        if (video.getElementsByClassName('iv-card-primary-link').length === 0) {
            continue; //It is not a video
        }
        const title = video.getElementsByClassName('iv-card-primary-link')[0].innerText;
        const blockedKeywords = getBlockedKeywords(title, video)
        if ((video.getElementsByClassName('div-blocked').length === 0) && (blockedKeywords.length > 0)) {
            blockVideo(video, Array.from(video.children), blockedKeywords, title);
            addUnblockVideo(video, Array.from(video.children))
        }
        delete title;
    }


}
