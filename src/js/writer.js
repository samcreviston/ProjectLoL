import { loadHeaderFooter } from "./utils.mjs";
import { loadYearDateModified } from "./utils.mjs";
import { createAddSectionTool, createSection, showAddSectionMenu } from './writerUtils.mjs';

loadHeaderFooter().then(() => {
    loadYearDateModified();
}).catch(error => console.error("Error loading header/footer:", error));

const form = document.getElementById("story-form");
  
// Kick things off by adding the first + tool
form.appendChild(createAddSectionTool(form));