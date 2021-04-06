window.onload = () => {
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('src', chrome.runtime.getURL('search-results/search-results.js'));
    document.body.insertAdjacentElement('beforeend', script);
}