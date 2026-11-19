import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { productService } from "@/features/products/services/product.service";
import { useProductStore } from "@/features/products/stores/product.store";
import * as httpModule from "@/utils/http";

const sampleProduct = {
	id: "prod-1",
	name: "Pastel de Carne",
	price: "12,00",
	imageUrl: null,
	description: "Recheio temperado",
	available: true,
	ingredients: "Carne moída",
	categoryId: "cat-1",
	categoryName: "Salgados",
};

describe("ProductService and useProductStore", () => {
	beforeEach(() => {
		useProductStore.setState({ products: [], isLoading: false, error: null });
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("fetches products via getAll and handles errors", async () => {
		vi.spyOn(httpModule, "http").mockResolvedValue({
			success: true,
			data: [sampleProduct],
		});

		const result = await productService.getAll();
		expect(result).toEqual({ success: true, data: [sampleProduct] });

		vi.spyOn(httpModule, "http").mockRejectedValue(new Error("Falha de rede"));
		const failed = await productService.getAll();
		expect(failed).toEqual({ success: false, error: "Falha de rede" });
	});

	it("creates and updates products", async () => {
		const httpSpy = vi.spyOn(httpModule, "http").mockResolvedValue({});

		const createRes = await productService.create({
			name: "Pastel de Frango",
			price: "13,00",
			available: true,
		});
		expect(createRes).toEqual({
			success: true,
			data: "Produto criado com sucesso!",
		});

		const updateRes = await productService.update("prod-1", {
			name: "Pastel de Carne Especial",
			price: "14,00",
			imageUrl: null,
			description: null,
			available: false,
			ingredients: null,
		});
		expect(updateRes).toEqual({
			success: true,
			data: "Produto atualizado com sucesso.",
		});
		expect(httpSpy).toHaveBeenCalledTimes(2);

		vi.spyOn(httpModule, "http").mockRejectedValue(new Error("Erro 500"));
		expect(
			await productService.create({
				name: "X",
				price: "1,00",
				available: true,
			}),
		).toEqual({ success: false, error: "Erro 500" });
		expect(
			await productService.update("prod-1", {
				name: "X",
				price: "1,00",
				imageUrl: null,
				description: null,
				available: true,
				ingredients: null,
			}),
		).toEqual({ success: false, error: "Erro 500" });
	});

	it("deletes product handling success, failure message, error field, fallback, and exception", async () => {
		vi.spyOn(httpModule, "http").mockResolvedValueOnce({
			success: true,
			data: "Removido",
		});
		expect(await productService.deleteProduct("prod-1")).toEqual({
			success: true,
			data: "Removido",
		});

		vi.spyOn(httpModule, "http").mockResolvedValueOnce({
			success: false,
			message: "Produto em uso",
		});
		expect(await productService.deleteProduct("prod-1")).toEqual({
			success: false,
			error: "Produto em uso",
		});

		vi.spyOn(httpModule, "http").mockResolvedValueOnce({
			success: false,
			error: "Sem permissão",
		});
		expect(await productService.deleteProduct("prod-1")).toEqual({
			success: false,
			error: "Sem permissão",
		});

		vi.spyOn(httpModule, "http").mockResolvedValueOnce({
			success: false,
		});
		expect(await productService.deleteProduct("prod-1")).toEqual({
			success: false,
			error: "Falha ao excluir produto.",
		});

		vi.spyOn(httpModule, "http").mockRejectedValueOnce(new Error("Timeout"));
		expect(await productService.deleteProduct("prod-1")).toEqual({
			success: false,
			error: "Timeout",
		});
	});

	it("manages state in useProductStore", async () => {
		vi.spyOn(productService, "getAll").mockResolvedValueOnce({
			success: true,
			data: [sampleProduct],
		});
		await useProductStore.getState().getAll();
		expect(useProductStore.getState().products).toHaveLength(1);

		vi.spyOn(productService, "getAll").mockResolvedValueOnce({
			success: false,
			error: "Erro",
		});
		await useProductStore.getState().getAll();
		expect(useProductStore.getState().error).toBe("Erro");

		useProductStore.getState().setProducts([sampleProduct]);
		expect(useProductStore.getState().error).toBeNull();

		vi.spyOn(productService, "create").mockResolvedValueOnce({
			success: true,
			data: "OK",
		});
		expect(
			await useProductStore
				.getState()
				.create({ name: "Novo", price: "10,00", available: true }),
		).toEqual({ success: true, data: "OK" });

		// setAvailability not found
		expect(
			await useProductStore.getState().setAvailability("missing", false),
		).toEqual({ success: false, error: "Produto não encontrado." });

		// setAvailability success
		vi.spyOn(productService, "update").mockResolvedValueOnce({
			success: true,
			data: "Atualizado",
		});
		await useProductStore.getState().setAvailability("prod-1", false);
		expect(useProductStore.getState().products[0].available).toBe(false);

		// update failure preserves product
		vi.spyOn(productService, "update").mockResolvedValueOnce({
			success: false,
			error: "Falhou",
		});
		await useProductStore.getState().setAvailability("prod-1", true);
		expect(useProductStore.getState().products[0].available).toBe(false);

		// deleteProduct failure keeps product, success removes it
		vi.spyOn(productService, "deleteProduct").mockResolvedValueOnce({
			success: false,
			error: "Erro",
		});
		await useProductStore.getState().deleteProduct("prod-1");
		expect(useProductStore.getState().products).toHaveLength(1);

		vi.spyOn(productService, "deleteProduct").mockResolvedValueOnce({
			success: true,
			data: "Removido",
		});
		await useProductStore.getState().deleteProduct("prod-1");
		expect(useProductStore.getState().products).toHaveLength(0);
	});
});
