

import {
    addKeywordButton, saveButton, getInputIndex, getInputHTML, addRemoveButtonListener,
    addAddKeywordListener, hideMessages
} from '../popup/forbidden-keywords.js';



window.onload = () => {
    addAddKeywordListener();
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
            chrome.storage.sync.set({ 'exceptionsNoSpoiler': exceptions });
            document.getElementById('save-success').removeAttribute('hidden');
        }

    })
    //TODO if keywords bigger than 1, don`t click
    chrome.storage.sync.get(['exceptionsNoSpoiler'], result => {

        if (!result.exceptionsNoSpoiler || result.exceptionsNoSpoiler.length === 0) {
            chrome.storage.sync.set({ 'exceptionsNoSpoiler': [] })
            addKeywordButton.click();
        }
        for (const exception of result.exceptionsNoSpoiler) {
            const inputHtml = getInputHTML()
            saveButton.insertAdjacentHTML('beforebegin', inputHtml);
            let inputs = Array.from(document.getElementsByClassName('form-control'));
            inputs[inputs.length - 1].value = exception;
            addRemoveButtonListener(getInputIndex());
        }
    })

}