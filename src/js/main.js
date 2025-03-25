import { loadHeaderFooter } from "./utils.mjs";
import { loadYearDateModified } from "./utils.mjs";
import { loadDialog } from "./utils.mjs";
import { displayFullCampaigns } from "./moduleList.mjs";

Promise.all([loadHeaderFooter(), loadDialog("campaign-submission-dialog")])
.then(() => {
    loadYearDateModified();
    displayFullCampaigns();

    const SubmitContentButton = document.querySelector("#content-form-button");
    const formDialogue = document.querySelector("#campaign-submission-dialog");

    SubmitContentButton.addEventListener("click", () => {
        formDialogue.showModal();
    }); 
}).catch(error => console.error("Error loading header/footer:", error));