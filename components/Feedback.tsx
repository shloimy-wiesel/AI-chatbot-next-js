import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

function Feedback() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Feedback</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send us feedback</DialogTitle>
          <DialogDescription>
            Watch{' '}
            <a
              className="text-foreground hover:underline"
              href="https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol#text-stream-protocol"
            >
              tutorials
            </a>
            , read Origin UI&lsquo;s{' '}
            <a
              className="text-foreground hover:underline"
              href="https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol#text-stream-protocol"
            >
              documentation
            </a>
            , or join our{' '}
            <a
              className="text-foreground hover:underline"
              href="https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol#text-stream-protocols"
            >
              Discord
            </a>{' '}
            for community help.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5">
          <Textarea
            id="feedback"
            placeholder="How can we improve Origin UI?"
            aria-label="Send feedback"
          />
          <div className="flex flex-col sm:flex-row sm:justify-end">
            <Button type="button">Send feedback</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { Feedback };
