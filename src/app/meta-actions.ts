'use server';

import { bizSdk, AdAccount, UserData, ServerEvent, CustomData } from 'facebook-nodejs-business-sdk';

const accessToken = process.env.META_ACCESS_TOKEN;
const pixelId = process.env.META_PIXEL_ID;

if (!accessToken || !pixelId) {
    console.warn("Meta Pixel ID or Access Token is not set in environment variables. Server-side events will not be sent.");
} else {
    try {
        bizSdk.FacebookAdsApi.init(accessToken);
    } catch (e) {
        console.error("Failed to initialize Meta Business SDK. Check your access token.", e);
    }
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
        const userDataToSend = new UserData(
            userData.email ? [userData.email] : null,
            userData.phone ? [userData.phone] : null,
            null, // gender
            null, // date of birth
            null, // last name
            null, // first name
            null, // city
            null, // state
            null, // zip
            null, // country
            null, // external_id
            userData.client_ip_address,
            userData.client_user_agent,
            userData.fbp,
            userData.fbc
        );
        
        const customDataToSend = new CustomData();
        if (customData?.value) {
            customDataToSend.setValue(customData.value);
        }
        if (customData?.currency) {
            customDataToSend.setCurrency(customData.currency);
        }

        const serverEvent = new ServerEvent()
            .setEventName(eventName)
            .setEventTime(Math.floor(Date.now() / 1000))
            .setEventId(eventId)
            .setUserData(userDataToSend)
            .setCustomData(customDataToSend)
            .setEventSourceUrl(process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/analise` : null)
            .setActionSource('website');

        const eventsData = [serverEvent];
        const adAccount = new AdAccount('act_' + pixelId, bizSdk.FacebookAdsApi.getApi());
        
        await adAccount.createEvent(eventsData);

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
