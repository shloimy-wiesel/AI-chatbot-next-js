// 'use client';

// import { useState } from 'react';
// import { Copy, Check } from 'lucide-react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

// interface CodeBlockProps {
//   node: any;
//   inline: boolean;
//   className?: string;
//   children: any;
// }

// export function CodeBlock({
//   inline,
//   className,
//   children,
//   ...props
// }: CodeBlockProps) {
//   const [copied, setCopied] = useState(false);
//   const match = /language-(\w+)/.exec(className || '');
//   const language = match ? match[1] : 'plaintext';
//   const codeContent = String(children).trim();

//   // Handle Copy
//   const handleCopy = () => {
//     navigator.clipboard.writeText(codeContent);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };

//   if (!inline) {
//     return (
//       <div className="relative w-full not-prose">
//         {/* Copy Button */}
//         <button
//           onClick={handleCopy}
//           className="absolute top-2 right-2 bg-zinc-800 text-white p-1 rounded hover:bg-zinc-700 transition"
//         >
//           {copied ? <Check size={16} /> : <Copy size={16} />}
//         </button>

//         {/* Syntax Highlighter */}
//         <SyntaxHighlighter
//           language={language}
//           style={darcula}
//           // style={vscDarkPlus}
//           // style={atomDark}
//           PreTag="div"
//           className="text-sm w-full rounded-xl border border-zinc-700 overflow-x-auto"
//           {...props}
//         >
//           {codeContent}
//         </SyntaxHighlighter>
//       </div>
//     );
//   } else {
//     return (
//       <code
//         className="bg-zinc-200 dark:bg-zinc-800 text-sm px-1 py-0.5 rounded"
//         {...props}
//       >
//         {children}
//       </code>
//     );
//   }
// }
