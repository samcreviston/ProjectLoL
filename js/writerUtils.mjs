// Create + Add Section Tool
export function createAddSectionTool(form) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("add-section");

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.innerHTML = "+";
    addButton.title = "Add section";

    const line = document.createElement("div");
    line.className = "add-section-line";

    let currentSelect = null;

    addButton.addEventListener("click", () => {
        if (currentSelect) {
            currentSelect.remove();
            currentSelect = null;
        } else {
            currentSelect = showAddSectionMenu(wrapper, form);
        }
    });

    wrapper.appendChild(addButton);
    wrapper.appendChild(line);
    return wrapper;
}

// Section Dropdown Menu
export function showAddSectionMenu(insertAfterElement, form) {
    const select = document.createElement("select");
    select.innerHTML = `
        <option disabled selected>Select section type</option>
        <option value="story">Story Paragraph</option>
        <option value="writer-notes">Writer Notes</option>
        <option value="img">Image</option>
        <option value="additional-details">Additional Details</option>
    `;
    select.classList.add("dropdown-selector");
    insertAfterElement.appendChild(select);

    select.addEventListener("change", () => {
        const type = select.value;
        const section = createSection(type);
        const newAddTool = createAddSectionTool(form);

        form.insertBefore(section, insertAfterElement.nextSibling);
        form.insertBefore(newAddTool, section.nextSibling);

        select.remove();
    });

    return select;
}

// Section Creator
export function createSection(type) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("story-section");
    wrapper.dataset.type = type;

    switch (type) {
        case "story":
            wrapper.innerHTML = `
                <label>Story Paragraph:</label>
                <textarea name="story[]" required></textarea>
            `;
            break;

        case "writer-notes":
            wrapper.innerHTML = `
                <label>Writer Notes:</label>
                <textarea name="writer-notes[]" style="font-style: italic;" required></textarea>
            `;
            break;

        case "img":
            const label = document.createElement("label");
            label.textContent = "Upload Image:";
            const imgInput = document.createElement("input");
            imgInput.type = "file";
            imgInput.accept = "image/*";
            imgInput.name = "images[]";

            const preview = document.createElement("img");

            imgInput.addEventListener("change", e => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        preview.src = reader.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

            wrapper.appendChild(label);
            wrapper.appendChild(imgInput);
            wrapper.appendChild(preview);
            break;

        case "additional-details":
            wrapper.innerHTML = `
                <label>Additional Details:</label>
                <textarea name="additional-details[]" required style="color: red;"></textarea>
            `;
            break;
    }

    return wrapper;
}

// Metadata Fields
export function insertStoryMetadataFields(form) {
    const metadataHTML = `
        <div class="metadata-section">
            <label>Title (max 50): <input type="text" name="title" maxlength="50" required></label>
            <label>Author (max 40): <input type="text" name="author" maxlength="40" required></label>
            <label>Description (max 100): <textarea name="description" maxlength="100" required></textarea></label>
            <label>Start Level:
                <select name="start-level" required>
                    ${Array.from({ length: 21 }, (_, i) => i < 20 ? 
                        `<option value="${i}">${i}</option>` : 
                        `<option value="20+">20+</option>`).join("")}
                </select>
            </label>
            <label>Party Size:
                <input type="text" name="party-size" pattern="^([1-8]|[1-8]-[1-8]|9\\+)$" required>
            </label>
            <label>Adventure Count:
                <input type="number" name="adventure-count" min="1" max="30" required>
            </label>
        </div>
    `;
    form.insertAdjacentHTML("afterbegin", metadataHTML);
}

// Form Initialization (new story)
export function initializeWriterForm(form) {
    insertStoryMetadataFields(form);
    const firstAdd = createAddSectionTool(form);
    const firstSection = createSection("story");
    const secondAdd = createAddSectionTool(form);

    form.appendChild(firstAdd);
    form.appendChild(firstSection);
    form.appendChild(secondAdd);

    const controls = document.createElement("div");
    controls.id = "story-controls";
    controls.innerHTML = `
    <button type="button" id="load-button">Load Last Save</button>
    <button type="button" id="save-button">Save Draft</button>
    <button type="button" id="publish-button">Submit</button>
    `;
    form.appendChild(controls);
}

// Convert Title to Slug
export function slugify(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

export function saveStoryToLocalStorage(form) {
    const formData = new FormData(form);

    // Check for required metadata fields
    const title = formData.get("title");
    const author = formData.get("author");
    const description = formData.get("description");
    const startLevel = formData.get("start-level");
    const partySize = formData.get("party-size");
    const adventureCount = formData.get("adventure-count");

    if (!title || !author || !description || !startLevel || !partySize || !adventureCount) {
        alert("Please fill out all metadata fields before saving.");
        return;
    }

    const metadata = {
        name: title.trim(),
        author: author.trim(),
        description: description.trim(),
        startLevel: startLevel,
        partySize: partySize,
        adventureCount: parseInt(adventureCount)
    };

    // Story content
    const module = [];
    const sectionDivs = form.querySelectorAll(".story-section");

    sectionDivs.forEach(div => {
        const type = div.dataset.type;
        const textarea = div.querySelector("textarea");
        const text = textarea ? textarea.value.trim() : "";

        if (!text || type === "img") return;

        let mappedType = null;
        if (type === "story") mappedType = "adventure";
        else if (type === "writer-notes") mappedType = "DM-notes";
        else if (type === "additional-details") mappedType = "add-details";

        if (mappedType) {
            module.push({ type: mappedType, text });
        }
    });

    const storyData = {
        metadata,
        module
    };

    const storageKey = metadata.name.toLowerCase().replace(/\s+/g, "-");
    localStorage.setItem(`draft-${storageKey}`, JSON.stringify(storyData));
    alert("Draft saved!");
}

export function loadStoryFromLocalStorage(form) {
    //Try to get title input value
    const titleInput = form.querySelector("input[name='title']");
    const title = titleInput?.value.trim();

    if (!title) {
        //List available drafts
        const drafts = Object.keys(localStorage)
            .filter(key => key.startsWith("draft-"))
            .map(key => `• ${key.replace("draft-", "").replace(/-/g, " ")}`);

        const message = drafts.length
            ? `Please enter a story title to load.\n\nSaved drafts:\n${drafts.join("\n")}`
            : "Please enter a story title to load.\n\nNo saved drafts found.";

        alert(message);
        return;
    }

    const storageKey = `draft-${title.toLowerCase().replace(/\s+/g, "-")}`;
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
        alert(`No saved draft found for “${title}”.`);
        return;
    }

    const storyData = JSON.parse(saved);
    const { metadata, module } = storyData;

    //Clear the form first
    form.innerHTML = "";

    //Reinsert metadata fields
    insertStoryMetadataFields(form);

    //Refill metadata
    form.querySelector("input[name='title']").value = metadata.name;
    form.querySelector("input[name='author']").value = metadata.author;
    form.querySelector("textarea[name='description']").value = metadata.description;
    form.querySelector("select[name='start-level']").value = metadata.startLevel;
    form.querySelector("input[name='party-size']").value = metadata.partySize;
    form.querySelector("input[name='adventure-count']").value = metadata.adventureCount;

    //Add sections
    module.forEach(entry => {
        let type = null;

        if (entry.type === "adventure") type = "story";
        else if (entry.type === "DM-notes") type = "writer-notes";
        else if (entry.type === "add-details") type = "additional-details";
        else return;// skip unknowns or images

        const section = createSection(type);
        const textarea = section.querySelector("textarea");
        if (textarea) textarea.value = entry.text;

        const addTool = createAddSectionTool(form);
        form.appendChild(section);
        form.appendChild(addTool);
    });

    //Add controls at the bottom
    const controls = document.createElement("div");
    controls.id = "story-controls";
    controls.innerHTML = `
        <button type="button" id="save-button">Save Draft</button>
        <button type="button" id="publish-button">Submit</button>
        <button type="button" id="load-button">Load Last Save</button>
    `;
    form.appendChild(controls);
}

export function publishStory() {
    //still in progress, working on this sending me an email
    alert("Module sent to the Lair Lord for approval and publishing, congratulations!");
}