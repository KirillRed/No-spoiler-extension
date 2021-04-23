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
    <input style="width: 300px;" class="form-control form-control-sm my-2 ${getInputIndex()}-input keyword-input" type="text" placeholder="Keyword">\
    <button type="button" class="btn btn-danger ml-2 ${getInputIndex()}-remove-button">Remove</button>\
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

export function addAddKeywordListener(free) {
    addKeywordButton.addEventListener('click', () => {
        hideMessages();
        if ((getInputIndex() > 7) && free) {
            const freeTrialWarning = document.getElementById('free-trial-warning');
            freeTrialWarning.removeAttribute('hidden')
        }

        else {
            console.log(getInputIndex())
            const inputHtml = getInputHTML()
            saveButton.insertAdjacentHTML('beforebegin', inputHtml);
            addRemoveButtonListener();
        }
    })
}



window.onload = () => {
    let free;
    chrome.storage.sync.get(['free'], result => {
        free = result.free
        if (free === undefined) {
            chrome.storage.sync.set({ free: false });
            free = false;
        }
    })
    addAddKeywordListener(free);
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
            chrome.storage.sync.set({ keywords: inputKeywords });
            document.getElementById('save-success').removeAttribute('hidden');
        }

    })
    //TODO if keywords bigger than 1, don`t click
    chrome.storage.sync.get(['keywords'], result => {

        if (!result.keywords || result.keywords.length === 0) {
            chrome.storage.sync.set({ 'keywords': [] })
            addKeywordButton.click();
        }
        for (const keyword of result.keywords) {
            if ((getInputIndex() > 7) && free) {
                break;
            }
            console.log(getInputIndex())
            const inputHtml = getInputHTML()
            saveButton.insertAdjacentHTML('beforebegin', inputHtml);
            let inputs = Array.from(document.getElementsByClassName('form-control'));
            inputs[inputs.length - 1].value = keyword;
            addRemoveButtonListener(getInputIndex());
        }
    })

}