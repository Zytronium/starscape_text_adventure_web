import './globals.css'

export const metadata = {
  title: 'Starscape: Text Adventure',
  description: 'Embark on an epic adventure through the stars in this immersive text adventure game based on Roblox Starscape.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>{children}</body>
    </html>
  )
}