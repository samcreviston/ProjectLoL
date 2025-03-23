import { getcampaignData } from "./moduleUtils.mjs";

const campaignSection = document.getElementById('campaign-list-section');
const compactToggle = document.getElementById("compact-checkbox");

compactToggle.addEventListener("change", toggleSwitch);


//callback function to create element with given properties
function createElement(tag, className, content = '', href = '') {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (content) {
        element.innerHTML = content;
    }
    if (href) {
        element.href = href;
    }
    return element;
}

//callback function to create full campaign card
function createFullCampaignCard(campaign) {
    const campaignCard = createElement('div', 'full-campaign-card');

    const campaignNameElement = createElement('a', 'campaign-name', `<h3>${campaign.name}</h3>`, './module/index.html');
    campaignCard.appendChild(campaignNameElement);

    const campaignDescriptionElement = createElement('p', 'campaign-description', campaign.description);
    campaignCard.appendChild(campaignDescriptionElement);

    const averageStartPartyLevelElement = createElement('p', '', `Average Start Party Level: ${campaign.averageStartPartyLevel}`);
    campaignCard.appendChild(averageStartPartyLevelElement);

    const averagePartySizeElement = createElement('p', '', `Average Party Size: ${campaign.averagePartySize}`);
    campaignCard.appendChild(averagePartySizeElement);

    const adventureCountElement = createElement('p', '', `Number of Adventures: ${campaign.adventureCount}`);
    campaignCard.appendChild(adventureCountElement);

    return campaignCard;
}

//callback function to create compact campaign card
function createCompactCampaignCard(campaign) {
    const campaignCard = createElement('div', 'compact-campaign-card');

    const campaignNameElement = createElement('a', 'campaign-name', `<h3>${campaign.name}</h3>`, './module/index.html');
    campaignCard.appendChild(campaignNameElement);

    const averageStartPartyLevelElement = createElement('p', 'campaign-stat', campaign.averageStartPartyLevel);
    campaignCard.appendChild(averageStartPartyLevelElement);

    const averagePartySizeElement = createElement('p', 'campaign-stat', campaign.averagePartySize);
    campaignCard.appendChild(averagePartySizeElement);

    const adventureCountElement = createElement('p', 'campaign-stat', campaign.adventureCount);
    campaignCard.appendChild(adventureCountElement);

    return campaignCard;
}

//higher order function to display full campaign cards
export async function displayFullCampaigns() {
    const campaigns = await getcampaignData();

    campaignSection.innerHTML = ''; // Clear existing content

    // Use map to create and append campaign cards
    Object.values(campaigns[0])
        .map(createFullCampaignCard)
        .forEach(campaignCard => campaignSection.appendChild(campaignCard));
}

//higher order function to display the compact campaign cards
export async function displayCompactCampaigns() {
    const campaigns = await getcampaignData();

    campaignSection.innerHTML = ''; // Clear existing content

    //Create and append headers for compact view
    const campaignCardHeader = createElement('div', 'compact-campaign-card');
    campaignCardHeader.appendChild(createElement('h4', '', 'Campaign Name'));
    campaignCardHeader.appendChild(createElement('h4', '', 'Average Party Level'));
    campaignCardHeader.appendChild(createElement('h4', '', 'Average Party Size'));
    campaignCardHeader.appendChild(createElement('h4', '', 'Adventure Count'));
    campaignSection.appendChild(campaignCardHeader);

    //Use map to create and append campaign cards
    Object.values(campaigns[0])
        .map(createCompactCampaignCard)
        .forEach(campaignCard => campaignSection.appendChild(campaignCard));
}

function toggleSwitch() {
    if (document.getElementById("compact-checkbox").checked) {
        displayCompactCampaigns();
    } else {
        displayFullCampaigns();
    }
}