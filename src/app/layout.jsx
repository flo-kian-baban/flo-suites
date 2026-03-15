import './globals.css';
import MobileBlocker from '@/components/MobileBlocker';

export const metadata = {
    title: 'Flo Suites',
    description: 'Integrated Business Operating Systems',
    icons: {
        icon: '/assets/Fav.png',
        apple: '/assets/Webclip.png',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-[#111111] overflow-hidden" suppressHydrationWarning>
                <MobileBlocker>{children}</MobileBlocker>
            </body>
        </html>
    );
}
