"use client";

import React from 'react';
import { useChat } from '@ai-sdk/react';
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ProjectSidebar } from "@/components/ai/sidebar";
import { ChatSidebar } from "@/components/ai/chat-sidebar";
import { PanelLeftIcon, PanelRightIcon } from "lucide-react";

function LeftSidebarTrigger() {
  const { open } = useSidebar();
  
  return (
    <div 
      className="fixed top-[70px] z-10 transition-all duration-200 ease-linear"
      style={{ 
        left: open ? "330px" : "10px"
      }}
    >
      <SidebarTrigger>
        <PanelLeftIcon className="h-4 w-4" />
      </SidebarTrigger>
    </div>
  );
}

function RightSidebarTrigger() {
  const { open } = useSidebar();
  
  return (
    <div 
      className="fixed top-[70px] z-10 transition-all duration-200 ease-linear"
      style={{ 
        right: open ? "394px" : "10px"
      }}
    >
      <SidebarTrigger>
        <PanelRightIcon className="h-4 w-4" />
      </SidebarTrigger>
    </div>
  );
}

export default function Page() {
  const { messages,sendMessage } = useChat();

  return (
    <div className="flex h-screen w-full">
      <SidebarProvider defaultOpen={true}>
        <ProjectSidebar />
        <LeftSidebarTrigger />
      </SidebarProvider>

      <SidebarInset className="flex-1">
        <div className="flex flex-col w-full h-full relative">
          <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            <div className="space-y-4">
              {messages.map(m => (
                <div key={m.id} className="whitespace-pre-wrap">
                  <div>
                    <span className="font-bold">{m.role === 'user' ? 'User: ' : 'AI: '}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </SidebarInset>

      <SidebarProvider defaultOpen={true}>
        <ChatSidebar />
        <RightSidebarTrigger />
      </SidebarProvider>
    </div>
  );
}
