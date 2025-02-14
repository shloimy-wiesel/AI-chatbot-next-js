'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, VercelIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { type VisibilityType, VisibilitySelector } from './visibility-selector';
import { AnimatedShinyText } from './ui/animated-shiny-text';
import { ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Feedback } from '@/components/Feedback';

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();

  return (
    <>
      {/* Main Header */}
      <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
        <SidebarToggle />

        {(!open || windowWidth < 768) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
                onClick={() => {
                  router.push('/');
                  router.refresh();
                }}
              >
                <PlusIcon />
                <span className="md:sr-only">New Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>
        )}

        {!isReadonly && (
          <ModelSelector
            selectedModelId={selectedModelId}
            className="order-1 md:order-2"
          />
        )}

        {!isReadonly && (
          <VisibilitySelector
            chatId={chatId}
            selectedVisibilityType={selectedVisibilityType}
            className="order-1 md:order-3"
          />
        )}

        <Button
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-6 md:ml-auto"
          asChild
        >
          <Link
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET,OPENAI_API_KEY&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI%20Chatbot&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&stores=%5B%7B%22type%22:%22postgres%22%7D,%7B%22type%22:%22blob%22%7D%5D"
            target="_noblank"
          >
            <VercelIcon size={16} />
            Deploy with Vercel
          </Link>
        </Button>
        <div
          className={cn(
            ' mr-auto ml-auto group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800 order-4',
          )}
        >
          <AnimatedShinyText className="whitespace-nowrap truncate max-w-[700px] inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span className="truncate">
              ✨ Introducing Magic UI – A sleek, supercharge your workflow
            </span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
        <div className="order-5">
          <Feedback />
        </div>
        {/* </div> */}
      </header>
    </>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
