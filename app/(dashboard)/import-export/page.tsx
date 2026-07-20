import { CSVUploader } from "@/components/csv-uploader";

export default function ImportExportPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Import & Export</h1>
            <div className="max-w-2xl">
                <CSVUploader />
            </div>
        </div>
    );
}
