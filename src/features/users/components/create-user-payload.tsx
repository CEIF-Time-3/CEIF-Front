import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
	CreateAdminUserPayload,
	CreateUserPayload,
} from "@/features/users/schemas/create-user.schema";

interface CreateUserPayloadProps {
	payload: CreateUserPayload | CreateAdminUserPayload;
	onEdit: () => void;
	onRestart: () => void;
}

export const CreateUserPayloadView = ({
	payload,
	onEdit,
	onRestart,
}: CreateUserPayloadProps) => (
	<section
		aria-labelledby="payload-title"
		className="space-y-4 px-6 py-6 sm:px-8 sm:py-8"
	>
		<div className="flex items-start gap-3">
			<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
				<Check className="size-5" />
			</span>
			<div>
				<h3 className="font-bold" id="payload-title">
					Payload pronto
				</h3>
				<p className="text-sm text-muted-foreground">
					Nenhuma requisição foi enviada. Confira os dados que serão
					encaminhados à API.
				</p>
			</div>
		</div>
		<pre className="max-h-64 overflow-auto rounded-lg border bg-muted/50 p-4 text-xs leading-relaxed">
			{JSON.stringify(payload, null, 2)}
		</pre>
		<div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-between">
			<Button onClick={onRestart} type="button" variant="ghost">
				Novo cadastro
			</Button>
			<Button onClick={onEdit} type="button" variant="outline">
				<ArrowLeft className="size-4" />
				Editar dados
			</Button>
		</div>
	</section>
);
