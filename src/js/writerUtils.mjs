export function createAddSectionTool(form) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("add-section");
  
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.innerHTML = "+";
    addButton.title = "Add section";
  
    const line = document.createElement("div");
    line.className = "add-section-line";
  
    // Track the select if it's open
    let currentSelect = null;
  
    addButton.addEventListener("click", () => {
      if (currentSelect) {
        currentSelect.remove(); // Toggle off
        currentSelect = null;
      } else {
        currentSelect = showAddSectionMenu(wrapper, form);
      }
    });
  
    wrapper.appendChild(addButton);
    wrapper.appendChild(line);
    return wrapper;
}
  
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

        select.remove(); // remove the menu after selection
    });
    return select;
}

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
        <textarea name="additional-details[]" required></textarea>
    `;
    break;

    default:
    break;
}

return wrapper;
}