import * as React from "react"
import { getComponents } from "@/lib/actions/components"
import { CatalogClient } from "@/components/catalog-client"

export default async function Page() {
  const result = await getComponents()
  const data = result.success ? result.data || [] : []

  return <CatalogClient initialData={data} />
}
