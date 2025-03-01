// app/layout.tsx
import "@/app/globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var savedTheme = localStorage.getItem('theme');
                var systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var initialTheme = savedTheme || (systemIsDark ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', initialTheme);
              })()
            `,
          }}
        />
      </head>
      <body className="bg-base-100 text-base-content" style={{fontSynthesis: 'none', textRendering: 'optimizeLegibility', WebkitFontSmoothing: 'antialiased'}}>
        {children}
      </body>
    </html>
  )
}