function hideMessages() {
    for (const par of Array.from(document.getElementsByClassName('message'))) {
        par.setAttribute('hidden', 'true')
    }
}

function getInputHTML(inputCount) {
    return `<div class="form-inline ${inputCount}-div">\
    <input style="width: 300px;" class="form-control form-control-sm my-2 ${inputCount}-input keyword-input" type="text" placeholder="Keyword">\
    <button type="button" class="btn btn-danger ml-2 ${inputCount}-remove-button">Remove</button>\
    </div>`;
}

function addRemoveButtonListener(inputCount_) {
    const removeButton = document.getElementsByClassName(`${inputCount_}-remove-button`)[0];
    removeButton.addEventListener('click', () => {
        hideMessages();
        const buttonIndex = removeButton.classList[removeButton.classList.length - 1][0]
        const inputDiv = document.getElementsByClassName(`${buttonIndex}-div`)[0];
        inputDiv.remove()
        inputCount_--;
        if (inputCount_ <= 7) {
            document.getElementById('free-trial-warning').setAttribute('hidden', 'true')
        }
    })
}


window.onload = () => {
    let inputCount = 1;


    const addKeywordButton = document.getElementById('add-keyword')
    const saveButton = document.getElementById('save-button');

    let free;
    chrome.storage.sync.get(['free'], result => {
        free = result.free
    })



    addKeywordButton.addEventListener('click', () => {
        hideMessages();
        console.log(free)
        if ((inputCount > 7) && free) {
            const freeTrialWarning = document.getElementById('free-trial-warning');
            freeTrialWarning.removeAttribute('hidden')
        }

        else {
            const inputHtml = getInputHTML(inputCount)
            saveButton.insertAdjacentHTML('beforebegin', inputHtml);
            addRemoveButtonListener(inputCount);
            inputCount++;
        }
    })

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
        console.log(result.keywords)
        if (result.keywords.length === 0) {
            addKeywordButton.click();
        }
        for (const keyword of result.keywords) {
            if ((inputCount > 7) && free) {
                break;
            }
            const inputHtml = getInputHTML(inputCount)
            saveButton.insertAdjacentHTML('beforebegin', inputHtml);
            let inputs = Array.from(document.getElementsByClassName('form-control'));
            inputs[inputs.length - 1].value = keyword;
            addRemoveButtonListener(inputCount);
            inputCount++;
        }
    })

}