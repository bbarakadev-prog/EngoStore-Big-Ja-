"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import { Input } from "@/components/ui/input";
import { bulkInsertComponents } from "@/lib/actions/components";
import { Loader2, Upload } from "lucide-react";

export function CSVUploader() {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<{ message: string; type: "info" | "success" | "error" } | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setStatus({ message: "Parsing CSV...", type: "info" });

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const data = results.data as any[];
                
                // Map columns
                const mappedData = data.map((row) => ({
                    partNumber: row["PART #"] || row["part #"] || row["Part #"] || "",
                    name: row["NAME"] || row["name"] || row["Name"] || "",
                    description: row["DESCRIPTION"] || row["description"] || row["Description"] || "",
                    category: row["CATEGORY"] || row["category"] || row["Category"] || "",
                    manufacturer: row["MANUFACTURER"] || row["manufacturer"] || row["Manufacturer"] || "",
                    type: row["TYPE"] || row["type"] || row["Type"] || "",
                    distributor: row["DISTRIBUTOR"] || row["distributor"] || row["Distributor"] || "",
                    availability: row["AVAILABILITY"] || row["availability"] || row["Availability"] || "",
                    unitPrice: row["UNIT PRICE"] || row["unit price"] || row["Unit Price"] || "",
                })).filter(item => item.partNumber || item.name);

                if (mappedData.length === 0) {
                    setStatus({ message: "No valid data found in CSV. Please ensure columns match the required format.", type: "error" });
                    setIsUploading(false);
                    return;
                }

                setStatus({ message: `Uploading ${mappedData.length} components...`, type: "info" });
                
                try {
                    const result = await bulkInsertComponents(mappedData);

                    if (result.success) {
                        setStatus({ message: `Successfully uploaded ${result.count} components.`, type: "success" });
                        // Clear input
                        if (e.target) e.target.value = "";
                    } else {
                        setStatus({ message: `Error: ${result.error}`, type: "error" });
                    }
                } catch (err) {
                    setStatus({ message: "An unexpected error occurred during upload.", type: "error" });
                } finally {
                    setIsUploading(false);
                }
            },
            error: (error) => {
                setStatus({ message: `Error parsing CSV: ${error.message}`, type: "error" });
                setIsUploading(false);
            }
        });
    };

    return (
        <div className="flex flex-col gap-4 p-6 border rounded-xl bg-card shadow-sm">
            <div className="flex items-center gap-2">
                <Upload className="size-5 text-primary" />
                <h2 className="text-lg font-semibold">CSV Component Importer</h2>
            </div>
            
            <p className="text-sm text-muted-foreground">
                Upload a CSV file with the following columns: <br/>
                <code className="text-[10px] bg-muted px-1 py-0.5 rounded">PART #, NAME, DESCRIPTION, CATEGORY, MANUFACTURER, TYPE, DISTRIBUTOR, AVAILABILITY, UNIT PRICE</code>
            </p>

            <div className="grid w-full items-center gap-1.5">
                <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                />
            </div>

            {isUploading && (
                <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                    <Loader2 className="size-4 animate-spin" />
                    <span>{status?.message}</span>
                </div>
            )}

            {!isUploading && status && (
                <div className={`p-3 rounded-md text-sm ${
                    status.type === "success" ? "bg-green-500/10 text-green-600 border border-green-500/20" : 
                    status.type === "error" ? "bg-destructive/10 text-destructive border border-destructive/20" : 
                    "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                }`}>
                    {status.message}
                </div>
            )}
        </div>
    );
}
