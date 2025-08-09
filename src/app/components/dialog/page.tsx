"use client";

import { useState } from "react";
import { Dialog } from "./_components/dialog";

export default function DialogExample() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Open Dialog
        </button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Delete item?</Dialog.Title>
        <Dialog.Description>
          This will permanently delete your data.
        </Dialog.Description>

        <div className="mt-4 text-sm text-gray-600">
          Are you absolutely sure?
        </div>

        <Dialog.Footer>
          <Dialog.Trigger>
            <button className="px-4 py-2 text-sm border rounded hover:bg-gray-100">
              Cancel
            </button>
          </Dialog.Trigger>
          <button className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700">
            Confirm
          </button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
