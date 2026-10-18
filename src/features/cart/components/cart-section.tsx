"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CartCheckoutDialog } from "@/features/cart/components/cart-checkout-dialog";
import { CartEmpty } from "@/features/cart/components/cart-empty";
import { CartItemList } from "@/features/cart/components/cart-item-list";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { useCart } from "@/features/cart/hooks/use-cart";

export const CartSection = () => {
	const {
		isHydrated,
		items,
		totalItems,
		subtotal,
		deliveryFee,
		remainingForFreeDelivery,
		deliveryType,
		setDeliveryType,
		couponCode,
		setCouponCode,
		appliedCoupon,
		couponError,
		discount,
		total,
		updateQuantity,
		removeItem,
		updateObservation,
		clearCart,
		applyCoupon,
		removeCoupon,
		checkoutOrder,
	} = useCart();

	const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

	if (!isHydrated) {
		return (
			<div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-8">
					<Skeleton className="h-8 w-48 rounded-lg" />
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
						<div className="flex flex-col gap-4 lg:col-span-8">
							<Skeleton className="h-24 w-full rounded-2xl" />
							<Skeleton className="h-28 w-full rounded-xl" />
							<Skeleton className="h-28 w-full rounded-xl" />
						</div>
						<div className="lg:col-span-4">
							<Skeleton className="h-96 w-full rounded-2xl" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
			{/* Breadcrumb Navigation */}
			<div className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
				<Link href="/" className="hover:text-foreground transition-colors">
					Início
				</Link>
				<span>/</span>
				<span className="text-foreground font-semibold">Carrinho de Compras</span>
			</div>

			{/* Section Header */}
			<div className="mb-8 flex flex-col gap-2">
				<div className="text-primary flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
					<ShoppingBag className="h-4 w-4" />
					<span>Meu Pedido</span>
				</div>
				<h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
					Carrinho de Compras
				</h1>
				<p className="text-muted-foreground text-sm sm:text-base">
					Confira seus itens, escolha a entrega e finalize seu pedido com rapidez.
				</p>
			</div>

			{/* Cart Content: Empty or Items */}
			{items.length === 0 ? (
				<CartEmpty />
			) : (
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
					{/* Left: Items List */}
					<div className="lg:col-span-7 xl:col-span-8">
						<CartItemList
							items={items}
							totalItems={totalItems}
							subtotal={subtotal}
							remainingForFreeDelivery={remainingForFreeDelivery}
							onUpdateQuantity={updateQuantity}
							onRemove={removeItem}
							onUpdateObservation={updateObservation}
							onClearCart={clearCart}
						/>
					</div>

					{/* Right: Summary Card */}
					<div className="lg:col-span-5 xl:col-span-4">
						<CartSummary
							subtotal={subtotal}
							deliveryFee={deliveryFee}
							discount={discount}
							total={total}
							deliveryType={deliveryType}
							setDeliveryType={setDeliveryType}
							couponCode={couponCode}
							setCouponCode={setCouponCode}
							appliedCoupon={appliedCoupon}
							couponError={couponError}
							onApplyCoupon={applyCoupon}
							onRemoveCoupon={removeCoupon}
							onOpenCheckout={() => setIsCheckoutOpen(true)}
						/>
					</div>
				</div>
			)}

			{/* Checkout Dialog */}
			<CartCheckoutDialog
				isOpen={isCheckoutOpen}
				onClose={() => setIsCheckoutOpen(false)}
				deliveryType={deliveryType}
				subtotal={subtotal}
				deliveryFee={deliveryFee}
				discount={discount}
				total={total}
				onCheckout={checkoutOrder}
			/>
		</section>
	);
};
