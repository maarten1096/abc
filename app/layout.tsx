
import './globals.css';

export const metadata = {
  title: 'StudyWeb',
  description: 'Your AI-powered study partner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
