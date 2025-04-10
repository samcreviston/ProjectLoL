import { getAPIData, createStatBlock } from './dndapiUtils.mjs';

function createStatModal(stat, statData) {
    const trigger = document.createElement('div');
    trigger.classList.add('hover-trigger');
    trigger.textContent = stat["stat-name"];

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('span');
    modalContent.classList.add('modal-content');
    modalContent.id = `hover-${stat["stat-id"].split("/").pop()}`;

    createStatBlock(statData, modalContent);

    modal.appendChild(modalContent);
    trigger.appendChild(modal);

    return trigger;
}

async function handleAdventureWithStat(sectionArray, sectionDiv) {
    const statSection = document.createElement('p');
    statSection.classList.add('adventure-content');

    for (let entry of sectionArray) {
        if (entry["story-text"]) {
            // Add story-text as text node
            statSection.appendChild(document.createTextNode(entry["story-text"] + " "));
        }

        if (entry["stat"]) {
            const stat = entry["stat"][0];
            try {
                const statData = await getAPIData(stat["stat-id"]);
                const statTrigger = createStatModal(stat, statData);
                statSection.appendChild(statTrigger);
                statSection.appendChild(document.createTextNode(" ")); // Space after stat
            } catch (error) {
                console.error(`Failed to load stat: ${stat["stat-id"]}`, error);
            }
        }
    }

    sectionDiv.appendChild(statSection);
}

export async function getcampaignData() {
    const campaignsUrl = "./public/json/modules.json";
    const response = await fetch(campaignsUrl);
    const campaigns = await response.json();
    return campaigns;
}

//get ID for loadModulebyID
export function getModuleIndexFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

export async function populateModuleContent(moduleData, moduleMetaData) {
    // Update metadata
    document.querySelector('.campaign-header').textContent = moduleMetaData.name;
    document.querySelector('.author').textContent = `By ${moduleMetaData.author || 'Unknown'}`;
    document.querySelector('.description').textContent = moduleMetaData.description;

    const adventureSection = document.querySelector('.adventure');

    for (let section of moduleData.module) {
        const sectionDiv = document.createElement('div');

        if (section.type === 'adventure-title') {
            const title = document.createElement('h2');
            title.classList.add('adventure-header');
            title.textContent = section.text;
            sectionDiv.appendChild(title);
        }

        if (section.type === 'subtitle') {
            const subtitle = document.createElement('h3');
            subtitle.classList.add('adventure-subtitle');
            subtitle.textContent = section.text;
            sectionDiv.appendChild(subtitle);
        }

        if (section.type === 'story') {
            const paragraph = document.createElement('p');
            paragraph.classList.add('adventure-content');
            paragraph.textContent = section.text;
            sectionDiv.appendChild(paragraph);
        }

        if (section.type === 'DM-notes') {
            const noteSection = document.createElement('section');
            noteSection.classList.add('DM-note');
            const noteContainer = document.createElement('div');
            noteContainer.classList.add('container');

            const noteContent = document.createElement('div');
            noteContent.classList.add('adventure-content');
            noteContent.textContent = section.text;

            noteContainer.appendChild(noteContent);
            noteSection.appendChild(noteContainer);
            sectionDiv.appendChild(noteSection);
        }

        if (section["adventure-with-stat"]) {
            await handleAdventureWithStat(section["adventure-with-stat"], sectionDiv);
        }

        adventureSection.appendChild(sectionDiv);
    }
}


export async function loadModuleById() {
    const id = getModuleIndexFromURL();
    if (!id) return;

    try {
        // Fetch the modules index (modules.json) to get the metadata
        const modulesResponse = await fetch('../public/json/modules.json');
        if (!modulesResponse.ok) throw new Error("Modules index not found");
        const modulesData = await modulesResponse.json();
        

        // Find the module's metadata based on the ID
        const moduleMetaData = Object.values(modulesData[0]).find(module => module.id === id);
        if (!moduleMetaData) throw new Error("Module metadata not found");
        console.log(moduleMetaData);

        // Fetch the module content (story json)
        const moduleContentResponse = await fetch(`../public/json/modules/${id}.json`);
        if (!moduleContentResponse.ok) throw new Error("Module content not found");
        const moduleData = await moduleContentResponse.json();
        console.log(moduleData);

        // Now populate the module with both metadata and content
        populateModuleContent(moduleData, moduleMetaData);
    } catch (err) {
        console.error("Error loading module:", err);
    }
}