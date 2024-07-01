export const focusOnInputElement = (element: HTMLInputElement, shallConsiderRange?: boolean) => {
    if(shallConsiderRange){
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    element.focus();
};