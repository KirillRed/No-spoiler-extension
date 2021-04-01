"use strict";
exports.__esModule = true;
function block() {
    var videos = document.getElementsByTagName('ytd-video-renderer');
    for (var _i = 0, _a = Array.from(videos); _i < _a.length; _i++) {
        var video = _a[_i];
        var title = video.getElementsByTagName('yt-formatted-string');
        console.log(title.length);
        console.log(title.length);
    }
}
