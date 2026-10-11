import { AdminProductSection } from "@/features/products/components";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/mocks/products";

export default function AdminProductsPage() {
	return (
		<AdminProductSection
			initialProducts={MOCK_PRODUCTS}
			initialCategories={["Todos", ...MOCK_CATEGORIES.map((c) => c.name)]}
		/>
	);
}
