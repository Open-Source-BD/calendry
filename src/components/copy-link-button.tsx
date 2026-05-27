"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export function CopyLinkButton({ url }: { url: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button variant="secondary" size="sm" className="w-full" onClick={handleCopy}>
      <Copy className="mr-2 h-4 w-4" /> Copy Link
    </Button>
  );
}
