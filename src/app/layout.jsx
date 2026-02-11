import './globals.css';

export const metadata = {
    title: 'Flo Suites',
    description: 'Integrated Business Operating Systems',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-[#111111] overflow-hidden" suppressHydrationWarning>{children}</body>
        </html>
    );
}
