import { loadHeaderFooter, loadYearDateModified, loadHeaderFooterImages } from "./utils.mjs";
import { loadModuleById } from "./moduleUtils.mjs"

loadHeaderFooter().then(() => {
    loadHeaderFooterImages("../");
    loadYearDateModified();
    loadModuleById();
}).catch(error => console.error("Error loading header/footer:", error));