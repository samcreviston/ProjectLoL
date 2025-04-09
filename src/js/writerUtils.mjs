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
        <button type="button" id="save-button">Save Draft</button>
        <button type="button" id="publish-button">Publish</button>
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