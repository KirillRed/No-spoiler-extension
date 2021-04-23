for (const block of Array.from(document.getElementsByClassName('div-blocked'))) {
    block.parentElement.classList.remove('blocked')
    for (const contentDiv of Array.from(block.parentElement.children)) {
        contentDiv.removeAttribute('hidden')
    }
    block.remove();
}