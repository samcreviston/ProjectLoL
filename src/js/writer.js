import { loadHeaderFooter, loadHeaderFooterImages } from "./utils.mjs";
import { loadYearDateModified } from "./utils.mjs";
import { initializeWriterForm } from "./writerUtils.mjs";

loadHeaderFooter().then(() => {
    loadHeaderFooterImages("../");
    loadYearDateModified();
}).catch(error => console.error("Error loading header/footer:", error));

const form = document.createElement("form");
document.querySelector("main").appendChild(form);

initializeWriterForm(form);