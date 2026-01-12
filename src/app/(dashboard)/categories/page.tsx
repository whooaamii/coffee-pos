import { getCategories } from "./actions";
import { CategoryTable } from "@/components/shared/categories/CategoryTable";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="p-6 space-y-6">
     

      <CategoryTable data={categories} />
    </div>
  );
}
