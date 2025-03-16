export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
// save data to local storage
export function setLocalStorage(key, data) {
localStorage.setItem(key, JSON.stringify(data));
}

export async function renderWithTemplate(templateFn, parentElement, data, callback, position="afterbegin", clear=true) {
    if (clear) {
        parentElement.innerHTML = "";
    }
    const htmlString = await templateFn(data);
    parentElement.insertAdjacentHTML(position, htmlString);
    if(callback) {
        callback(data);
    }
  }

function loadTemplate(path) {
  return async function () {
      const res = await fetch(path);
      if (res.ok) {
      const html = await res.text();
      return html;
      }
  };
}

export function loadHeaderFooter() {
    return new Promise((resolve, reject) => {
      try {
        // Get the header and footer contents
        const loadHeader = loadTemplate("/partials/header.html");
        const loadFooter = loadTemplate("/partials/footer.html");
  
        // Get the header and footer elements from the dom
        const headerElement = document.getElementById('header');
        const footerElement = document.getElementById('footer');
  
        // Render the header and footer
        Promise.all([
          renderWithTemplate(loadHeader, headerElement),
          renderWithTemplate(loadFooter, footerElement)
        ]);
      } catch (error) {
        reject(error);
      }
    });
  }