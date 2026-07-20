"use client"
import { redirect } from "next/navigation";

import { CSVUploader } from "@/components/csv-uploader";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">EnGO STORE</h1>
          <p className="text-muted-foreground">Engineering Component Management System</p>
        </div>

        <CSVUploader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add more dashboard cards here if needed */}
        </div>
      </div>
    </div>
  );
}
