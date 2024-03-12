export const addKeywordButton = document.getElementById('add-keyword')
export const saveButton = document.getElementById('save-button');

export function getInputIndex() {
    return document.getElementsByClassName('form-control').length + 1 //If length is 0, index is 1
}

export function hideMessages() {
    for (const par of Array.from(document.getElementsByClassName('message'))) {
        par.setAttribute('hidden', 'true')
    }
}

export function getInputHTML() { //To optimise exceptions
    return `<div class="form-inline ${getInputIndex()}-div">\
    <input class="form-control form-control-sm my-2 ${getInputIndex()}-input keyword-input" type="text" placeholder="Write here">\
    <button type="button" class="btn btn-danger remove-button ${getInputIndex()}-remove-button">Remove</button>\
    </div>`;
}

export function addRemoveButtonListener() {
    const removeButton = document.getElementsByClassName(`${getInputIndex() - 1}-remove-button`)[0];  //inputIndex was increased, but we need same inputIndex as inputHTML
    removeButton.addEventListener('click', () => {
        hideMessages();
        const buttonClassList = removeButton.classList
        const buttonClassListString = buttonClassList.toString().slice(buttonClassList.toString().lastIndexOf(' ') + 1)
        const buttonIndex = buttonClassList[removeButton.classList.length - 1].slice(0, buttonClassListString.indexOf('-'))
        const inputDiv = document.getElementsByClassName(`${buttonIndex}-div`)[0];
        inputDiv.remove()
    })
}

export function addAddKeywordListener() {
    addKeywordButton.addEventListener('click', () => {
        hideMessages();
        const inputHtml = getInputHTML()
        saveButton.insertAdjacentHTML('beforebegin', inputHtml);
        addRemoveButtonListener();
    })
}



window.onload = () => {
    addAddKeywordListener();
    saveButton.addEventListener('click', () => {
        hideMessages();
        let success = true;
        let inputKeywords = [];
        let inputs = Array.from(document.getElementsByClassName('keyword-input'));

        for (const input of inputs) {
            if (input.value.trim().length < 3) {
                success = false;
                document.getElementById('length-warning').removeAttribute('hidden');
                input.value = input.value.trim()
                continue;
            }
            inputKeywords.push(input.value.trim())
        }
        if (success) {
            chrome.storage.sync.set({ 'keywordsNoSpoiler': inputKeywords });
            document.getElementById('save-success').removeAttribute('hidden');
        }

    })
    //TODO if keywords bigger than 1, don`t click
    chrome.storage.sync.get(['keywordsNoSpoiler'], result => {

        if (!result.keywordsNoSpoiler || result.keywordsNoSpoiler.length === 0) {
            chrome.storage.sync.set({ 'keywordsNoSpoiler': [] })
            addKeywordButton.click();
        }
        for (const keyword of result.keywordsNoSpoiler) {
            console.log(getInputIndex())
            const inputHtml = getInputHTML()
            saveButton.insertAdjacentHTML('beforebegin', inputHtml);
            let inputs = Array.from(document.getElementsByClassName('form-control'));
            inputs[inputs.length - 1].value = keyword;
            addRemoveButtonListener(getInputIndex());
        }
    })

}