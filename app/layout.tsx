import type { Metadata } from '@/node_modules/next'
import { barlow } from './ui/fonts'
import { AdvertisementsProvider } from '@/contexts/AdvertisementContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.scss'

library.add(fas, fab, far);

export const metadata: Metadata = {
  title: 'Assignment App',
  description: 'This app ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={barlow.className}>
        <AdvertisementsProvider>
          {children}
        </AdvertisementsProvider>
      </body>
    </html>
  )
}
