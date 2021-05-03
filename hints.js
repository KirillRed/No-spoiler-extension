//This file is made especially for video, it will block hints, watch next videos

try {
    var keywords = [];
    var exceptionKeywords = [];
    chrome.storage.sync.get(['keywords'], result => {
        if (result.keywords !== undefined) {
            keywords = result.keywords;
        }
    })
    chrome.storage.sync.get(['exceptions'], result => {
        if (result.exceptions !== undefined) {
            exceptions = result.exceptions;
        }
    })
}
catch (ReferenceError) {

}

function getBlockedKeywords(title) {
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

setInterval(blockHintVideos, 1000)

function blockHintVideos() {
    const watchNextVideos = document.getElementsByClassName('ytp-videowall-still ytp-suggestion-set');
    for (const video of watchNextVideos) {
        const title = video.getAttribute('aria-label');
        const blockedKeywords = getBlockedKeywords(title)


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
        const blockedKeywords = getBlockedKeywords(title)
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
        const blockedKeywords = getBlockedKeywords(title)
        if ((video.getElementsByClassName('div-blocked').length === 0) && (blockedKeywords.length > 0)) {
            blockVideo(video, Array.from(video.children), blockedKeywords, title);
            addUnblockVideo(video, Array.from(video.children))
        }
        delete title;
    }


}