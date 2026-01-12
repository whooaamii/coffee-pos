"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogContent, AlertDialogTrigger,
  AlertDialogHeader, AlertDialogTitle, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteCategory } from "@/app/(dashboard)/categories/actions";
import { toast } from "sonner";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

export function CategoryDelete({ id }: { id: string }) {
  async function onDelete() {
    await deleteCategory(id);
    toast.success("Kategori dihapus");
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Hapus
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin ingin menghapus kategori ini?</AlertDialogTitle>
          <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
