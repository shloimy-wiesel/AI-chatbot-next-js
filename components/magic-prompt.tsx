'use client';

import { useState } from 'react';
import { LoaderCircle, SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MagicPromptProps {
  input: string;
  setInput: (input: string) => void;
  isComposingMagicPrompt: boolean;
  setIsComposingMagicPrompt: (isComposingMagicPrompt: boolean) => void;
}

export function MagicPrompt({ input, setInput }: MagicPromptProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setInput('This is a magic prompt!');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isLoading || input.length < 1}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'px-3 py-1.5', // Adjust padding as needed
          'bg-[hsl(151.3deg_66.9%_66.9%)] hover:bg-[hsl(156.5deg_86.5%_26.1%)]/90',
          'dark:bg-[hsl(154.9deg_100%_19.2%)] dark:hover:bg-[hsl(154.9deg_59.5%_70%)]/50',
          'text-foreground border border-[hsl(var(--brand-500)_/_0.75)]',
          'dark:border-[hsl(154.9deg_100%_19.2%)]/30 hover:border-[hsl(156.5deg_86.5%_26.1%)]',
          'dark:hover:border-[hsl(154.9deg_59.5%_70%)]',
          isLoading && [
            'pl-7',
            'bg-[hsl(156.5deg_86.5%_26.1%)]/90',
            'dark:bg-[hsl(154.9deg_59.5%_70%)]/50',
            'border-[hsl(156.5deg_86.5%_26.1%)] dark:border-[hsl(154.9deg_59.5%_70%)]',
          ],
        )}
        style={{ '--brand-500': '155.3deg 78.4% 40%' } as React.CSSProperties}
      >
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              'absolute left-2.5 transition-all duration-200 ease-in-out opacity-0 -translate-x-2',
              isLoading && 'opacity-100 translate-x-0',
            )}
          >
            <LoaderCircle
              className="animate-spin"
              size={12}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <span>
            <SparklesIcon />
          </span>
        </div>
      </Button>
    </>
  );
}
