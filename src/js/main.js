import { loadHeaderFooter } from "./utils.mjs";
import { loadYearDateModified } from "./utils.mjs";
import { displayFullCampaigns } from "./moduleList.mjs";

loadHeaderFooter().then(() => {
    loadYearDateModified();
    displayFullCampaigns();
}).catch(error => console.error("Error loading header/footer:", error));