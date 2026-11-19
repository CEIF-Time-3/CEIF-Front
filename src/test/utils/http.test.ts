import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError, http } from "@/utils/http";

describe("http", () => {
	const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

	beforeEach(() => {
		vi.restoreAllMocks();
		delete process.env.NEXT_PUBLIC_API_URL;
	});

	afterEach(() => {
		if (originalApiUrl !== undefined) {
			process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
		} else {
			delete process.env.NEXT_PUBLIC_API_URL;
		}
		vi.restoreAllMocks();
	});

	it("sends request with default baseUrl and JSON content-type", async () => {
		const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		const result = await http<{ ok: boolean }>("/health");

		expect(result).toEqual({ ok: true });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("http://localhost:3000/api/health");
		const headers = init?.headers as Headers | undefined;
		expect(headers?.get("Content-Type")).toBe("application/json");
	});

	it("uses NEXT_PUBLIC_API_URL and preserves custom Content-Type header", async () => {
		process.env.NEXT_PUBLIC_API_URL = "https://api.ceif.test";
		const fetchMock = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(
				new Response(JSON.stringify({ id: "1" }), { status: 200 }),
			);

		await http("/upload", {
			method: "POST",
			headers: { "Content-Type": "text/plain", Authorization: "Bearer tok" },
		});

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("https://api.ceif.test/upload");
		const headers = init?.headers as Headers;
		expect(headers.get("Content-Type")).toBe("text/plain");
		expect(headers.get("Authorization")).toBe("Bearer tok");
	});

	it("returns empty object on 204 No Content", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(null, { status: 204 }),
		);

		const result = await http<Record<string, never>>("/items/1", {
			method: "DELETE",
		});

		expect(result).toEqual({});
	});

	it("throws HttpError with JSON error message when response is not ok", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ message: "Não autorizado" }), {
				status: 401,
				statusText: "Unauthorized",
			}),
		);

		await expect(http("/private")).rejects.toMatchObject({
			status: 401,
			message: "Não autorizado",
			data: { message: "Não autorizado" },
		});
	});

	it("falls back to default message when error JSON has no message", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ success: false }), {
				status: 400,
				statusText: "Bad Request",
			}),
		);

		try {
			await http("/bad");
			expect.unreachable("Should have thrown HttpError");
		} catch (error) {
			expect(error).toBeInstanceOf(HttpError);
			expect(error).toMatchObject({
				status: 400,
				message: "Erro na requisição",
			});
		}
	});

	it("falls back to statusText when error response is not valid JSON", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response("Internal failure", {
				status: 500,
				statusText: "Internal Server Error",
			}),
		);

		await expect(http("/boom")).rejects.toMatchObject({
			status: 500,
			message: "Internal Server Error",
		});
	});
});
