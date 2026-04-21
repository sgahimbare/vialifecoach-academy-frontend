
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

export function WorkExperienceFormDialog() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    console.log("Work experience submitted:", Object.fromEntries(formData.entries()));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Work Experience
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Work Experience</DialogTitle>
          <DialogDescription>
            Share details about your professional experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="company"
            type="text"
            placeholder="Company"
            className="border rounded p-2"
            required
          />
          <input
            name="role"
            type="text"
            placeholder="Job Title"
            className="border rounded p-2"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="startDate"
              type="month"
              className="border rounded p-2"
            />
            <input
              name="endDate"
              type="month"
              className="border rounded p-2"
            />
          </div>
          <textarea
            name="responsibilities"
            placeholder="Describe your role and achievements"
            className="border rounded p-2 min-h-[100px]"
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
