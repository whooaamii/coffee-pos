"use client";

import { Category } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { CategoryDialog } from "./CategoryDialog";
import { CategoryDelete } from "./CategoryDelete";

type Props = {
  data: Category[];
};

export function CategoryTable({ data }: Props) {
  return (
    <div className="space-y-4">
      {/* ===== HEADER (MATCH PRODUCT PAGE) ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Daftar Kategori</h1>
          <p className="text-sm text-muted-foreground">
            {data.length} kategori ditemukan
          </p>
        </div>

        <CategoryDialog />
      </div>

      {/* ===== LIST CARD ===== */}
      <div className="rounded-xl border bg-card">
        <Table>
          

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="py-6 text-center text-sm text-muted-foreground"
                >
                  Belum ada kategori
                </TableCell>
              </TableRow>
            )}

            {data.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">
                  {cat.name}
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <CategoryDialog category={cat} />
                  <CategoryDelete id={cat.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
