"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Loader2, Mail as MailIcon, RefreshCw, X, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MailMessage } from "@/lib/mail";
import { processEmailWithAI } from "@/lib/actions/ai";
import { EmailDetails } from "@/components/email-details";

export default function EmailPage() {
  const [emails, setEmails] = React.useState<MailMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = React.useState<MailMessage | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [transferring, setTransferring] = React.useState(false);
  const [aiAnalysis, setAiAnalysis] = React.useState<string | null>(null);

  const handleTransferToAI = async () => {
    if (!selectedEmail) return;
    setTransferring(true);
    setAiAnalysis(null);
    try {
      const result = await processEmailWithAI({
        subject: selectedEmail.subject,
        from: selectedEmail.from,
        text: selectedEmail.text,
        html: selectedEmail.html
      });
      setAiAnalysis(result);
      setIsDialogOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to transfer email to AI.");
    } finally {
      setTransferring(false);
    }
  };

  const handleEmailClick = (email: MailMessage) => {
    setSelectedEmail(email);
    setIsSheetOpen(true);
    setAiAnalysis(null);
    console.log("Email clicked:", email);
  };

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/mail/inbox");
      const data = await response.json();
      if (response.ok) {
        setEmails(data.emails || []);
      } else {
        setError(data.error || "Failed to fetch emails");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
       fetchEmails();
  }, []);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background">
      {/* Email List */}
      <div className="flex flex-1 flex-col border-r bg-muted/10">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <MailIcon className="h-5 w-5" /> Inbox
          </h1>
          <Button variant="ghost" size="icon-sm" onClick={fetchEmails} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {loading && emails.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-destructive">{error}</div>
          ) : emails.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No emails found.</div>
          ) : (
            <div className="divide-y max-w-4xl mx-auto">
              {emails.map((email) => (
                <div
                  key={email.uid}
                  className={cn(
                    "flex cursor-pointer flex-col gap-1 p-4 text-left transition-colors hover:bg-muted/50",
                    selectedEmail?.uid === email.uid && "bg-muted"
                  )}
                  onClick={() => handleEmailClick(email)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate max-w-[300px]">{email.from}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(email.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="font-semibold text-xs truncate">{email.subject}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-2">
                    {email.snippet}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <Drawer >
        <DrawerTrigger render={<Button variant="outline">Open</Button>} />
        <DrawerContent className="min-h-screen">
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
kdqslfùksdqkflkmsqd
            </div>
            <div className="grid gap-3">
dqksfmkùqksdflkqsdlmkfkqsdflkmlk
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      {/* Email Details Sheet*/}

        {selectedEmail && (
          <EmailDetails 
            email={selectedEmail}
            transferring={transferring}
            onTransfer={handleTransferToAI}
          />
        )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Processing Template
            </DialogTitle>
            <div className="text-xs/relaxed text-muted-foreground">
              AI analysis for: <span className="font-medium">{selectedEmail?.subject}</span>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-md border bg-muted/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <MailIcon className="h-3 w-3" />
                Original Content Summary
              </div>
              <div className="text-sm line-clamp-3 italic text-muted-foreground">
                {selectedEmail?.snippet}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3 w-3" />
                AI Analysis Result
              </div>
              <ScrollArea className="h-[250px] w-full rounded-md border p-4 bg-background">
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {aiAnalysis}
                </div>
              </ScrollArea>
            </div>

            <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
              <div className="text-[11px] font-medium text-primary">
                Next Steps Recommended:
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Verify the accuracy of the summary above before proceeding with any actions.
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
