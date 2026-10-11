export const formatPrice = (price: number | string): string => {
	const numericPrice =
		typeof price === "number"
			? price
			: Number.parseFloat(price.replace(/\./g, "").replace(",", "."));

	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(Number.isNaN(numericPrice) ? 0 : numericPrice);
};
