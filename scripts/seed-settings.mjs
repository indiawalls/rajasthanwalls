import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function main() {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('RajasthanWallsDB');

    const settings = [
        {
            key: 'contact_info',
            value: {
                phone: '+91 9950711475',
                whatsapp: '917820879777',
                email: 'info@rajasthanwall.com',
                plantAddress: 'Near Gyan Sagar, Alampur, Kotkasim, Rajasthan',
                headOffice: 'C7, Shri Hari Laxmi Tower, Bhagat Singh Circle, Alwar'
            },
            description: 'Primary business contacts and manufacturing locations'
        },
        {
            key: 'business_hours',
            value: {
                weekdays: '9:00 AM – 7:00 PM',
                sunday: 'Site Visits by Appointment'
            },
            description: 'Dispatch and customer service timings'
        }
    ];

    for (const s of settings) {
        await db.collection('sitesettings').updateOne(
            { key: s.key },
            { $set: { ...s, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
            { upsert: true }
        );
    }

    console.log('SEEDED SITE SETTINGS SUCCESSFULLY');
    await client.close();
}

main().catch(console.error);
