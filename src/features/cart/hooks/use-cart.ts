import React from "react";
import type { CheckoutFormValues } from "@/features/cart/schemas/cart.schema";
import { cartService } from "@/features/cart/services/cart.service";
import { useCartStore } from "@/features/cart/stores/cart.store";
import type { Result } from "@/types/result";

export const FREE_DELIVERY_THRESHOLD = 50.0;
export const STANDARD_DELIVERY_FEE = 7.0;

export const useCart = () => {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateObservation = useCartStore((state) => state.updateObservation);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isHydrated, setIsHydrated] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [deliveryType, setDeliveryType] = React.useState<
    "delivery" | "takeaway"
  >("delivery");
  const [isSubmittingOrder, setIsSubmittingOrder] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const currentItems = isHydrated ? items : [];

  const totalItems = React.useMemo(() => {
    return currentItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [currentItems]);

  const subtotal = React.useMemo(() => {
    return currentItems.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
  }, [currentItems]);

  const deliveryFee = React.useMemo(() => {
    if (subtotal === 0 || deliveryType === "takeaway") return 0;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
    return STANDARD_DELIVERY_FEE;
  }, [subtotal, deliveryType]);

  const remainingForFreeDelivery = React.useMemo(() => {
    if (deliveryType === "takeaway" || subtotal >= FREE_DELIVERY_THRESHOLD)
      return 0;
    return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  }, [subtotal, deliveryType]);

  const discount = React.useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === "PASTEL10") {
      return subtotal * 0.1;
    }
    if (appliedCoupon === "BEMVINDO") {
      return Math.min(subtotal, 5.0);
    }
    return 0;
  }, [subtotal, appliedCoupon]);

  const total = React.useMemo(() => {
    const calculated = subtotal + deliveryFee - discount;
    return Math.max(0, calculated);
  }, [subtotal, deliveryFee, discount]);

  const applyCoupon = React.useCallback((code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setCouponError("Informe um código de cupom");
      return false;
    }
    if (clean === "PASTEL10" || clean === "BEMVINDO") {
      setAppliedCoupon(clean);
      setCouponError(null);
      return true;
    }
    setCouponError("Cupom inválido ou expirado");
    return false;
  }, []);

  const removeCoupon = React.useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  }, []);

  const checkoutOrder = React.useCallback(
    async (
      customer: CheckoutFormValues
    ): Promise<
      Result<{ orderId: string; message: string; createdAt: string }, string>
    > => {
      setIsSubmittingOrder(true);
      try {
        const result = await cartService.createOrder({
          customer,
          items: currentItems,
          subtotal,
          deliveryFee,
          discount,
          total,
        });

        if (result.success) {
          clearCart();
        }
        return result;
      } finally {
        setIsSubmittingOrder(false);
      }
    },
    [currentItems, subtotal, deliveryFee, discount, total, clearCart]
  );

  return {
    isHydrated,
    items: currentItems,
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
    isSubmittingOrder,
    addItem,
    removeItem,
    updateQuantity,
    updateObservation,
    clearCart,
    applyCoupon,
    removeCoupon,
    checkoutOrder,
  };
};
