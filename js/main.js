import { loadHeaderFooter } from "./utils.mjs";
import { loadYearDateModified } from "./utils.mjs";
import { loadDialog } from "./utils.mjs";
import { displayFullCampaigns } from "./moduleList.mjs";

Promise.all([loadHeaderFooter(), loadDialog("campaign-submission-dialog")])
.then(() => {
    loadYearDateModified();
    displayFullCampaigns();
}).catch(error => console.error("Error loading header/footer:", error));