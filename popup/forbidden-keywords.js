window.onload = () => {
    const inputHtml = '<input class="form-control form-control-sm my-2" type="text" placeholder="Keyword">'
    const addKeywordButton = document.getElementById('add-keyword');
    addKeywordButton.addEventListener('click', () => {
        addKeywordButton.insertAdjacentHTML('beforebegin', inputHtml);
    })
}