let keywords = ['tangled', 'itpedia', 'english', 'rocket league', 'angular', 'mandalorian', 'rapunzel', 'clone wars', 'звездные войны']

function block() {
    let videos = document.getElementsByTagName('ytd-video-renderer');
    for (let video of (<any>Array).from(videos)) {
        let title = video.getElementsByTagName('yt-formatted-string');
        console.log(title.length)
        console.log(title.length)
    }
}




