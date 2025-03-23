import { loadHeaderFooter } from "./utils.mjs";
import { loadYearDateModified } from "./utils.mjs";

loadHeaderFooter().then(() => {
    loadYearDateModified();
}).catch(error => console.error("Error loading header/footer:", error));