import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CartEmpty = () => {
	return (
		<div className="border-border/80 bg-card/60 mx-auto flex max-w-2xl flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-16 text-center shadow-xs backdrop-blur-xs sm:py-24">
			<div className="bg-primary/20 text-primary-foreground relative flex h-24 w-24 items-center justify-center rounded-full shadow-inner sm:h-28 sm:w-28">
				<ShoppingBag className="h-12 w-12 text-amber-600 dark:text-amber-400" />
				<span className="bg-primary absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black shadow-xs">
					0
				</span>
			</div>

			<h2 className="text-foreground mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
				Seu carrinho está vazio
			</h2>

			<p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed sm:text-base">
				Você ainda não adicionou nenhum pastel delicioso ao seu pedido. Que tal
				conhecer nossos sabores artesanais fritos na hora?
			</p>

			<div className="mt-8 flex flex-col gap-3 sm:flex-row">
				<Button
					nativeButton={false}
					size="lg"
					className="h-11 gap-2 rounded-xl px-7 text-sm font-bold shadow-md hover:shadow-lg transition-all"
					render={<Link href="/" />}
				>
					<span>Explorar Cardápio</span>
					<ArrowRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};
