"use client";

import { FilterX, Search, SlidersHorizontal } from "lucide-react";

import { SelectInput } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Categorie } from "@/features/categories/schemas/categories.schema";

export type ProductStatusFilter = "all" | "available" | "unavailable";

interface AdminProductFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  statusFilter: ProductStatusFilter;
  categories: Categorie[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusFilterChange: (status: ProductStatusFilter) => void;
  onResetFilters: () => void;
}

export const AdminProductFilters = ({
  searchQuery,
  selectedCategory,
  statusFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusFilterChange,
  onResetFilters,
}: AdminProductFiltersProps) => {
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "Todos" ||
    statusFilter !== "all";

  const statusOptions = [
    { label: "Todos os status", value: "all" },
    { label: "Apenas Disponíveis", value: "available" },
    { label: "Apenas Indisponíveis", value: "unavailable" },
  ];

  const categoriesOptions = categories.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  return (
    <div className="border-border bg-card/70 flex w-full min-w-0 flex-col gap-4 rounded-xl border p-4 shadow-xs backdrop-blur-xs">
      <div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Buscar por nome, descrição ou categoria..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-background pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <SlidersHorizontal className="size-3.5 shrink-0" />
            <span className="hidden font-medium sm:inline">Categoria:</span>
            <SelectInput
              size="sm"
              value={selectedCategory}
              onValueChange={onCategoryChange}
              options={categoriesOptions}
              placeholder="Categoria"
            />
          </div>

          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span className="hidden font-medium sm:inline">Status:</span>
            <SelectInput
              size="sm"
              value={statusFilter}
              onValueChange={(val) =>
                onStatusFilterChange(val as ProductStatusFilter)
              }
              options={statusOptions}
              placeholder="Status"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-muted-foreground hover:text-foreground h-9 text-xs"
            >
              <FilterX className="mr-1.5 size-3.5" />
              Limpar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
