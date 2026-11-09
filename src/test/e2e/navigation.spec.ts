import { expect, test } from "@playwright/test";

test.describe("Client navigation", () => {
	test("renders the home page hero", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});

	test("renders the sign-up button", async ({ page }) => {
		await page.goto("/");

		const signUpButton = page.getByRole("button", { name: /cadastre-se/i });
		await expect(signUpButton).toBeVisible();
		await signUpButton.click();

		await expect(page).toHaveURL(/\/cadastro$/);
		await expect(page.locator("body")).toBeVisible();
	});

	test("navigates to the cart page", async ({ page }) => {
		await page.goto("/");

		const viewMenuButton = page.getByRole("link", { name: /carrinho/i });
		await expect(viewMenuButton).toBeVisible();
		await viewMenuButton.click();

		await expect(page).toHaveURL(/\/carrinho$/);
		await expect(page.locator("body")).toBeVisible();
	});
});
