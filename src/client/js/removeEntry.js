export function registerRemoveEvent(removeBtnElement) {
    removeBtnElement.addEventListener('click', removeEntry);
}

async function removeEntry(event) {
    // get 'entryID' from the parent's data attribute
    const entryInfoHolder = event.target.parentElement;
    const selectedEntryId = entryInfoHolder.dataset.entryid;

    const reqUrl = 'http://localhost:8000/entry';
    const res = await fetch(`${reqUrl}/${selectedEntryId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    try {
        if (res.status !== 200) {
            console.error(`Delete entry received error: ${res.status}`);
        } else {
            entryInfoHolder.remove();
        }
    } catch (error) {
        // If something goes wrong send error message
        console.warn('An error has occured', error);
    }
};