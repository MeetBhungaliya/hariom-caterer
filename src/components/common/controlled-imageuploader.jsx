import { cn } from "@/lib/utils";
import { Trash2, Upload } from "lucide-react";
import * as React from "react";
import { useLayoutEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";

function ControlledImageuploader({ field, baseHeightElement }) {
  const [height, setHeight] = useState(null);

  useLayoutEffect(() => {
    if (!baseHeightElement.current) return;
    const resizeObserver = new ResizeObserver((entries) =>
      setHeight(entries[0].target.clientHeight)
    );
    resizeObserver.observe(baseHeightElement.current);
    return () => {
      if (!baseHeightElement.current) return;
      resizeObserver.unobserve(baseHeightElement.current);
    };
  }, [baseHeightElement.current]);

  const value = field.state.value;

  const image = value
    ? value instanceof File
      ? URL.createObjectURL(value)
      : value
    : null;

  const onUpload = React.useCallback((files) => {
    field.handleChange(files.at(0));
  }, []);

  return (
    <Dropzone onDrop={onUpload} accept={{ "image/*": [] }}>
      {({ getRootProps, getInputProps }) => (
        <div
          style={{ height: baseHeightElement ? `${height}px` : "unset" }}
          className="flex relative"
        >
          <Input accept="image/*" {...getInputProps()} />
          {image ? (
            <div {...getRootProps()} className="h-full w-full">
              <Button
                type="button"
                className="absolute !p-2 top-2 right-2 border border-red-600 bg-red-400 hover:border-red-600 hover:bg-red-600 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  field.handleChange(null);
                }}
              >
                <Trash2 className="text-white" />
              </Button>
              <img
                className="h-full w-full object-cover rounded-xl"
                src={image}
                alt="item picture"
              />
            </div>
          ) : (
            <div
              className={cn(
                "w-full h-full flex flex-col gap-3 md:gap-6 border border-gray-300 rounded-lg md:rounded-xl",
                value ? "border-solid" : "p-4 md:p-6 border-dashed"
              )}
              {...getRootProps()}
            >
              <div className="w-full h-full flex flex-col justify-center items-center gap-y-3 md:gap-y-6">
                <div className="flex flex-col justify-center items-center gap-1">
                  <div className="p-1.5 md:p-2.5 border rounded-full border-gray-300">
                    <Upload className="size-4 md:size-5 text-gray-400" />
                  </div>
                  <p className="font-medium text-sm hidden md:block">
                    Drag & drop files here
                  </p>
                  <p className="text-muted-foreground text-[10px] md:text-xs text-center">
                    Or click to browse (max 1 files, up to 5MB each)
                  </p>
                </div>
                <Button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "p-1.5 md:p-2 text-text-1 text-xs md:text-sm border border-gray-300 hover:bg-sky-600 hover:text-white"
                  )}
                >
                  Browse Files
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
}

export { ControlledImageuploader };
