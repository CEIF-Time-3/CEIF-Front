import { Check, MapPin, UserRound } from "lucide-react";

export type CreateUserStep = 0 | 1;

interface CreateUserStepsProps {
	activeStep: CreateUserStep;
	canOpenAddress: boolean;
	onStepChange: (step: CreateUserStep) => void;
}

const steps = [
	{ step: 0, label: "Cadastro pessoal", icon: UserRound },
	{ step: 1, label: "Endereço", icon: MapPin },
] as const;

export const CreateUserSteps = ({
	activeStep,
	canOpenAddress,
	onStepChange,
}: CreateUserStepsProps) => (
	<div
		aria-label="Etapas do cadastro"
		className="grid grid-cols-2 gap-3"
		role="tablist"
	>
		{steps.map(({ step, label, icon: Icon }, index) => {
			const isActive = activeStep === step;
			const isComplete = activeStep === 1 && step === 0;

			return (
				<button
					aria-controls={`user-step-${index}`}
					aria-selected={isActive}
					className={`flex min-h-12 items-center gap-2 rounded-lg border px-3 text-left text-xs font-semibold transition-colors sm:text-sm ${
						isActive
							? "border-primary bg-primary/15 text-foreground"
							: "border-border bg-background text-muted-foreground hover:bg-muted"
					}`}
					key={label}
					onClick={() => onStepChange(step)}
					role="tab"
					disabled={step === 1 && !canOpenAddress}
					type="button"
				>
					<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background">
						{isComplete ? (
							<Check className="size-4 text-foreground" />
						) : (
							<Icon className="size-4" />
						)}
					</span>
					<span>
						<span className="mr-1 text-[10px] uppercase tracking-wide text-muted-foreground">
							Etapa {index + 1}
						</span>
						<br />
						{label}
					</span>
				</button>
			);
		})}
	</div>
);
