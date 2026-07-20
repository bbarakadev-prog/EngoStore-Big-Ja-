"use client"

import * as React from "react"
import {
  Box,
  Layers,
  Zap,
  Settings,
  Truck,
  Database,
  Factory,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Component } from "@/db/schema"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"

export type FilterType = 'all' | 'category' | 'manufacturer' | 'distributor';

export interface FilterValue {
  type: FilterType;
  value?: string;
}

interface CatalogSidebarProps {
  activeFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  data: Component[];
}

export function CatalogSidebar({ activeFilter, onFilterChange, data }: CatalogSidebarProps) {
  const isFilterActive = (type: FilterType, value?: string) => {
    return activeFilter.type === type && activeFilter.value === value;
  }

  const counts = React.useMemo(() => {
    const c = {
      all: data?.length || 0,
      categories: {} as Record<string, number>,
      manufacturers: {} as Record<string, number>,
      distributors: {} as Record<string, number>,
    };

    data?.forEach(item => {
      if (item.category) {
        const cat = item.category.toUpperCase();
        c.categories[cat] = (c.categories[cat] || 0) + 1;
      }
      if (item.manufacturer) {
        c.manufacturers[item.manufacturer] = (c.manufacturers[item.manufacturer] || 0) + 1;
      }
      if (item.distributor) {
        c.distributors[item.distributor] = (c.distributors[item.distributor] || 0) + 1;
      }
    });

    return c;
  }, [data]);

  return (
    <Sidebar  variant="floating" className="h-full bg-card border border-r-2 bg-background">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground/70 uppercase h-auto py-1.5">Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isFilterActive('all')} 
                  onClick={() => onFilterChange({ type: 'all' })}
                  className={cn(
                    "px-3 h-7 text-[12px] hover:bg-muted/50 transition-none",
                    isFilterActive('all') ? "bg-muted/50 text-foreground font-semibold" : "text-muted-foreground"
                  )}
                >
                  <Box className="size-3 text-muted-foreground" />
                  <span>All Components</span>
                  <span className="ml-0.5 text-[9px] opacity-70 align-top relative -top-0.5">{counts.all}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-0">
          <SidebarGroupLabel className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground/70 uppercase h-auto py-1.5">By Category</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isFilterActive('category', 'EQUIPMENT')}
                  onClick={() => onFilterChange({ type: 'category', value: 'EQUIPMENT' })}
                  className={cn(
                    "px-3 h-7 text-[12px] hover:bg-muted/50 transition-none",
                    isFilterActive('category', 'EQUIPMENT') ? "bg-muted/50 text-foreground font-semibold" : "text-muted-foreground"
                  )}
                >
                  <Box className="size-3 text-muted-foreground" />
                  <span>Equipment</span>
                  <span className="ml-0.5 text-[9px] opacity-70 align-top relative -top-0.5">{counts.categories['EQUIPMENT'] || 0}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isFilterActive('category', 'PROCESS')}
                  onClick={() => onFilterChange({ type: 'category', value: 'PROCESS' })}
                  className={cn(
                    "px-3 h-7 text-[12px] hover:bg-muted/50 transition-none",
                    isFilterActive('category', 'PROCESS') ? "bg-muted/50 text-foreground font-semibold" : "text-muted-foreground"
                  )}
                >
                  <Layers className="size-3 text-muted-foreground" />
                  <span>Process</span>
                  <span className="ml-0.5 text-[9px] opacity-70 align-top relative -top-0.5">{counts.categories['PROCESS'] || 0}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem className="bg-[#111827] rounded-md overflow-hidden mt-1">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      isActive={isFilterActive('category', 'ELECTRICAL')}
                      onClick={() => onFilterChange({ type: 'category', value: 'ELECTRICAL' })}
                      className={cn(
                        "px-3 h-7 text-[12px] hover:bg-muted/50 transition-none cursor-pointer",
                        isFilterActive('category', 'ELECTRICAL') ? "text-foreground font-semibold bg-muted/50" : "text-muted-foreground"
                      )}
                    >
                      <Zap className="size-3 text-muted-foreground" />
                      <span className="font-mono">Electrical</span>
                      <span className="text-[9px] opacity-70 relative -top-0.5 -ml-1">{counts.categories['ELECTRICAL'] || 0}</span>
                      <ChevronRight className="ml-auto size-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {[
                        { label: "ABB" },
                        { label: "Eaton" },
                        { label: "Schneider Electric" },
                        { label: "Siemens" },
                      ].map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuSubButton 
                            isActive={isFilterActive('manufacturer', item.label)}
                            onClick={() => onFilterChange({ type: 'manufacturer', value: item.label })}
                            className={cn(
                              "pl-8 py-0.5 h-6 text-[12px] transition-none cursor-pointer",
                              isFilterActive('manufacturer', item.label) ? "text-foreground font-semibold bg-muted/50" : "text-muted-foreground hover:bg-muted/50"
                            )}
                          >
                            <span>{item.label}</span>
                            <span className="ml-0.5 text-[9px] opacity-70 align-top relative -top-0.5">{counts.manufacturers[item.label] || 0}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem className="bg-[#111827] rounded-md overflow-hidden mt-1">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      isActive={isFilterActive('category', 'MECHANICAL')}
                      onClick={() => onFilterChange({ type: 'category', value: 'MECHANICAL' })}
                      className={cn(
                        "px-3 h-7 text-[12px] hover:bg-muted/50 transition-none cursor-pointer",
                        isFilterActive('category', 'MECHANICAL') ? "text-foreground font-semibold bg-muted/50" : "text-muted-foreground"
                      )}
                    >
                      <Settings className="size-3 text-muted-foreground" />
                      <span className="font-mono">Mechanical</span>
                      <span className="text-[9px] opacity-70 relative -top-0.5 -ml-1 font-bold text-foreground">{counts.categories['MECHANICAL'] || 0}</span>
                      <ChevronRight className="ml-auto size-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {[
                        { label: "Gates" },
                        { label: "Parker" },
                        { label: "SKF" },
                        { label: "Timken" },
                      ].map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuSubButton
                            isActive={isFilterActive('manufacturer', item.label)}
                            onClick={() => onFilterChange({ type: 'manufacturer', value: item.label })}
                            className={cn(
                              "pl-8 py-0.5 h-6 text-[12px] transition-none cursor-pointer",
                              isFilterActive('manufacturer', item.label) ? "text-foreground font-semibold bg-muted/50" : "text-muted-foreground hover:bg-muted/50"
                            )}
                          >
                            <span>{item.label}</span>
                            <span className="ml-0.5 text-[9px] opacity-70 align-top relative -top-0.5">{counts.manufacturers[item.label] || 0}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-2">
          <SidebarGroupLabel className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground/70 uppercase h-auto py-1.5">By Distributor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {[
                { icon: Database, label: "Allied Electronics" },
                { icon: Factory, label: "Ferguson Process" },
                { icon: Truck, label: "Grainger Industrial" },
                { icon: Truck, label: "Motion Industries" },
              ].map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    isActive={isFilterActive('distributor', item.label)}
                    onClick={() => onFilterChange({ type: 'distributor', value: item.label })}
                    className={cn(
                      "px-3 h-7 text-[12px] hover:bg-muted/50 transition-none",
                      isFilterActive('distributor', item.label) ? "bg-muted/50 text-foreground font-semibold" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="size-3" />
                    <span>{item.label}</span>
                    <span className="ml-0.5 text-[9px] opacity-70 align-top relative -top-0.5">{counts.distributors[item.label] || 0}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
