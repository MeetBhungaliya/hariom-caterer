import * as React from "react";
import Dropzone from "react-dropzone";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Delete, Trash, Trash2, Upload } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";

function ControlledImageuploader({ field }) {

    const value = field.state.value

    const image = value
        ? value instanceof File ? URL.createObjectURL(value) : value
        : null

    const onUpload = React.useCallback((files) => {
        field.handleChange(files.at(0))
    }, [])

    return (
        <Dropzone onDrop={onUpload} accept={{ 'image/*': [] }}>
            {({ getRootProps, getInputProps }) => (
                <div className="relative">
                    <Input accept="image/*" {...getInputProps()} />
                    {image
                        ? <div {...getRootProps()}>
                            <Button type="button" className="absolute !p-2 top-2 right-2 border border-red-600 bg-red-400 hover:border-red-600 hover:bg-red-600 rounded-full"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    field.handleChange(null)
                                }}>
                                <Trash2 />
                            </Button>
                            <img className="rounded-xl" src={image} alt="item picture" />
                        </div>
                        : <div className={cn("h-full flex flex-col gap-6 border border-input rounded-xl", value ? "border-solid" : "p-6 border-dashed")}
                            {...getRootProps()}>
                            <div className="w-full h-full flex flex-col justify-center items-center gap-y-6">
                                <div className="flex flex-col justify-center items-center gap-1">
                                    <div className="p-2.5 border rounded-full border-input">
                                        <Upload className="size-5 text-text-1/85" />
                                    </div>
                                    <p className="font-medium text-sm">Drag & drop files here</p>
                                    <p className="text-muted-foreground text-xs text-center">Or click to browse (max 1 files, up to 5MB each)</p>
                                </div>
                                <Button
                                    type="button"
                                    className={cn(buttonVariants({ variant: "outline" }),
                                        "text-text-1 text-sm border border-input")}>Browse Files</Button>
                            </div>
                        </div>}
                </div>
            )}
        </Dropzone>
    );
}

export { ControlledImageuploader }