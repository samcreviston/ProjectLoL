export async function getcampaignData() {
    const campaignsUrl = "./public/json/modules.json";
    const response = await fetch(campaignsUrl);
    const campaigns = await response.json();
    return campaigns;
}