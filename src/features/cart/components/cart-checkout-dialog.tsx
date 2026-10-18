"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Banknote,
	CheckCircle2,
	CreditCard,
	QrCode,
	ShoppingBag,
	Truck,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
	type CheckoutFormValues,
	checkoutSchema,
} from "@/features/cart/schemas/cart.schema";
import type { Result } from "@/types/result";
import { formatPrice } from "@/utils";

interface CartCheckoutDialogProps {
	isOpen: boolean;
	onClose: () => void;
	deliveryType: "delivery" | "takeaway";
	subtotal: number;
	deliveryFee: number;
	discount: number;
	total: number;
	onCheckout: (
		customer: CheckoutFormValues,
	) => Promise<Result<{ orderId: string; message: string; createdAt: string }, string>>;
}

export const CartCheckoutDialog = ({
	isOpen,
	onClose,
	deliveryType,
	subtotal,
	deliveryFee,
	discount,
	total,
	onCheckout,
}: CartCheckoutDialogProps) => {
	const [confirmedOrder, setConfirmedOrder] = React.useState<{
		orderId: string;
		message: string;
		createdAt: string;
	} | null>(null);
	const [checkoutError, setCheckoutError] = React.useState<string | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			customerName: "",
			customerPhone: "",
			deliveryType,
			street: "",
			number: "",
			neighborhood: "",
			complement: "",
			paymentMethod: "pix",
			changeFor: "",
			observation: "",
		},
	});

	// Keep form deliveryType in sync with the prop
	React.useEffect(() => {
		setValue("deliveryType", deliveryType);
	}, [deliveryType, setValue]);

	const selectedPaymentMethod = watch("paymentMethod");
	const isTakeaway = watch("deliveryType") === "takeaway";

	const onSubmit = async (data: CheckoutFormValues) => {
		setCheckoutError(null);
		const result = await onCheckout(data);
		if (result.success) {
			setConfirmedOrder(result.data);
		} else {
			setCheckoutError(result.error);
		}
	};

	const handleDialogClose = (open: boolean) => {
		if (!open) {
			if (confirmedOrder) {
				setConfirmedOrder(null);
				reset();
			}
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleDialogClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
				{confirmedOrder ? (
					// Success State
					<div className="flex flex-col items-center justify-center py-6 text-center">
						<div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
							<CheckCircle2 className="h-10 w-10" />
						</div>

						<DialogTitle className="text-foreground text-2xl font-black">
							Pedido Confirmado!
						</DialogTitle>

						<DialogDescription className="mt-2 text-sm">
							Recebemos o seu pedido e já vamos iniciar o preparo dos seus pastéis!
						</DialogDescription>

						<div className="bg-muted/50 border-border/70 my-6 w-full rounded-2xl border p-4 text-left">
							<div className="flex items-center justify-between border-b pb-2 text-sm">
								<span className="text-muted-foreground font-medium">
									Identificador do Pedido:
								</span>
								<span className="text-foreground font-mono font-bold">
									{confirmedOrder.orderId}
								</span>
							</div>

							<div className="flex items-center justify-between pt-2 text-sm">
								<span className="text-muted-foreground font-medium">Total:</span>
								<span className="text-foreground font-black text-base">
									{formatPrice(total)}
								</span>
							</div>

							<div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
								<span>Status:</span>
								<span className="text-amber-600 dark:text-amber-400 font-bold">
									Em preparação na cozinha 🔥
								</span>
							</div>
						</div>

						<div className="flex w-full flex-col gap-2">
							<Button
								type="button"
								nativeButton={false}
								size="lg"
								className="h-11 w-full gap-2 font-bold"
								render={<Link href="/" onClick={() => handleDialogClose(false)} />}
							>
								<ShoppingBag className="h-4 w-4" />
								<span>Voltar para o Cardápio</span>
							</Button>
						</div>
					</div>
				) : (
					// Checkout Form
					<form
						onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
							handleSubmit(onSubmit)(e);
						}}
						className="flex flex-col gap-5"
					>
						<DialogHeader>
							<DialogTitle className="text-xl font-bold">
								Finalizar Pedido
							</DialogTitle>
							<DialogDescription>
								Informe seus dados de contato e endereço para entrega ou retirada.
							</DialogDescription>
						</DialogHeader>

						{checkoutError && (
							<div className="bg-destructive/10 text-destructive rounded-lg p-3 text-xs font-semibold">
								{checkoutError}
							</div>
						)}

						{/* Customer Info Section */}
						<div className="flex flex-col gap-3">
							<h4 className="text-foreground text-xs font-bold tracking-wide uppercase">
								1. Dados de Contato
							</h4>

							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
								<div className="flex flex-col gap-1">
									<Label htmlFor="customerName" className="text-xs font-semibold">
										Seu Nome *
									</Label>
									<Input
										id="customerName"
										placeholder="Ex: Maria da Silva"
										{...register("customerName")}
										className="h-9 text-xs"
										aria-invalid={Boolean(errors.customerName)}
									/>
									{errors.customerName && (
										<span className="text-destructive text-[11px]">
											{errors.customerName.message}
										</span>
									)}
								</div>

								<div className="flex flex-col gap-1">
									<Label htmlFor="customerPhone" className="text-xs font-semibold">
										WhatsApp / Telefone *
									</Label>
									<Input
										id="customerPhone"
										placeholder="(11) 98765-4321"
										{...register("customerPhone")}
										className="h-9 text-xs"
										aria-invalid={Boolean(errors.customerPhone)}
									/>
									{errors.customerPhone && (
										<span className="text-destructive text-[11px]">
											{errors.customerPhone.message}
										</span>
									)}
								</div>
							</div>
						</div>

						<Separator />

						{/* Delivery Address Section (if delivery) */}
						{!isTakeaway ? (
							<div className="flex flex-col gap-3">
								<h4 className="text-foreground text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
									<Truck className="h-3.5 w-3.5 text-primary" />
									<span>2. Endereço de Entrega</span>
								</h4>

								<div className="grid grid-cols-3 gap-3">
									<div className="col-span-2 flex flex-col gap-1">
										<Label htmlFor="street" className="text-xs font-semibold">
											Rua / Avenida *
										</Label>
										<Input
											id="street"
											placeholder="Ex: Rua das Flores"
											{...register("street")}
											className="h-9 text-xs"
											aria-invalid={Boolean(errors.street)}
										/>
										{errors.street && (
											<span className="text-destructive text-[11px]">
												{errors.street.message}
											</span>
										)}
									</div>

									<div className="col-span-1 flex flex-col gap-1">
										<Label htmlFor="number" className="text-xs font-semibold">
											Número *
										</Label>
										<Input
											id="number"
											placeholder="123"
											{...register("number")}
											className="h-9 text-xs"
											aria-invalid={Boolean(errors.number)}
										/>
										{errors.number && (
											<span className="text-destructive text-[11px]">
												{errors.number.message}
											</span>
										)}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="flex flex-col gap-1">
										<Label htmlFor="neighborhood" className="text-xs font-semibold">
											Bairro *
										</Label>
										<Input
											id="neighborhood"
											placeholder="Ex: Centro"
											{...register("neighborhood")}
											className="h-9 text-xs"
											aria-invalid={Boolean(errors.neighborhood)}
										/>
										{errors.neighborhood && (
											<span className="text-destructive text-[11px]">
												{errors.neighborhood.message}
											</span>
										)}
									</div>

									<div className="flex flex-col gap-1">
										<Label htmlFor="complement" className="text-xs font-semibold">
											Complemento
										</Label>
										<Input
											id="complement"
											placeholder="Apto 12, Bloco B"
											{...register("complement")}
											className="h-9 text-xs"
										/>
									</div>
								</div>
							</div>
						) : (
							<div className="bg-muted/40 border-border/80 flex items-center gap-3 rounded-xl border p-3 text-xs">
								<ShoppingBag className="text-primary h-5 w-5 shrink-0" />
								<div>
									<p className="font-bold text-foreground">Retirada no Balcão</p>
									<p className="text-muted-foreground">
										Seu pedido estará pronto para retirada em nosso balcão em
										aproximadamente 15 a 20 minutos.
									</p>
								</div>
							</div>
						)}

						<Separator />

						{/* Payment Method */}
						<div className="flex flex-col gap-3">
							<h4 className="text-foreground text-xs font-bold tracking-wide uppercase">
								{isTakeaway ? "2. Forma de Pagamento" : "3. Forma de Pagamento"}
							</h4>

							<div className="grid grid-cols-3 gap-2">
								<button
									type="button"
									onClick={() => setValue("paymentMethod", "pix")}
									className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
										selectedPaymentMethod === "pix"
											? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
											: "border-border hover:bg-muted text-muted-foreground"
									}`}
								>
									<QrCode className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
									<span>PIX</span>
								</button>

								<button
									type="button"
									onClick={() => setValue("paymentMethod", "card")}
									className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
										selectedPaymentMethod === "card"
											? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
											: "border-border hover:bg-muted text-muted-foreground"
									}`}
								>
									<CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
									<span>Cartão</span>
								</button>

								<button
									type="button"
									onClick={() => setValue("paymentMethod", "cash")}
									className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
										selectedPaymentMethod === "cash"
											? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
											: "border-border hover:bg-muted text-muted-foreground"
									}`}
								>
									<Banknote className="h-5 w-5 text-amber-600 dark:text-amber-400" />
									<span>Dinheiro</span>
								</button>
							</div>

							{selectedPaymentMethod === "cash" && (
								<div className="flex flex-col gap-1 pt-1">
									<Label htmlFor="changeFor" className="text-xs font-semibold">
										Precisa de troco para quanto? (Opcional)
									</Label>
									<Input
										id="changeFor"
										placeholder="Ex: R$ 50,00"
										{...register("changeFor")}
										className="h-9 text-xs"
									/>
								</div>
							)}
						</div>

						{/* Observations */}
						<div className="flex flex-col gap-1">
							<Label htmlFor="observation" className="text-xs font-semibold">
								Instruções especiais de entrega ou observações
							</Label>
							<Textarea
								id="observation"
								placeholder="Ex: Tocar a campainha, deixar na portaria..."
								{...register("observation")}
								className="text-xs resize-none"
								rows={2}
							/>
						</div>

						{/* Order Summary Mini Box */}
						<div className="bg-muted/50 border-border/60 flex flex-col gap-1.5 rounded-xl border p-3 text-xs">
							<div className="flex items-center justify-between text-muted-foreground">
								<span>Subtotal:</span>
								<span>{formatPrice(subtotal)}</span>
							</div>
							<div className="flex items-center justify-between text-muted-foreground">
								<span>Entrega:</span>
								<span>{deliveryFee === 0 ? "Grátis" : formatPrice(deliveryFee)}</span>
							</div>
							{discount > 0 && (
								<div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
									<span>Desconto:</span>
									<span>- {formatPrice(discount)}</span>
								</div>
							)}
							<div className="border-border/60 flex items-center justify-between border-t pt-1.5 text-sm">
								<span className="font-semibold text-muted-foreground">Total a pagar:</span>
								<span className="font-extrabold text-foreground text-base">
									{formatPrice(total)}
								</span>
							</div>
						</div>

						<DialogFooter className="gap-2 sm:gap-0">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleDialogClose(false)}
								disabled={isSubmitting}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="font-bold h-10 px-6"
							>
								{isSubmitting ? "Enviando Pedido..." : "Confirmar e Enviar Pedido"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
};
