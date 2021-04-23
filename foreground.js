try {
    var keywords = [];
    var exceptionKeywords = [];
    chrome.storage.sync.get(['keywords'], result => {
        keywords = result.keywords;
    })
    chrome.storage.sync.get(['exceptions'], result => {
        exceptionKeywords = result.exceptions;
    })
}
catch (ReferenceError) {

}
try {
    var videoTagList = ['ytd-type-renderer', 'ytd-grid-type-renderer', 'ytd-rich-item-renderer',
        'ytd-playlist-type-renderer', 'ytd-playlist-panel-type-renderer', 'ytd-compact-type-renderer']; //it may be video, playlist, radio
    var types = ['video', 'playlist', 'radio']
}
catch (SyntaxError) {

}


setInterval(firstVideoBlock, 1000)

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
                title = video.querySelector('#video-title').innerText
            }
            catch (TypeError) {
                continue;
            }
        }
        else {
            title = ariaLabel.slice(0, ariaLabel.lastIndexOf('by'));
        }
        if (title === null) { //It isn't video, it is channel, ads or something else
            continue;
        }
        console.log(title)

    }
    console.log(window.location.href)
}

function secondVideoBlock() {

}

