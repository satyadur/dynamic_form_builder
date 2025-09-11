"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useTransition } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RefreshButton({
  onRefresh,
}: {
  onRefresh: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      onRefresh(); // 🔥 trigger parent-provided refetch
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RefreshCcw
              className={`h-4 w-4 ${
                isPending ? "animate-spin text-blue-600" : ""
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Refresh submissions</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
