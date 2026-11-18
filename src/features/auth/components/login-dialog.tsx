"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, LogIn, Mail } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { FieldInput } from "@/components/inputs/field-input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
	type LoginFormValues,
	loginSchema,
} from "@/features/auth/schemas/login.schema";

export const LoginDialog = () => {
	const { login, isLoggingIn, loginError, clearLoginError } = useAuth();
	const [open, setOpen] = React.useState(false);
	const [showPassword, setShowPassword] = React.useState(false);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleOpenChange = React.useCallback(
		(next: boolean) => {
			if (!next) {
				reset();
				clearLoginError();
				setShowPassword(false);
			}
			setOpen(next);
		},
		[reset, clearLoginError],
	);

	const onSubmit = React.useCallback(
		async (data: LoginFormValues) => {
			const result = await login(data);
			if (result.success) {
				handleOpenChange(false);
			}
		},
		[login, handleOpenChange],
	);

	const togglePasswordVisibility = React.useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className="gap-1.5 font-semibold"
					/>
				}
			>
				<LogIn className="size-3.5" />
				<span>Entrar</span>
			</DialogTrigger>

			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<div className="bg-primary/10 text-primary mb-1 flex h-10 w-10 items-center justify-center rounded-xl">
						<KeyRound className="size-5" />
					</div>
					<DialogTitle className="text-base font-bold">
						Acesse sua conta
					</DialogTitle>
					<DialogDescription className="text-xs">
						Entre com seu e-mail e senha para continuar.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
					<FieldInput
						control={control}
						name="email"
						label="E-mail"
						required
						type="email"
						placeholder="seu@email.com"
						autoComplete="email"
						error={errors.email?.message}
						startAddon={
							<Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
						}
						className="pl-8"
					/>

					<FieldInput
						control={control}
						name="password"
						label="Senha"
						required
						type={showPassword ? "text" : "password"}
						placeholder="••••••••"
						autoComplete="current-password"
						error={errors.password?.message}
						startAddon={
							<KeyRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
						}
						className="pr-9 pl-8"
						labelRight={
							<button
								type="button"
								onClick={togglePasswordVisibility}
								className="text-muted-foreground hover:text-foreground transition-colors"
								aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
							>
								{showPassword ? (
									<EyeOff className="size-3.5" />
								) : (
									<Eye className="size-3.5" />
								)}
							</button>
						}
					/>

					{loginError && (
						<p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-xs font-medium">
							{loginError}
						</p>
					)}

					<DialogFooter className="mx-0 mt-1 mb-0 rounded-none border-0 bg-transparent p-0">
						<Button
							type="submit"
							disabled={isLoggingIn}
							className="w-full gap-2 font-bold"
						>
							<LogIn className="size-4" />
							{isLoggingIn ? "Entrando..." : "Entrar"}
						</Button>
					</DialogFooter>
				</form>

				<div className="text-muted-foreground mt-1 text-center text-[11px]">
					Não tem uma conta?{" "}
					<a
						href="/cadastro"
						className="text-primary font-semibold hover:underline"
					>
						Cadastre-se
					</a>
				</div>
			</DialogContent>
		</Dialog>
	);
};
