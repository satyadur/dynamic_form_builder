import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "./hooks/useDesigner";
import { UpdateFormContext } from "@/actions/form";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";

const SaveFormBtn = ({ id }: { id: number }) => {
  const { elements } = useDesigner();
  const [loading, starttransition] = useTransition();
  const updateFormContent = async () => {
    try {
      const JsonElements = JSON.stringify(elements);
      await UpdateFormContext(id, JsonElements);
      toast.success("Your form has been saved");
    } catch (error) {
      toast.error("Something went wrong...");
    }
  };
  return (
    <Button
      variant={"outline"}
      className="gap-2 cursor-pointer"
      disabled={loading}
      onClick={() => {
        starttransition(updateFormContent);
      }}
    >
      <HiSaveAs className="h-4 w-4" /> Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
};

export default SaveFormBtn;
