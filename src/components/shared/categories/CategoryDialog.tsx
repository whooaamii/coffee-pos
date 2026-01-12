"use client";

import { useState } from "react";
import { Category } from "@prisma/client";
import type { CategoryColor } from "@/lib/category-colors";
import { CATEGORY_COLOR_STYLES } from "@/lib/category-colors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createCategory,
  updateCategory,
} from "@/app/(dashboard)/categories/actions";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function CategoryDialog({ category }: { category?: Category }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name ?? "");
  const [color, setColor] = useState<CategoryColor>((category?.color as CategoryColor) ?? "slate");
  const [loading, setLoading] = useState(false);

  const COLORS = Object.keys(CATEGORY_COLOR_STYLES) as CategoryColor[];

  async function onSubmit() {
    try {
      setLoading(true);

      if (category) {
        await updateCategory(category.id, name, color);
        toast.success("Kategori berhasil diperbarui");
      } else {
        await createCategory(name, color);
        toast.success("Kategori berhasil ditambahkan");
        setName(""); // reset input
        setColor("slate");
      }

      setOpen(false); // 🔑 close dialog AFTER success
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {category ? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        )}
      </DialogTrigger>


      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Kategori" : "Tambah Kategori"}
          </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Nama kategori"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Warna</p>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={color === c ? "default" : "outline"}
                onClick={() => setColor(c)}
                className={cn("flex items-center gap-2 px-3 h-8", color === c ? "ring-2 ring-offset-1" : "")}
              >
                <span className={cn("h-3 w-3 rounded-full", CATEGORY_COLOR_STYLES[c].dot)} />
                <span className="capitalize text-sm">{c}</span>
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={onSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
