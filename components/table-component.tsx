"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Component } from "@/db/schema"
import { ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComponentTableProps {
  data: Component[]
}

type SortConfig = {
  key: keyof Component | null
  direction: "asc" | "desc" | null
}

export function ComponentTable({ data }: ComponentTableProps) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: null,
    direction: null,
  })

  const sortedData = React.useMemo(() => {
    if (!data) return []
    const sortableItems = [...data]
    if (sortConfig.key !== null && sortConfig.direction !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!]
        const bValue = b[sortConfig.key!]

        if (aValue === null) return 1
        if (bValue === null) return -1

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [data, sortConfig])

  const requestSort = (key: keyof Component) => {
    let direction: "asc" | "desc" | null = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null
    }
    setSortConfig({ key: direction ? key : null, direction })
  }

  const SortIcon = ({ column }: { column: keyof Component }) => {
    if (sortConfig.key !== column) return <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
    if (sortConfig.direction === "asc") return <ChevronUp className="ml-2 h-4 w-4" />
    if (sortConfig.direction === "desc") return <ChevronDown className="ml-2 h-4 w-4" />
    return <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
  }

  const getCategoryVariant = (category: string | null) => {
    if (!category) return "outline"
    const cat = category.toUpperCase()
    if (cat === "ELECTRICAL") return "outline" // Custom styling might be needed for the orange look
    if (cat === "EQUIPMENT") return "outline"
    if (cat === "PROCESS") return "outline"
    return "outline"
  }

  const getCategoryClass = (category: string | null) => {
    if (!category) return ""
    const cat = category.toUpperCase()
    if (cat === "ELECTRICAL") return "border-orange-500/50 text-orange-500 bg-orange-500/10 uppercase"
    if (cat === "EQUIPMENT") return "border-blue-500/50 text-blue-500 bg-blue-500/10 uppercase"
    if (cat === "PROCESS") return "border-purple-500/50 text-purple-500 bg-purple-500/10 uppercase"
    if (cat === "MECHANICAL") return "border-green-500/50 text-green-500 bg-green-500/10 uppercase"
    return "uppercase"
  }

  const getAvailabilityBadge = (availability: string | null) => {
    if (!availability) return null
    const isStock = availability.toLowerCase().includes("stock")
    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[0.625rem] font-medium w-fit",
        isStock 
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500" 
          : "border-rose-500/20 bg-rose-500/10 text-rose-500"
      )}>
        <span className={cn("h-1.5 w-1.5 rounded-full", isStock ? "bg-emerald-500" : "bg-rose-500")} />
        {availability}
      </div>
    )
  }

  return (
      <Table className="max-w-[40vw] ml-auto border shadow-sm rounded">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-muted-foreground/20">
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors uppercase text-[0.7rem] font-bold"
              onClick={() => requestSort("partNumber")}
            >
              <div className="flex items-center">
                Part # <SortIcon column="partNumber" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors uppercase text-[0.7rem] font-bold"
              onClick={() => requestSort("name")}
            >
              <div className="flex items-center">
                Name / Description <SortIcon column="name" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors uppercase text-[0.7rem] font-bold"
              onClick={() => requestSort("category")}
            >
              <div className="flex items-center">
                Category <SortIcon column="category" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors uppercase text-[0.7rem] font-bold"
              onClick={() => requestSort("manufacturer")}
            >
              <div className="flex items-center">
                Manufacturer <SortIcon column="manufacturer" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors uppercase text-[0.7rem] font-bold"
              onClick={() => requestSort("type")}
            >
              <div className="flex items-center">
                Type <SortIcon column="type" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors uppercase text-[0.7rem] font-bold"
              onClick={() => requestSort("distributor")}
            >
              <div className="flex items-center">
                Distributor <SortIcon column="distributor" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors uppercase text-[0.7rem] font-bold"
              onClick={() => requestSort("availability")}
            >
              <div className="flex items-center">
                Availability <SortIcon column="availability" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors uppercase text-[0.7rem] font-bold text-right"
              onClick={() => requestSort("unitPrice")}
            >
              <div className="flex items-center justify-end">
                Unit Price <SortIcon column="unitPrice" />
              </div>
            </TableHead>
            <TableHead className="uppercase text-[0.7rem] font-bold text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.id} className="border-b-muted-foreground/10 hover:bg-muted/30">
              <TableCell className="font-mono text-[0.7rem] text-muted-foreground">
                {item.partNumber}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{item.name}</span>
                  <span className="text-[0.7rem] text-muted-foreground line-clamp-1">
                    {item.description}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn("rounded-sm px-2 py-0 text-[0.65rem] font-bold h-6", getCategoryClass(item.category))}
                >
                  {item.category}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">{item.manufacturer}</TableCell>
              <TableCell className="text-muted-foreground text-xs">{item.type}</TableCell>
              <TableCell className="text-muted-foreground text-xs">{item.distributor}</TableCell>
              <TableCell>
                {getAvailabilityBadge(item.availability)}
              </TableCell>
              <TableCell className="text-right font-bold">
                {item.unitPrice ? (
                  <div className="flex items-center justify-end gap-1">
                    <span>{item.unitPrice}</span>
                    <span className="text-[0.6rem] text-muted-foreground font-normal">/EA</span>
                  </div>
                ) : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  )
}
