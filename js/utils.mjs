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
            // Safely get base URL for correct path in dev and preview
            let baseUrl = "/";
            try {
                baseUrl = import.meta.env.BASE_URL;
            } catch {
                baseUrl = "/";
            }

            //get header and footer contents with absolute paths using baseUrl
            const loadHeader = loadTemplate(`${baseUrl}partials/header.html`);
            const loadFooter = loadTemplate(`${baseUrl}partials/footer.html`);

            //get header and footer elements
            const headerElement = document.getElementById('header');
            const footerElement = document.getElementById('footer');

            //Render header and footer
            Promise.all([
                renderWithTemplate(loadHeader, headerElement),
                renderWithTemplate(loadFooter, footerElement)
            ]).then(() => {
                resolve(); // Resolve promise after rendering
            }).catch(reject); // Reject if there's an error in rendering
        } catch (error) {
            reject(error);
        }
    });

  }

export function loadHeaderFooterImages(imagePath) {
    let headerLogo = document.getElementById("header-logo");
    let footerLogo = document.getElementById("footer-logo");
    headerLogo.src = `${imagePath}images/lol-logo-fit.jpg`;
    footerLogo.src = `${imagePath}images/lol-logo-fit.jpg`;

    let writerLink = document.getElementById("content-form-button");
    writerLink.href = `${imagePath}writer/index.html`;
}

export function loadDialog(dialogID) {
    return new Promise((resolve, reject) => {
        try {
            //get the Dialog content
            const loadDialog = loadTemplate("partials/submission.html");

            //get the dialog element
            const dialogElement = document.getElementById(dialogID);

            //render dialog
            Promise.all([
                renderWithTemplate(loadDialog, dialogElement)
            ]).then(() => {
                console.log("dialog posted");
                resolve();
            }).catch(reject);
        } catch (error) {
            reject(error);
        }
    })
}  

export function loadYearDateModified() {
  const cYearElement = document.getElementById("currentyear"); 
  const lastModElement = document.getElementById("lastModified");

  if (cYearElement) {
      const currentYear = new Date().getFullYear();
      cYearElement.textContent = currentYear;
  }

  if (lastModElement) {
      const modified = new Date(document.lastModified).toLocaleDateString();;
      lastModElement.textContent = "last modified: " + modified;
  }
}
