
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

export function ProjectFormDialog() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());

    console.log("Project form submitted:", values);
    // TODO: send data to API
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
         <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add project
         </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Describe your project details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Project Link */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Project Link(s)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                name="linkTitle"
                type="text"
                placeholder="Link title"
                className="border rounded p-2"
                required
              />
              <input
                name="linkUrl"
                type="url"
                placeholder="Project URL"
                className="border rounded p-2"
                required
              />
            </div>
          </div>

          {/* Summary */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Summary</label>
            <input
              name="summary"
              type="text"
              placeholder="Summarize your project..."
              maxLength={163}
              className="border rounded p-2"
            />
          </div>

          {/* Solution */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Solution</label>
            <textarea
              name="solution"
              placeholder="Explain how your solution achieved the project objectives..."
              maxLength={500}
              className="border rounded p-2 min-h-[100px]"
            />
          </div>

          {/* Approach */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Approach</label>
            <textarea
              name="approach"
              placeholder="Describe the steps you took..."
              maxLength={500}
              className="border rounded p-2 min-h-[100px]"
            />
          </div>

          {/* Footer */}
          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <button
                type="button"
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => console.log("Draft saved")}
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add Project to Profile
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
