export { dragElement };

function dragElement(elementId, headerId, options) {
    let draggableElement = document.getElementById(elementId);
    let draggableElementHeader = document.getElementById(headerId);

    let originalElementClickX = 0, originalElementClickY = 0;

    if (options) {
        draggableElement.style.top = options.top;
        draggableElement.style.left = options.left;
    }

    draggableElementHeader.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        originalElementClickX = e.clientX - draggableElement.offsetLeft;
        originalElementClickY = e.clientY - draggableElement.offsetTop;
        // call a function when mouse button is released:
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // set the draggableElement's new position:
        draggableElement.style.top = (e.clientY - originalElementClickY) + "px";
        draggableElement.style.left = (e.clientX - originalElementClickX) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}