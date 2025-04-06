import { loadHeaderFooter } from "./utils.mjs";
import { loadYearDateModified } from "./utils.mjs";
import { createAddSectionTool, createSection, showAddSectionMenu } from './writerUtils.mjs';

loadHeaderFooter().then(() => {
    loadYearDateModified();
}).catch(error => console.error("Error loading header/footer:", error));

//dynamically generate the first + tool
const form = document.getElementById("story-form");
form.appendChild(createAddSectionTool(form));