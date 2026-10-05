import { AdminProductSection } from "@/features/products/components";
import { productService } from "@/features/products/services/product-service";

export default async function AdminProductsPage() {
	const [products, categories] = await Promise.all([
		productService.getProducts(),
		productService.getCategories(),
	]);

	return (
		<AdminProductSection
			initialProducts={products}
			initialCategories={categories}
		/>
	);
}
