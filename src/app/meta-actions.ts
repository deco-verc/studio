'use server';

import { bizSdk, AdAccount, UserData, ServerEvent, CustomData } from 'facebook-nodejs-business-sdk';

const accessToken = process.env.META_ACCESS_TOKEN;
const pixelId = process.env.META_PIXEL_ID;

if (!accessToken || !pixelId) {
    console.warn("Meta Pixel ID or Access Token is not set in environment variables. Server-side events will not be sent.");
} else {
    bizSdk.FacebookAdsApi.init(accessToken);
}

interface UserDataCAPI {
    client_ip_address: string | null;
    client_user_agent: string | null;
    fbc: string | null;
    fbp: string | null;
    email: string | null;
    phone: string | null;
}

interface CustomDataCAPI {
    value?: number;
    currency?: string;
}

export async function sendServerEvent(eventName: string, eventId: string, userData: UserDataCAPI, customData?: CustomDataCAPI) {
    if (!accessToken || !pixelId) {
        return;
    }

    try {
        const userDataToSend = new UserData()
            .setClientIpAddress(userData.client_ip_address)
            .setClientUserAgent(userData.client_user_agent)
            .setFbc(userData.fbc)
            .setFbp(userData.fbp)
            .setEmails(userData.email ? [userData.email] : null)
            .setPhones(userData.phone ? [userData.phone] : null);
        
        const customDataToSend = new CustomData();
        if (customData?.value) {
            customDataToSend.setValue(customData.value);
        }
        if (customData?.currency) {
            customDataToSend.setCurrency(customData.currency);
        }

        const event = new ServerEvent()
            .setEventName(eventName)
            .setEventTime(Math.floor(Date.now() / 1000))
            .setEventId(eventId)
            .setUserData(userDataToSend)
            .setCustomData(customDataToSend)
            .setEventSourceUrl(process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/analise` : null)
            .setActionSource('website');

        const eventsData = [event];
        const account = new AdAccount(null); // account_id is optional
        
        // This is a workaround for the SDK not having a direct method for pixel events
        // We set the `id` of the account to our pixelId.
        account.id = pixelId;
        
        await account.createEvent([], eventsData);


        console.log(`CAPI Event '${eventName}' sent successfully with event ID: ${eventId}`);
        return { success: true, eventId };

    } catch (error: any) {
        console.error('Error sending CAPI event:', error?.message || error);
        if(error.isFacebookError) {
            console.error('Facebook API Error details:', error.getFbError());
        }
        return { success: false, error: error.message };
    }
}
