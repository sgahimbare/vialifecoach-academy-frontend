
import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function WorkHistoryFormDialog() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    console.log("Work history submitted:", Object.fromEntries(formData.entries()));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Work History
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Work History</DialogTitle>
          <DialogDescription>
            Add previous roles you’ve held.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="organization"
            type="text"
            placeholder="Organization"
            className="border rounded p-2"
          />
          <input
            name="position"
            type="text"
            placeholder="Position"
            className="border rounded p-2"
          />
          <input
            name="years"
            type="text"
            placeholder="Years (e.g. 2018 - 2022)"
            className="border rounded p-2"
          />

          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
