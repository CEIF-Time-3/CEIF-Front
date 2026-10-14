"use client";

import { Package } from "lucide-react";
import React from "react";
import type { Categorie } from "@/features/categories/schemas/categories.schema";
import {
  AdminProductFilters,
  AdminProductStats,
  AdminProductTable,
  ProductCreateForm,
  type ProductStatusFilter,
} from "@/features/products/components";
import type { Product } from "@/features/products/schemas/products.schema";

interface AdminProductSectionProps {
  initialProducts: Product[];
  initialCategories: Categorie[];
}

export const AdminProductSection = ({
  initialProducts,
  initialCategories,
}: AdminProductSectionProps) => {
  const [products] = React.useState<Product[]>(initialProducts);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Todos");
  const [statusFilter, setStatusFilter] =
    React.useState<ProductStatusFilter>("all");

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

        <ProductCreateForm categories={initialCategories} />
      </div>

      <AdminProductStats products={products} categories={initialCategories} />

      <AdminProductFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        statusFilter={statusFilter}
        categories={initialCategories}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onStatusFilterChange={setStatusFilter}
        onResetFilters={resetFilters}
      />

      <AdminProductTable
        products={filteredProducts}
        isLoading={false}
        onResetFilters={resetFilters}
      />
    </div>
  );
};
