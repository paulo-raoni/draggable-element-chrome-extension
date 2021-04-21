const encodeImageFileAsURL = (element) => {
  const file = element.files[0];
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
};

// Sets listener on page loaded
document.addEventListener("DOMContentLoaded", () => {
  const createElementInput = document.querySelector("form");
  createElementInput.addEventListener("submit", async (event) => {
    event.preventDefault();
    const elements = event.target.elements;
    const imageFile = elements[0];
    const height = elements[1].value;
    const width = elements[2].value;

    const imageBase64 = await encodeImageFileAsURL(imageFile);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            height,
            width,
            imageBase64
        });
    });
  });
});
