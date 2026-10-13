import { AdminProductSection } from "@/features/products/components";
import { MOCK_PRODUCTS } from "@/mocks/products";
import { categoriesProducts } from "@/features/categories/services/categories-products";

export default async function AdminProductsPage() {
	const categories = await categoriesProducts();
	return (
		<AdminProductSection
			initialProducts={MOCK_PRODUCTS}
			initialCategories={categories}
		/>
	);
}
