import { categorieService } from "@/features/categories/services/categories-products";
import { AdminProductSection } from "@/features/products/components";
import { productService } from "@/features/products/services/product.service";

export default async function AdminProductsPage() {
  const categories = await categorieService.categoriesProducts();
  const result = await productService.getAll();

  return (
    <AdminProductSection
      initialProducts={result.success ? result.data : []}
      initialCategories={categories}
    />
  );
}
