import { AdminProductSection } from "@/features/products/components";
import { MOCK_PRODUCTS } from "@/mocks/products";
import { categorieService } from "@/features/categories/services/categories-products";

export default async function AdminProductsPage() {
	const categories = await categorieService.categoriesProducts();
	return (
		<AdminProductSection
			initialProducts={MOCK_PRODUCTS}
			initialCategories={categories}
		/>
	);
}
