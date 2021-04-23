

import {
    addKeywordButton, saveButton, getInputIndex, getInputHTML, addRemoveButtonListener,
    addAddKeywordListener, hideMessages
} from '../popup/forbidden-keywords.js';



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
        let exceptions = [];
        let inputs = Array.from(document.getElementsByClassName('keyword-input'));

        for (const input of inputs) {
            if (input.value.trim().length < 3) {
                success = false;
                document.getElementById('length-warning').removeAttribute('hidden');
                input.value = input.value.trim()
                continue;
            }
            exceptions.push(input.value.trim())
        }
        if (success) {
            chrome.storage.sync.set({ exceptions: exceptions });
            document.getElementById('save-success').removeAttribute('hidden');
        }

    })
    //TODO if keywords bigger than 1, don`t click
    chrome.storage.sync.get(['exceptions'], result => {

        if (!result.exceptions || result.exceptions.length === 0) {
            chrome.storage.sync.set({ exceptions: [] })
            addKeywordButton.click();
        }
        for (const exception of result.exceptions) {
            if ((getInputIndex() > 7) && free) {
                break;
            }
            const inputHtml = getInputHTML()
            saveButton.insertAdjacentHTML('beforebegin', inputHtml);
            let inputs = Array.from(document.getElementsByClassName('form-control'));
            inputs[inputs.length - 1].value = exception;
            addRemoveButtonListener(getInputIndex());
        }
    })

}