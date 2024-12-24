// src/app/layout.tsx
import { Inter } from "next/font/google";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Mobile header */}
          <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <HomeIcon className="h-5 w-5" />
              <span>novahospital.org</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span>Nitesh Pant</span>
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span>NP</span>
              </div>
            </div>
          </header>

          {/* Main content with padding for fixed header */}
          <main className="pt-16 pb-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}


// // src/app/layout.tsx
// import { headers } from 'next/headers';
// import { TRPCReactProvider } from './providers';

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <TRPCReactProvider headers={headers()}>
//           {children}
//         </TRPCReactProvider>
//       </body>
//     </html>
//   );
// }