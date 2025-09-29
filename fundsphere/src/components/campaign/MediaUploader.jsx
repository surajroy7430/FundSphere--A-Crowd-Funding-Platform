import { useCallback, useState } from "react";
import { useFetch } from "../../hooks/use-fetch";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

const MediaUploader = ({
  campaignId,
  mediaFiles,
  setMediaFiles,
  onUploaded,
}) => {
  const { request } = useFetch();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!campaignId) {
        toast.error("Please create campaign draft first.");
        return;
      }

      const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
      const valid = acceptedFiles.filter((f) => allowed.includes(f.type));
      const invalid = acceptedFiles.length - valid.length;

      if (invalid > 0)
        toast.error(`${invalid} file(s) unsupported and were skipped`);

      for (let file of valid) {
        const tempId = `${Date.now()}-${file.name}`;
        setMediaFiles((prev) => [
          ...prev,
          {
            tempId,
            file,
            url: URL.createObjectURL(file),
            progress: 0,
            status: "uploading",
          },
        ]);

        const fd = new FormData();
        fd.append("media", file);

        try {
          const res = await request({
            url: `/api/campaigns/${campaignId}/media`,
            method: "POST",
            data: fd,
            onUploadProgress: (evt) => {
              const progress = Math.round((evt.loaded * 100) / evt.total);
              setMediaFiles((prev) =>
                prev.map((x) => (x.tempId === tempId ? { ...x, progress } : x))
              );
            },
          });

          const uploadedUrls = res.data.media || [];
          const latestUrl = uploadedUrls[uploadedUrls.length - 1];

          setMediaFiles((prev) =>
            prev
              .map((x) =>
                x.tempId === tempId
                  ? { ...x, status: "done", url: latestUrl }
                  : x
              )
              .filter(Boolean)
          );

          if (latestUrl) onUploaded(latestUrl);
        } catch (error) {
          setMediaFiles((prev) =>
            prev.map((x) =>
              x.tempId === tempId ? { ...x, status: "error" } : x
            )
          );
        }
      }
    },
    [campaignId, onUploaded, mediaFiles, setMediaFiles, request]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 10,
  });

  return (
    <div className="border border-dashed bg-muted/30 hover:bg-muted/40 rounded-lg p-4">
      <div
        {...getRootProps()}
        className={`p-6 cursor-pointer text-center ${
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-200"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-zinc-700">
          Drag & drop images or videos here, or click to select files
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Max 10MB per file. JPEG, PNG, MP4
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {mediaFiles.map((u, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-sm">{u.file.name}</div>
              <div className="w-full bg-gray-200 rounded h-2 mt-1 overflow-hidden">
                <div
                  style={{ width: `${u.progress}%` }}
                  className={`h-2 ${
                    u.status === "error" ? "bg-red-500" : "bg-green-500"
                  }`}
                />
              </div>
            </div>
            <div className="w-20 text-right text-xs">
              {u.status === "uploading" && <span>{u.progress}%</span>}
              {u.status === "done" && <span>Done</span>}
              {u.status === "error" && (
                <span className="text-red-500">Error</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaUploader;
