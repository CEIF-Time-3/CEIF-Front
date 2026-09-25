import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { PastelIcon } from "./icons/logo-icon";

export const ClientHeader = () => {
  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-primary flex items-center gap-2 text-xl font-bold"
          >
            <PastelIcon className="h-7 w-7 text-amber-500" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/carrinho"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden sm:inline">Carrinho</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
