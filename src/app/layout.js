import './globals.css';
import ChatbotWidget from '@/components/ChatbotWidget';
import { Roboto, Montserrat } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Rajasthanwall | Precast Boundary Wall & RCC Wall Manufacturer',
    template: '%s | Rajasthanwall Infratech',
  },
  description:
    'Manufacturer of high-strength precast boundary walls, RCC compound walls, and interlocking paver blocks serving Alwar, Bhiwadi, Gurugram, and Delhi NCR.',
  keywords: [
    'Precast boundary wall manufacturer',
    'RCC compound wall',
    'Readymade boundary wall Alwar',
    'Precast walls Bhiwadi',
    'Interlocking paver blocks NCR',
  ],
  authors: [{ name: 'Rajasthan Wall Infratech Private Limited' }],
  creator: 'Rajasthan Wall Infratech',
  publisher: 'Rajasthan Wall Infratech',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Rajasthanwall | Precast Boundary Wall Manufacturer',
    description: 'Custom precast concrete walls for land security & construction projects across Delhi NCR & Rajasthan.',
    url: siteUrl,
    siteName: 'Rajasthanwall Infratech',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Inline script to strip browser-extension-injected attributes before React hydration
const stripExtensionAttrs = `
(function(){
  var d=document.querySelectorAll('*');
  for(var i=0;i<d.length;i++){
    d[i].removeAttribute('bis_skin_checked');
    d[i].removeAttribute('bis_register');
    var a=d[i].attributes;
    for(var j=a.length-1;j>=0;j--){
      if(a[j].name.startsWith('__processed_'))d[i].removeAttribute(a[j].name);
    }
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: stripExtensionAttrs }} />
      </head>
      <body className={'antialiased'} suppressHydrationWarning>
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}