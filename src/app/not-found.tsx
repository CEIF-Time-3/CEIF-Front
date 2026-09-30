"use client";

import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12 text-center sm:px-6 lg:px-8">
			<div className="mx-auto flex max-w-md flex-col items-center gap-6">
				{/* 404 Icon & Badge */}
				<div className="flex aspect-square size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
					<FileQuestion className="size-10" />
				</div>

				{/* Title and Description */}
				<div className="space-y-2">
					<span className="font-semibold text-primary text-xs uppercase tracking-widest">
						Erro 404
					</span>
					<h1 className="font-extrabold text-3xl tracking-tight text-foreground sm:text-4xl">
						Página não encontrada
					</h1>
					<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
						A página que você está procurando não existe, foi movida ou está
						temporariamente indisponível.
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<Button
						variant="outline"
						size="lg"
						className="gap-2"
						onClick={() => router.back()}
					>
						<ArrowLeft className="size-4" />
						Voltar
					</Button>

					<Button
						nativeButton={false}
						size="lg"
						className="gap-2"
						render={<Link href="/" />}
					>
						<Home className="size-4" />
						Início
					</Button>
				</div>
			</div>
		</div>
	);
}
