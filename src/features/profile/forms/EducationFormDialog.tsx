
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

export function EducationFormDialog() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    console.log("Education submitted:", Object.fromEntries(formData.entries()));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Education</DialogTitle>
          <DialogDescription>
            Provide your educational background details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="school"
            type="text"
            placeholder="School / University"
            className="border rounded p-2"
            required
          />
          <input
            name="degree"
            type="text"
            placeholder="Degree (e.g. B.Sc, M.Sc)"
            className="border rounded p-2"
          />
          <input
            name="field"
            type="text"
            placeholder="Field of Study"
            className="border rounded p-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="startYear"
              type="text"
              placeholder="Start Year"
              className="border rounded p-2"
            />
            <input
              name="endYear"
              type="text"
              placeholder="End Year (or expected)"
              className="border rounded p-2"
            />
          </div>

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
