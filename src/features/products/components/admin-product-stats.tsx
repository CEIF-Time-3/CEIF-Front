"use client";

import {
  CheckCircle2,
  DollarSign,
  FolderTree,
  Package,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Categorie } from "@/features/categories/schemas/categories.schema";
import type { Product } from "@/features/products/schemas/products.schema";
import { formatPrice } from "@/utils/format-price";

interface AdminProductStatsProps {
  products: Product[];
  categories: Categorie[];
}

export const AdminProductStats = ({
  products,
  categories,
}: AdminProductStatsProps) => {
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.available).length;
  const inactiveProducts = products.filter((p) => !p.available).length;
  const totalCategories = categories.length;
  const averagePrice =
    totalProducts > 0
      ? products.reduce((acc, p) => {
          const num = Number.parseFloat(
            p.price.replace(/\./g, "").replace(",", ".")
          );
          return acc + (Number.isNaN(num) ? 0 : num);
        }, 0) / totalProducts
      : 0;

  const stats = [
    {
      title: "Total de Produtos",
      value: totalProducts,
      description: "Cadastrados no sistema",
      icon: Package,
      iconBg: "bg-primary/15 text-primary",
    },
    {
      title: "Produtos Ativos",
      value: activeProducts,
      description: "Visíveis no cardápio",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Indisponíveis",
      value: inactiveProducts,
      description: "Pausados no momento",
      icon: XCircle,
      iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Categorias",
      value: totalCategories,
      description: "Grupos de produtos",
      icon: FolderTree,
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Preço Médio",
      value: formatPrice(averagePrice),
      description: "Média por item",
      icon: DollarSign,
      iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="border-border bg-card w-full min-w-0 overflow-hidden shadow-xs"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex min-w-0 items-center justify-between gap-2">
                <span
                  className="text-muted-foreground block min-w-0 truncate text-xs font-semibold tracking-wider uppercase"
                  title={stat.title}
                >
                  {stat.title}
                </span>
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-2 flex min-w-0 items-baseline gap-2">
                <span className="text-foreground min-w-0 truncate text-2xl font-bold tracking-tight">
                  {stat.value}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 truncate text-xs">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
