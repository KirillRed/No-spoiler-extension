const keywords = ['tangled', 'itpedia', 'english', 'rocket league', 'angular', 'mandalorian', 'mix']

setInterval(block, 1000)

let hideMix = true;

function block() {
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
        const title = titleTag.getElementsByTagName('span')[0].getAttribute('title')

        let blockedKeywords = []
        for (const keyword of keywords) {
            if (title.toLowerCase().includes(keyword)) {
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
            video.insertAdjacentHTML('beforeend', `<div class="div-blocked">Video blocked because of ${blockedKeywordsString} <br> If you want to restore it click <a>HERE</a></div>`)

            video.getElementsByClassName('div-blocked')[0].getElementsByTagName('a')[0].addEventListener('click', () => {
                contentDiv.removeAttribute('hidden')
                video.classList.remove('blocked')
                video.getElementsByClassName('div-blocked')[0].setAttribute('hidden', 'true')
            })


        }
    }
}
