export const formatPrice = (price: number | string): string => {
	const numericPrice =
		typeof price === "number"
			? price
			: Number.parseFloat(
					price.includes(",")
						? price.replace(/\./g, "").replace(",", ".")
						: price,
				);

	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(Number.isNaN(numericPrice) ? 0 : numericPrice);
};
