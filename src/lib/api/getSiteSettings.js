import dbConnect from '@/lib/dbConnect';
import SiteSetting from '@/models/SiteSetting.mjs';

export const fallbackContactInfo = {
    phone: '+91 9950711475',
    whatsapp: '917820879777',
    email: 'info@rajasthanwall.com',
    plantAddress: 'Near Gyan Sagar, Alampur, Kotkasim, Rajasthan',
    headOffice: 'C7, Shri Hari Laxmi Tower, Bhagat Singh Circle, Alwar',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d905431.5347039085!2d75.98906689793341!3d27.567415731693576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d4d5b6dd506d5%3A0xa2d556086c32334c!2sVR%20ENTERPRISES!5e0!3m2!1sen!2sin!4v1789200071199!5m2!1sen!2sin',
};

export const defaultManufacturingUnits = [
    { city: 'Kotkasim Unit', region: 'Rajasthan', address: 'Kotkasim industrial area', lat: 27.70, lng: 76.63, mapsUrl: 'https://maps.google.com/?q=Kotkasim,Rajasthan' },
    { city: 'Tapukara Unit', region: 'Rajasthan', address: 'Tapukara industrial area', lat: 28.1069973, lng: 76.8005187, mapsUrl: 'https://maps.google.com/?q=Tapukara,Rajasthan' },
    { city: 'Alwar Unit', region: 'Rajasthan', address: 'Alwar industrial area', lat: 27.553, lng: 76.634, mapsUrl: 'https://maps.google.com/?q=Alwar,Rajasthan' },
    { city: 'Ringus Unit', region: 'Rajasthan', address: 'Ringus industrial area', lat: 27.37, lng: 75.57, mapsUrl: 'https://maps.google.com/?q=Ringus,Rajasthan' },
    { city: 'Ramgarh Unit', region: 'Rajasthan', address: 'Ramgarh industrial area', lat: 27.57, lng: 76.87, mapsUrl: 'https://maps.google.com/?q=Ramgarh,Rajasthan' },
    { city: 'Govindgarh Unit', region: 'Rajasthan', address: 'Govindgarh industrial area', lat: 27.22, lng: 75.83, mapsUrl: 'https://maps.google.com/?q=Govindgarh,Rajasthan' },
    { city: 'Mundawar Unit', region: 'Rajasthan', address: 'Mundawar industrial area', lat: 27.97, lng: 76.45, mapsUrl: 'https://maps.google.com/?q=Mundawar,Rajasthan' },
    { city: 'Faridabad Unit', region: 'Haryana / NCR Zone', address: 'Faridabad industrial area', lat: 28.409, lng: 77.318, mapsUrl: 'https://maps.google.com/?q=Faridabad,Haryana' },
    { city: 'Bahadurgarh Unit', region: 'Haryana / NCR Zone', address: 'Bahadurgarh industrial area', lat: 28.693, lng: 76.935, mapsUrl: 'https://maps.google.com/?q=Bahadurgarh,Haryana' },
    { city: 'Palwal Unit', region: 'Haryana / NCR Zone', address: 'Palwal industrial area', lat: 28.149, lng: 77.332, mapsUrl: 'https://maps.google.com/?q=Palwal,Haryana' },
];

export async function getSiteSettings(key = 'contact_info') {
    try {
        await dbConnect();
        const doc = await SiteSetting.findOne({ key }).lean();
        if (doc && doc.value) {
            return doc.value;
        }
    } catch (e) {
        console.error(`Failed to get site setting ${key}:`, e.message);
    }
    return key === 'contact_info' ? fallbackContactInfo : null;
}

export async function getManufacturingUnits() {
    try {
        await dbConnect();
        const doc = await SiteSetting.findOne({ key: 'manufacturing_units' }).lean();
        if (doc && Array.isArray(doc.value) && doc.value.length > 0) {
            return doc.value;
        }
    } catch (e) {
        console.error('Failed to get manufacturing units:', e.message);
    }
    return defaultManufacturingUnits;
}


