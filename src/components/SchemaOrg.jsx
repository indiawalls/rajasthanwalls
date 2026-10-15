export default function SchemaOrg() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Rajasthan Wall Infratech Private Limited',
        image: `${siteUrl}/logo.png`,
        '@id': siteUrl,
        url: siteUrl,
        telephone: '+919950711475',
        priceRange: '₹₹',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Khasra No. 251, 252, Tehsil Tapukara, Daganheri',
            addressLocality: 'Alwar',
            addressRegion: 'Rajasthan',
            postalCode: '301707',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 28.077,
            longitude: 76.824,
        },
        areaServed: [
            'Kotkasim',
            'Tapukala',
            'Alwar',
            'Ringur',
            'Ramghar',
            'Faridabad',
            'Bahadurgarh',
            'Palwal',
            'Govindgarh',
            'Mundawar',
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
    );
}