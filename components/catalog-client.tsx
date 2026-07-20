"use client"

import * as React from "react"
import { ComponentTable } from "@/components/table-component"
import { CatalogSidebar, type FilterValue } from "@/components/catalog-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import type { Component } from "@/db/schema"

interface CatalogClientProps {
  initialData: Component[]
}

export function CatalogClient({ initialData }: CatalogClientProps) {
  const [filter, setFilter] = React.useState<FilterValue>({ type: 'all' });

  const filteredData = React.useMemo(() => {
    if (!initialData) return [];
    if (filter.type === 'all') return initialData;
    
    return initialData.filter(item => {
      if (filter.type === 'category') {
        return item.category?.toUpperCase() === filter.value?.toUpperCase();
      }
      if (filter.type === 'manufacturer') {
        return item.manufacturer?.toUpperCase() === filter.value?.toUpperCase();
      }
      if (filter.type === 'distributor') {
        return item.distributor?.toUpperCase() === filter.value?.toUpperCase();
      }
      return true;
    });
  }, [filter, initialData]);

  return (
    <div className=" h-[calc(100vh-3.5rem)] w-full">
      <SidebarProvider>
        <CatalogSidebar activeFilter={filter} onFilterChange={setFilter} data={initialData} />
        <SidebarTrigger className="ml-1" />
      </SidebarProvider>
      <main className="">
        <ComponentTable data={filteredData} />
      </main>
    </div>
  )
}
