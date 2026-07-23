"use client";

import React, { useState, useRef, useEffect } from "react";
import { Email } from "@/db/schema";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Mail, Bot, Send, Paperclip, ChevronLeft, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// Removed Card imports since we switched to Item component

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import {useChat} from "@ai-sdk/react";

// Mock data for Chats
const mockChats = [
  { id: "1", title: "Refactoring Auth", lastMessage: "Can you help with...", time: "10m ago" },
  { id: "2", title: "Landing Page Hero", lastMessage: "The layout looks...", time: "1h ago" },
  { id: "3", title: "Database Schema", lastMessage: "We should use...", time: "3h ago" },
];

export function ChatSidebar() {
  const [prompt, setPrompt] = useState("");
  const [emailsList, setEmailsList] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {sendMessage} = useChat()
  const selectedMail = emailsList.find(m => m.id === selectedMailId);

  const isEmpty = !loading && emailsList.length === 0;

  useEffect(() => {
    async function fetchEmails() {
      try {
        const response = await fetch("/api/mail/inbox");
        if (response.ok) {
          const data = await response.json();
          setEmailsList(data);
        }
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmails();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [prompt]);

  return (
    <Sidebar 
      side="right" 
      className="border-l w-96 mt-14" 
      collapsible="offcanvas"
      style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
    >
      <Tabs defaultValue="email" className="flex flex-col h-full">
        <SidebarHeader className="border-b p-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="gap-2 text-xs">
              <Mail className="h-3.5 w-3.5" />
              Email
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2 text-xs">
              <Bot className="h-3.5 w-3.5" />
              AI
            </TabsTrigger>
          </TabsList>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">
            <TabsContent value="ai" className="m-0 border-none flex flex-col h-[calc(100vh-112px)]">
              {/* Chat Menu */}
              <ScrollArea className="flex-1">
                <SidebarGroup>
                  <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent Chats
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {mockChats.map((chat) => (
                        <SidebarMenuItem key={chat.id}>
                          <SidebarMenuButton className="h-auto py-3 px-4 flex flex-col items-start gap-1">
                            <div className="flex w-full items-center justify-between">
                              <span className="text-sm font-medium truncate">{chat.title}</span>
                              <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                            </div>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {chat.lastMessage}
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </ScrollArea>
              <div className="p-4 border-t mt-auto">
                <div className="flex items-end gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 text-muted-foreground mb-0.5">
                    <Paperclip className="h-3.5 w-3.5" />
                  </Button>
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type a message..."
                    className="flex min-h-[32px] w-full rounded-md border border-input bg-input/20 px-3 py-1.5 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden"
                  />
                  <Button onClick={() => sendMessage({text:prompt})} size="icon" className="h-8 w-8 shrink-0 mb-0.5">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email" className="m-0 border-none flex flex-col h-[calc(100vh-112px)]">
              {loading ? (
                <div className="flex items-center justify-center h-20">
                  <span className="text-xs text-muted-foreground">Loading emails...</span>
                </div>
              ) : selectedMail ? (
                <div className="flex flex-col h-full">
                  <div className="p-3 border-b flex items-start gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 shrink-0 mt-[-2px]" 
                      onClick={() => setSelectedMailId(null)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-sm font-semibold flex-1 leading-tight py-1">{selectedMail.subject}</h2>
                    <Button 
                      variant="default" 
                      size="icon" 
                      className="h-8 w-8 shrink-0 mt-[-2px]"
                    >
                      <Bot className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-primary uppercase">{selectedMail.sender}</span>
                          <span className="text-[9px] text-muted-foreground">{selectedMail.time}</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedMail.message}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 p-8 text-center">
                  <Mail className="h-10 w-10 text-muted-foreground opacity-20" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">No messages found</p>
                    <p className="text-xs text-muted-foreground">Your inbox is empty. New messages will appear here.</p>
                  </div>
                </div>
              ) : (
                /* Mail Menu */
                <SidebarGroup>
                  <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Messages
                  </SidebarGroupLabel>
                  <SidebarGroupContent className="px-2">
                    <div className="flex flex-col gap-1">
                      {emailsList.map((mail) => (
                        <Item 
                          key={mail.id} 
                          className="cursor-pointer hover:bg-sidebar-accent transition-colors border p-1.5" 
                          size="xs"
                          onClick={() => setSelectedMailId(mail.id)}
                        >
                          <ItemHeader className="mb-0">
                            <span className="text-[10px] font-semibold text-primary uppercase">{mail.sender}</span>
                            <span className="text-[9px] text-muted-foreground">{mail.time}</span>
                          </ItemHeader>
                          <ItemContent className="gap-0">
                            <ItemTitle className="text-[11px] font-medium leading-none">
                              {mail.subject}
                            </ItemTitle>
                            <ItemDescription className="text-[10px] line-clamp-1 leading-none mt-0.5">
                              {mail.message}
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      ))}
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </TabsContent>
          </ScrollArea>
        </SidebarContent>
      </Tabs>
    </Sidebar>
  );
}
