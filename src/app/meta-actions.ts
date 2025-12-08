'use server';

import { bizSdk, AdAccount, UserData, ServerEvent } from 'facebook-nodejs-business-sdk';

const accessToken = process.env.META_ACCESS_TOKEN;
const pixelId = process.env.META_PIXEL_ID;

if (!accessToken || !pixelId) {
    console.warn("Meta Pixel ID or Access Token is not set in environment variables. Server-side events will not be sent.");
} else {
    bizSdk.FacebookAdsApi.init(accessToken);
}

export async function sendServerEvent(eventName: string, eventId: string, user_data: {
    client_ip_address: string | null;
    client_user_agent: string | null;
    fbc: string | null;
    fbp: string | null;
    email: string | null;
    phone: string | null;
}) {
    if (!accessToken || !pixelId) {
        return; // Don't proceed if credentials aren't set
    }

    try {
        const userData = new UserData()
            .setClientIpAddress(user_data.client_ip_address)
            .setClientUserAgent(user_data.client_user_agent)
            .setFbc(user_data.fbc)
            .setFbp(user_data.fbp)
            .setEmails(user_data.email ? [user_data.email] : null)
            .setPhones(user_data.phone ? [user_data.phone] : null);

        const event = new ServerEvent()
            .setEventName(eventName)
            .setEventTime(Math.floor(Date.now() / 1000))
            .setEventId(eventId)
            .setUserData(userData)
            .setEventSourceUrl(process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/analise` : null)
            .setActionSource('website');

        const eventsData = [event];
        const api = bizSdk.FacebookAdsApi.getApi(accessToken, pixelId);
        
        await api.sendEvents(eventsData);

        console.log(`CAPI Event '${eventName}' sent successfully with event ID: ${eventId}`);
        return { success: true, eventId };

    } catch (error: any) {
        console.error('Error sending CAPI event:', error.message || error);
        return { success: false, error: error.message };
    }
}
