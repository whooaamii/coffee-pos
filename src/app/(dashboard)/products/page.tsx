import { prisma } from "@/lib/prisma";


export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Produk</h1>

      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex justify-between rounded border p-3"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted-foreground">
                {p.category.name}
              </p>
            </div>
            <p>Rp {p.price.toLocaleString("id-ID")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
