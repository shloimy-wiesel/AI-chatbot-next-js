import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';
import { Onborda, OnbordaProvider } from "onborda";
import { steps } from '@/lib/steps';
import CustomCard from '@/components/custom-card';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.vercel.ai'),
  title: 'Next.js Chatbot Template',
  description: 'Next.js chatbot template using the AI SDK.',
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = 'hsl(65, 75.80%, 48.60%)';
const DARK_THEME_COLOR = 'hsl(0, 67.40%, 42.20%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const env = process.env.NEXT_PUBLIC_ENV || 'prod'; // Default to prod if not set

  const envStyles: Record<
    string,
    { border: string; bg: string; text: string }
  > = {
    dev: {
      border: 'border-t-4 border-blue-500',
      bg: 'bg-blue-300 bg-opacity-40',
      text: 'Environment: Development',
    },
    test: {
      border: 'border-t-4 border-green-500',
      bg: 'bg-green-300 bg-opacity-40',
      text: 'Environment: Test',
    },
    stage: {
      border: 'border-t-4 border-yellow-500',
      bg: 'bg-yellow-200 bg-opacity-60',
      text: 'Environment: Staging',
    },
    prod: { border: '', bg: '', text: '' }, // No banner for production
  };

  const { border, bg, text } = envStyles[env] || {};

  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>

      <body className={`antialiased overflow-hidden`}>
        {text && (
          <div className="max-w-sm absolute  bottom-2 right-2 z-50">
            <div
              className={` max-w-sm px-4 py-2 text-black text-sm font-semibold rounded-lg  ${bg}`}
            >
              {text}
            </div>
          </div>
        )}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <OnbordaProvider>
            <Onborda
              steps={steps}
              cardComponent={CustomCard}
              shadowOpacity="0.8"
            >

              {children}
            </Onborda>
          </OnbordaProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
