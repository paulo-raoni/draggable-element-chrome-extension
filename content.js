const scriptWrapper = (imageBase64, height, width) => {
  const CONTAINER_ID = "container-draggable-base64";

  const setDragBehavior = () => {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    const containerElement = document.getElementById(CONTAINER_ID);

    const closeDragElement = () => {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    };

    const elementDrag = (e) => {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      containerElement.style.top = containerElement.offsetTop - pos2 + "px";
      containerElement.style.left = containerElement.offsetLeft - pos1 + "px";
    };

    const dragMouseDown = (e) => {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    };

    const dragElement = () => {
      const header = containerElement.id + "header";
      if (document.getElementById(header)) {
        // if present, the header is where you move the DIV from:
        document.getElementById(header).onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        containerElement.onmousedown = dragMouseDown;
      }
    };

    // Make the DIV element draggable:
    dragElement();
  };

  const createContainerElement = (imageBase64) => {
    const draggableElement = document.createElement("div");
    draggableElement.setAttribute("id", CONTAINER_ID);

    draggableElement.innerHTML = `
          <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
          <span>
         
          <div id="moverElement">
              <img
              style="width: 100%; height:100%; object-fit: cover;"
              src="${imageBase64}"
              class="container_img">
          </div>
      `;

    document.body.appendChild(draggableElement);

    const container = document.querySelector("#container-draggable-base64");
    const moverElement = document.querySelector("#moverElement");

    container.setAttribute(
      "style",
      ` position: absolute;
          top: 170px;
          z-index: 1000000000000000000000;
          width: ${width ? width + "px" : "200px"};
          height: ${height ? height + "px" : "200px"};
          border: 1px solid rgb(211, 211, 211);
          text-align: center;
          resize: both;
          overflow: auto;
          left: 280px;`
    );

    moverElement.setAttribute(
      "style",
      ` cursor: move,
          z-index: 1000000000000000000001;
          color: #fff;
          margin: 0;
          width: 100%;
          height: 100%;`
    );
  };

  const destroyPreviousContanierElement = () => {
    const draggableElement = document.querySelector(`#${CONTAINER_ID}`);
    if (draggableElement) {
      draggableElement.innerHTML = "";
      draggableElement.remove();
    }
  };

  destroyPreviousContanierElement();

  createContainerElement(imageBase64);

  setDragBehavior();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const imageBase64 = request.imageBase64;
  const height = request.height;
  const width = request.width;

  if (imageBase64) {
    scriptWrapper(imageBase64, height, width);
  }
});
