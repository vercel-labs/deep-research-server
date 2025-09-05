export const metadata = {
  title: 'ChatGPT Deep Research',
  description: 'ChatGPT-compatible MCP server for deep research',
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
