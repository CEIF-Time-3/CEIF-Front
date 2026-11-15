"use client";

import {
	Banknote,
	Bike,
	CheckCircle2,
	Clock,
	CreditCard,
	Flame,
	PackageCheck,
	QrCode,
	Store,
	XCircle,
} from "lucide-react";
import type React from "react";

import { Badge } from "@/components/ui/badge";
import type {
	DeliveryType,
	OrderStatus,
	PaymentMethod,
} from "@/features/orders/schemas/orders.schema";
import { cn } from "@/lib/utils";

export const ORDER_STATUS_CONFIG: Record<
	OrderStatus,
	{
		label: string;
		badgeClassName: string;
		icon: React.ComponentType<{ className?: string }>;
		nextStatus?: OrderStatus;
		nextLabel?: string;
	}
> = {
	pending: {
		label: "Pendente",
		badgeClassName:
			"border-amber-500/25 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:text-amber-400",
		icon: Clock,
		nextStatus: "preparing",
		nextLabel: "Iniciar Preparo",
	},
	preparing: {
		label: "Em Preparo",
		badgeClassName:
			"border-blue-500/25 bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:text-blue-400",
		icon: Flame,
		nextStatus: "ready",
		nextLabel: "Marcar Pronto",
	},
	ready: {
		label: "Pronto / Saiu",
		badgeClassName:
			"border-purple-500/25 bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 dark:text-purple-400",
		icon: PackageCheck,
		nextStatus: "completed",
		nextLabel: "Concluir Pedido",
	},
	completed: {
		label: "Concluído",
		badgeClassName:
			"border-emerald-500/25 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400",
		icon: CheckCircle2,
	},
	cancelled: {
		label: "Cancelado",
		badgeClassName:
			"border-rose-500/25 bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:text-rose-400",
		icon: XCircle,
	},
};

export const DELIVERY_TYPE_CONFIG: Record<
	DeliveryType,
	{
		label: string;
		icon: React.ComponentType<{ className?: string }>;
		badgeClassName: string;
	}
> = {
	delivery: {
		label: "Entrega",
		icon: Bike,
		badgeClassName: "border-border bg-secondary/70 text-secondary-foreground",
	},
	takeaway: {
		label: "Retirada",
		icon: Store,
		badgeClassName: "border-border bg-accent/70 text-accent-foreground",
	},
};

export const PAYMENT_METHOD_CONFIG: Record<
	PaymentMethod,
	{
		label: string;
		icon: React.ComponentType<{ className?: string }>;
	}
> = {
	pix: {
		label: "PIX",
		icon: QrCode,
	},
	card: {
		label: "Cartão",
		icon: CreditCard,
	},
	cash: {
		label: "Dinheiro",
		icon: Banknote,
	},
};

interface OrderStatusBadgeProps {
	status: OrderStatus;
	className?: string;
}

export const OrderStatusBadge = ({
	status,
	className,
}: OrderStatusBadgeProps) => {
	const config = ORDER_STATUS_CONFIG[status];
	const Icon = config.icon;

	return (
		<Badge
			variant="default"
			className={cn("gap-1.5 font-semibold", config.badgeClassName, className)}
		>
			<Icon className="size-3.5" />
			<span>{config.label}</span>
		</Badge>
	);
};

interface OrderDeliveryBadgeProps {
	deliveryType: DeliveryType;
	className?: string;
}

export const OrderDeliveryBadge = ({
	deliveryType,
	className,
}: OrderDeliveryBadgeProps) => {
	const config = DELIVERY_TYPE_CONFIG[deliveryType];
	const Icon = config.icon;

	return (
		<Badge
			variant="outline"
			className={cn("gap-1 font-medium", config.badgeClassName, className)}
		>
			<Icon className="size-3" />
			<span>{config.label}</span>
		</Badge>
	);
};
