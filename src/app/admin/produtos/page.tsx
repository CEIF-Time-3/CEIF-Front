import { categorieService } from "@/features/categories/services/categories.service";
import { AdminProductSection } from "@/features/products/components";
import { productService } from "@/features/products/services/product.service";

export default async function AdminProductsPage() {
  const categoriesResult = await categorieService.getAll();
  const result = await productService.getAll();

  return (
    <AdminProductSection
      initialProducts={result.success ? result.data : []}
      initialCategories={categoriesResult.success ? categoriesResult.data : []}
    />
  );
}
