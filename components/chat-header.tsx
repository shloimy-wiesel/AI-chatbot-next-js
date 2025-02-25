'use client';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/components/model-selector';
import { DownloadChat } from '@/components/download-chat';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { type VisibilityType, VisibilitySelector } from './visibility-selector';
import { AnimatedShinyText } from './ui/animated-shiny-text';
import { ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Feedback } from '@/components/Feedback';
import type { Message } from 'ai';

function PureChatHeader({
  chatId,
  messages,
  isLoading,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  messages: Array<Message>;
  isLoading: boolean;
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
                      <div id={"#onborda-step3"}>

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
          </div>
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
        {messages.length > 0 && (
          <div className="order-6">
            <DownloadChat messages={messages} isLoading={isLoading} />
          </div>
        )}
        <div
         id={"#onborda-step2"}
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
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (prevProps.isLoading !== nextProps.isLoading) return false;

  return true;
});
