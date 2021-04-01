import { keywords } from './background'

function block() {
    let videos = document.getElementsByTagName('ytd-video-renderer');
    for (let video of (<any>Array).from(videos)) {
        let title = video.getElementsByTagName('yt-formatted-string');
        console.log(title.length)
        console.log(title.length)
    }
}




