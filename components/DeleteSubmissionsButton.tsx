"use client";

import { DeleteSubmissions } from "@/actions/form";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeleteSubmissionsProps {
  ids: number[];
  onDeleted?: () => void; // optional callback for refreshing table
}

export default function DeleteSubmissionsButton({
  ids,
  onDeleted,
}: DeleteSubmissionsProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!ids.length) return toast.error("No submissions selected");

    setLoading(true);
    try {
      await DeleteSubmissions(ids);
      toast.success(`Deleted ${ids.length} submission(s)`);
      onDeleted?.(); // notify parent to refresh UI
    } catch (error) {
      toast.error("Failed to delete submissions", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={loading || ids.length === 0}
                className={cn(
                  "flex items-center",
                  ids.length === 0 ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {loading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected submissions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete{" "}
            <span className="font-semibold">{ids.length}</span> submission(s).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
