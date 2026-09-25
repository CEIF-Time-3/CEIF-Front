import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { HighlightBadgeList } from "@/components/highlight-badge-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ClientHomePage() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <section className="from-primary/15 via-background to-background relative overflow-hidden bg-linear-to-b pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <Badge
              variant="secondary"
              className="h-auto gap-2 rounded-full px-4 py-1.5 text-xs font-semibold sm:text-sm"
            >
              <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Pastéis Sequinhos e Crocantes</span>
            </Badge>

            <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              O Pastel Perfeito <br />
              <span className="text-primary font-black">Frito na Hora</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-xl">
              Massa artesanal douradinha, recheios ultra generosos e aquele
              sabor caseiro inconfundível. Peça agora e receba quentinho na sua
              casa!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                nativeButton={false}
                size="lg"
                className="h-12 gap-2 px-8 text-base font-bold shadow-md"
                render={<Link href="#cardapio" />}
              >
                Ver Cardápio
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base font-semibold"
                render={<Link href="#destaques" />}
              >
                Pastéis Mais Pedidos
              </Button>
            </div>

            <div className="w-full pt-4">
              <HighlightBadgeList />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
