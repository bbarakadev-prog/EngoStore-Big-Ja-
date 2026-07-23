import React from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface HeadersProps {
    title: string
    description?: string
    buttonText?: string
    onButtonClick?: () => void
    trigger?: React.ReactNode
}

function Headers({ title, description, buttonText, onButtonClick, trigger }: HeadersProps) {
    return (
        <div className="flex items-center justify-between gap-4 py-8">
            <div className="grid gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-muted-foreground text-sm">
                        {description}
                    </p>
                )}
            </div>
            {trigger ? trigger : (
                buttonText && (
                    <Button onClick={onButtonClick} className="gap-2">
                        <Plus className="size-4" />
                        {buttonText}
                    </Button>
                )
            )}
        </div>
    )
}

export default Headers
