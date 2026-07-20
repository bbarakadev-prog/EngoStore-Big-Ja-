"use client";

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Inbox } from "lucide-react";
import type { MailMessage } from "@/lib/mail";

interface EmailDetailsProps {
  email: MailMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transferring: boolean;
  onTransfer: () => void;
}

export function EmailDetails({ email, open, onOpenChange, transferring, onTransfer }: EmailDetailsProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {email ? (
        <DrawerContent className="sm:max-w-2xl w-full p-0 flex flex-col">
          <DrawerHeader className="px-6 py-4 border-b flex-none">
            <DrawerTitle className="text-xl font-bold leading-tight flex items-center justify-between gap-4">
              <span className="truncate">{email.subject}</span>
              <Button 
                size="sm" 
                className="flex-none gap-2" 
                onClick={onTransfer}
                disabled={transferring}
              >
                {transferring ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Transfer to AI
              </Button>
            </DrawerTitle>
            <div className="flex flex-col gap-1 mt-2 text-xs/relaxed text-muted-foreground">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">{email.from}</span>
                <span className="text-muted-foreground">&lt;{email.to}&gt;</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                {new Date(email.date).toLocaleString()}
              </div>
            </div>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {email.html ? (
                <div dangerouslySetInnerHTML={{ __html: email.html }} />
              ) : (
                <div className="whitespace-pre-wrap font-sans text-sm text-foreground">
                  {email.text || "No content available for this email."}
                </div>
              )}
            </div>
          </ScrollArea>
        </DrawerContent>
      ) : (
        <DrawerContent  className="sm:max-w-2xl w-full p-0 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Inbox className="h-8 w-8 opacity-20" />
            <p>Select an email to view details</p>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
}
