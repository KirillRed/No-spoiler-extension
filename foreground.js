try {
    var keywords = [];
    var exceptions = [];
    chrome.storage.sync.get(['keywordsNoSpoiler'], result => {
        if (result.keywordsNoSpoiler !== undefined) {
            keywords = result.keywordsNoSpoiler;
        }
    })
    chrome.storage.sync.get(['exceptionsNoSpoiler'], result => {
        if (result.exceptionsNoSpoiler !== undefined) {
            exceptions = result.exceptionsNoSpoiler;
        }
    })
}
catch (ReferenceError) {

}
try {
    var videoTagList = ['ytd-type-renderer', 'ytd-grid-type-renderer', 'ytd-rich-item-renderer',
        'ytd-playlist-type-renderer', 'ytd-playlist-panel-type-renderer', 'ytd-compact-type-renderer',
        'ytd-reel-item-renderer']; //it may be video, playlist, radio
    var types = ['video', 'playlist', 'radio'];
}
catch (SyntaxError) {

}

window.onload = () => {
    setInterval(firstVideoBlock, 1000)
}

function firstVideoBlock() {
    let videos = [];
    for (const videoTag of videoTagList) {
        if (videoTag.includes('type')) {
            for (const type of types) {
                videos = videos.concat(Array.from(document.getElementsByTagName(videoTag.replace('type', type))));
            }
        }
        else {
            videos = videos.concat(Array.from(document.getElementsByTagName(videoTag)));
        }
    }
    for (const video of videos) {
        let ariaLabel;
        try {
            ariaLabel = video.querySelector('#video-title').getAttribute('aria-label');
        }
        catch (TypeError) {
            ariaLabel = null;
        }

        let title;
        if (ariaLabel === null) {
            try {
                title = video.querySelector('#video-title').innerText;
            }
            catch (TypeError) {
                continue;
            }
        }
        else {
            title = ariaLabel.slice(0, ariaLabel.lastIndexOf('by'));
        }
        if (title === null) { //It isn't a video, it is a channel, ads or something else
            continue;
        }
        let blockedKeywords = [];

        if (exceptions.some(exception => title.toLowerCase().includes(exception))) {
            continue;
        }

        for (let keyword of keywords) {
            if (title.toLowerCase().includes(keyword)) {
                blockedKeywords.push(keyword);
            }
        }


        if (video.getElementsByClassName('div-blocked').length === 0 && blockedKeywords.length > 0) {
            let height = video.clientHeight, width = video.clientWidth;
            if (height < 50 || width < 50) continue;
            video.classList.add('blocked');
            for (const children of video.children) {
                children.setAttribute('hidden', '');
            }
            let blockedKeywordsString = ''
            if (blockedKeywords.length === 1) {
                blockedKeywordsString = 'this keyword: ' + blockedKeywords[0];
            }
            else {
                blockedKeywordsString = 'these keywords: ' + blockedKeywords.join(', ');
            }
            video.style.height = `${height}px`
            video.style.width = `${width}px`
            video.insertAdjacentHTML('beforeend', `<div class="div-blocked"><span>Video blocked because of ${blockedKeywordsString} <br> If you want to restore it click <a style="cursor: pointer;">HERE</a></span></div>`);
            video.getElementsByClassName('div-blocked')[0].getElementsByTagName('a')[0].addEventListener('click', () => {
                for (const children of video.children) {
                    children.removeAttribute('hidden');
                }
                video.classList.remove('blocked');
                video.getElementsByClassName('div-blocked')[0].setAttribute('hidden', 'true');
                video.style.height = null;
                video.style.width = null;
            })
        }

    }

}

function secondVideoBlock() {

}

