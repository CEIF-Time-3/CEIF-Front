import {
	ArrowRight,
	CheckCircle2,
	Clock,
	Flame,
	ShieldCheck,
	Sparkles,
	Tag,
	Truck,
	X,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils";

interface CartSummaryProps {
	subtotal: number;
	deliveryFee: number;
	discount: number;
	total: number;
	deliveryType: "delivery" | "takeaway";
	setDeliveryType: (type: "delivery" | "takeaway") => void;
	couponCode: string;
	setCouponCode: (code: string) => void;
	appliedCoupon: string | null;
	couponError: string | null;
	onApplyCoupon: (code: string) => void;
	onRemoveCoupon: () => void;
	onOpenCheckout: () => void;
	disabled?: boolean;
}

export const CartSummary = ({
	subtotal,
	deliveryFee,
	discount,
	total,
	deliveryType,
	setDeliveryType,
	couponCode,
	setCouponCode,
	appliedCoupon,
	couponError,
	onApplyCoupon,
	onRemoveCoupon,
	onOpenCheckout,
	disabled = false,
}: CartSummaryProps) => {
	const handleCouponSubmit = React.useCallback(
		(e: React.SubmitEvent<HTMLFormElement>) => {
			e.preventDefault();
			onApplyCoupon(couponCode);
		},
		[couponCode, onApplyCoupon],
	);

	return (
		<Card className="border-border/80 bg-card sticky top-24 rounded-2xl shadow-sm">
			<CardHeader className="pb-4">
				<CardTitle className="text-foreground text-xl font-extrabold tracking-tight">
					Resumo do Pedido
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col gap-5 pt-0">
				{/* Delivery Type Selector */}
				<div className="flex flex-col gap-2">
					<span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
						Forma de Recebimento
					</span>
					<div className="bg-muted grid grid-cols-2 gap-1 rounded-xl p-1">
						<button
							type="button"
							onClick={() => setDeliveryType("delivery")}
							className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
								deliveryType === "delivery"
									? "bg-card text-foreground shadow-xs"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							<Truck className="h-3.5 w-3.5" />
							<span>Entrega</span>
						</button>
						<button
							type="button"
							onClick={() => setDeliveryType("takeaway")}
							className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
								deliveryType === "takeaway"
									? "bg-card text-foreground shadow-xs"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							<Clock className="h-3.5 w-3.5" />
							<span>Retirar na Loja</span>
						</button>
					</div>
				</div>

				<Separator />

				{/* Price Breakdown */}
				<div className="flex flex-col gap-2.5 text-sm">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Subtotal dos itens</span>
						<span className="text-foreground font-semibold">
							{formatPrice(subtotal)}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Taxa de entrega</span>
						{deliveryType === "takeaway" ? (
							<span className="text-emerald-600 dark:text-emerald-400 font-semibold">
								Grátis (Retirada)
							</span>
						) : deliveryFee === 0 ? (
							<span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
								<Sparkles className="h-3.5 w-3.5" />
								Grátis
							</span>
						) : (
							<span className="text-foreground font-semibold">
								{formatPrice(deliveryFee)}
							</span>
						)}
					</div>

					{discount > 0 && (
						<div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
							<span className="flex items-center gap-1">
								<Tag className="h-3.5 w-3.5" />
								Desconto ({appliedCoupon})
							</span>
							<span>- {formatPrice(discount)}</span>
						</div>
					)}
				</div>

				{/* Coupon Area */}
				<div className="flex flex-col gap-2">
					{appliedCoupon ? (
						<div className="bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold">
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4" />
								<span>
									Cupom <strong>{appliedCoupon}</strong> aplicado com sucesso!
								</span>
							</div>
							<button
								type="button"
								onClick={onRemoveCoupon}
								className="text-muted-foreground hover:text-destructive p-0.5 transition-colors"
								title="Remover cupom"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						</div>
					) : (
						<form onSubmit={handleCouponSubmit} className="flex flex-col gap-1.5">
							<div className="flex gap-2">
								<div className="relative flex-1">
									<Input
										value={couponCode}
										onChange={(e) => setCouponCode(e.target.value)}
										placeholder="Cupom de desconto"
										className="h-9 uppercase text-xs font-medium"
										maxLength={15}
									/>
								</div>
								<Button
									type="submit"
									variant="outline"
									size="sm"
									className="h-9 px-3 text-xs font-bold"
									disabled={!couponCode.trim()}
								>
									Aplicar
								</Button>
							</div>
							{couponError && (
								<span className="text-destructive text-[11px] font-medium">
									{couponError}
								</span>
							)}
							<span className="text-muted-foreground/80 text-[11px]">
								Dica: Use <strong>PASTEL10</strong> para 10% de desconto
							</span>
						</form>
					)}
				</div>

				<Separator />

				{/* Total Highlight */}
				<div className="bg-muted/40 border-border/60 flex items-center justify-between rounded-xl border p-4">
					<div className="flex flex-col">
						<span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
							Valor Total
						</span>
						<span className="text-muted-foreground text-[11px]">
							{deliveryType === "delivery" ? "Em até 40 min" : "Pronto em 15 min"}
						</span>
					</div>
					<span className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
						{formatPrice(total)}
					</span>
				</div>

				{/* Main Action Button */}
				<Button
					type="button"
					size="lg"
					disabled={disabled || subtotal === 0}
					onClick={onOpenCheckout}
					className="h-12 w-full gap-2 rounded-xl text-base font-extrabold shadow-md transition-all hover:shadow-lg"
				>
					<span>Finalizar Pedido</span>
					<ArrowRight className="h-4 w-4" />
				</Button>

				{/* Continue Shopping Button */}
				<Button
					type="button"
					variant="ghost"
					nativeButton={false}
					size="sm"
					className="text-muted-foreground hover:text-foreground h-9 font-semibold"
					render={<Link href="/" />}
				>
					Continuar Comprando
				</Button>

				{/* Trust Badges */}
				<div className="bg-muted/30 border-border/40 mt-1 flex flex-col gap-2 rounded-xl border p-3 text-xs text-muted-foreground">
					<div className="flex items-center gap-2">
						<Flame className="h-4 w-4 text-amber-500 shrink-0" />
						<span>Pastel frito na hora com massa artesanal</span>
					</div>
					<div className="flex items-center gap-2">
						<ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
						<span>Pagamento seguro e protegido na entrega ou PIX</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
