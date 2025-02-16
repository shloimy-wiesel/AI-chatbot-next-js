'use client';

import { useState } from 'react';
import type { Message } from 'ai';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { CheckCircleFillIcon } from './icons';
import { generateAndDownload } from '@/lib/files/download-chat';

export function DownloadChat({
  messages,
  isLoading,
}: {
  messages: Array<Message>;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        )}
      >
        <Button
          variant="outline"
          className="md:px-2 md:h-[34px]"
          disabled={isLoading || messages.length === 0}
        >
          Download Chat
          {/* <ChevronDownIcon /> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-[50px]">
        {fileTypes.map((fileType) => {
          const { id } = fileType;

          return (
            <DropdownMenuItem
              key={id}
              onSelect={async () => {
                setOpen(false);
                await generateAndDownload(messages, fileType.name);
              }}
              className="gap-4 group/item flex flex-row justify-between items-center"
            >
              <div className="flex flex-col gap-1 items-start">
                <div>{fileType.name}</div>
                {/* <div className="teFxt-xs text-muted-foreground">
                  {fileType.description}
                </div> */}
              </div>

              <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                <CheckCircleFillIcon />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface fileTypes {
  id: string;
  name: string;
  description: string;
}

export const fileTypes: Array<fileTypes> = [
  {
    id: 'chat-model-small',
    name: 'pdf',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-large',
    name: 'docx',
    description: 'Large model for complex, multi-step tasks',
  },
];
