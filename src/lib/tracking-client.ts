'use client';

import { v4 as uuidv4 } from 'uuid';

import { sendServerEvent } from '@/app/meta-actions';
import { sendGAEvent } from './analytics';

// Helper to get cookies
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

// Helper to get UTMs
function getUtms() {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
        utm_content: params.get('utm_content'),
        utm_term: params.get('utm_term'),
    };
}

export async function trackEvent(eventName: string, params: Record<string, any> = {}) {
    const eventId = uuidv4();
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const utms = getUtms();

    // Merge params with UTMs
    const eventData = {
        ...params,
        ...utms,
        event_id: eventId,
        fbp,
        fbc,
    };

    // 1. Client-side (GA)
    sendGAEvent(eventName, eventData);



    // 2. Server-side (CAPI)
    // We need to separate UserData from CustomData
    const userData = {
        client_ip_address: null, // Will be inferred by server if not provided
        client_user_agent: navigator.userAgent,
        fbc,
        fbp,
        email: params.email || null,
        phone: params.phone || null,
    };

    // Extract standard fields that shouldn't be in custom_properties if they are handled explicitly
    // But for now, we put everything else in custom_properties
    const { email, phone, value, currency, content_name, content_ids, content_type, ...customProperties } = eventData as any;

    const customDataCAPI = {
        value: value,
        currency: currency,
        content_name: content_name,
        content_ids: content_ids,
        content_type: content_type,
        custom_properties: customProperties
    };

    // Send to server
    // We don't await this to avoid blocking UI, unless necessary
    sendServerEvent(eventName, eventId, userData, customDataCAPI).catch(err => {
        console.error(`Failed to send CAPI event ${eventName}:`, err);
    });
}
