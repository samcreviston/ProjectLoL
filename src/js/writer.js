import { loadHeaderFooter, loadHeaderFooterImages } from "./utils.mjs";
import { loadYearDateModified } from "./utils.mjs";
import { initializeWriterForm, saveStoryToLocalStorage, loadStoryFromLocalStorage, publishStory } from "./writerUtils.mjs";

loadHeaderFooter().then(() => {
    loadHeaderFooterImages("../");
    loadYearDateModified();
}).catch(error => console.error("Error loading header/footer:", error));

const form = document.getElementById("story-form");
initializeWriterForm(form);

form.addEventListener("click", e => {
    if (e.target.id === "save-button") {
        saveStoryToLocalStorage(form);
    } else if (e.target.id === "load-button") {
        loadStoryFromLocalStorage(form);
    }
});

document.getElementById("publish-button").addEventListener("click", () => {
    publishStory();
});