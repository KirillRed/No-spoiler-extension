console.log(chrome.runtime.getURL('popup/forbidden-keywords.js'))
const script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL('./popup/exceptions.js'));
const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.lastChild);