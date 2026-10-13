"use client";

import { Package, Plus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Categorie } from "@/features/categories/schemas/categorie-schema";
import {
  AdminProductFilters,
  AdminProductStats,
  AdminProductTable,
  ProductCreateForm,
  type ProductStatusFilter,
} from "@/features/products/components";
import type {
  Product,
  ProductCreateInput,
} from "@/features/products/schemas/product-schema";
import { productService } from "@/features/products/services/create-products";
import { MOCK_PRODUCTS } from "@/mocks/products";

interface AdminProductSectionProps {
  initialProducts?: Product[];
  initialCategories?: Categorie[];
}

export const AdminProductSection = ({
  initialProducts,
  initialCategories,
}: AdminProductSectionProps) => {
  const [products, setProducts] = React.useState<Product[]>(
    initialProducts ?? MOCK_PRODUCTS
  );
  const [categories] = React.useState<Categorie[]>(initialCategories ?? []);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Todos");
  const [statusFilter, setStatusFilter] =
    React.useState<ProductStatusFilter>("all");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<ProductCreateInput>({
    name: "",
    price: "",
    categoryId: categories[0]?.id || "",
    imageUrl: "",
    description: "",
    available: true,
    ingredients: "",
  });

  const handleFormChange = React.useCallback(
    (field: keyof ProductCreateInput, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleFormSubmit = React.useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await productService.create(formData);
        const newProd: Product = {
          id: `prod-${Date.now()}`,
          name: formData.name,
          description: formData.description || null,
          price: formData.price,
          imageUrl: formData.imageUrl || null,
          available: formData.available,
          ingredients: formData.ingredients || null,
        };
        setProducts((prev) => [newProd, ...prev]);
        setIsFormOpen(false);
        setFormData({
          name: "",
          price: "",
          categoryId: categories[0]?.id || "",
          imageUrl: "",
          description: "",
          available: true,
          ingredients: "",
        });
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Falha ao criar produto"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, categories]
  );

  const toggleAvailability = React.useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  }, []);

  const deleteProduct = React.useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetFilters = React.useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("Todos");
    setStatusFilter("all");
  }, []);

  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.ingredients?.toLowerCase().includes(query)
      );
    }

    if (statusFilter === "available") {
      result = result.filter((p) => p.available);
    } else if (statusFilter === "unavailable") {
      result = result.filter((p) => !p.available);
    }

    return result;
  }, [products, searchQuery, statusFilter]);

  return (
    <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
            <Package className="size-4" />
            <span>Painel de Administração</span>
          </div>
          <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
            Gestão de Produtos
          </h1>
          <p className="text-muted-foreground text-sm">
            Gerencie, pesquise e controle a disponibilidade dos itens do
            cardápio.
          </p>
        </div>

        <Button
          onClick={() => setIsFormOpen(true)}
          className="h-9 gap-1.5 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          Novo Produto
        </Button>
      </div>

      <AdminProductStats products={products} categories={categories} />

      <AdminProductFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        statusFilter={statusFilter}
        categories={categories}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onStatusFilterChange={setStatusFilter}
        onResetFilters={resetFilters}
      />

      <AdminProductTable
        products={filteredProducts}
        isLoading={false}
        onToggleAvailability={toggleAvailability}
        onDeleteProduct={deleteProduct}
        onResetFilters={resetFilters}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-full max-w-2xl p-6 sm:max-w-2xl">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-lg font-bold">
              Cadastrar Novo Produto
            </DialogTitle>
            <DialogDescription className="text-xs">
              Preencha as informações abaixo para adicionar um novo produto ao
              cardápio.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-1">
            <ProductCreateForm
              formData={formData}
              categories={categories}
              isSubmitting={isSubmitting}
              errors={submitError ? { name: submitError } : {}}
              onChange={handleFormChange}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
