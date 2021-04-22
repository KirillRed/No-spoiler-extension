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

setInterval(videoBlock, 1000)

function videoBlock() {
    let videos = Array.from(document.getElementById('spinner-container').parentNode.querySelector('#contents').children);
    for (const video of videos.slice(0, videos.length - 1)) {
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
        console.log(title, ariaLabel)
    }
}

