import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ProductSearch = ({
  value,
  onChange,
  placeholder = "Buscar por nome, ingrediente ou categoria...",
}: ProductSearchProps) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-border bg-background focus-visible:ring-ring h-11 rounded-xl pr-9 pl-9 text-sm shadow-xs focus-visible:ring-2"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => onChange("")}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-full"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Limpar busca</span>
        </Button>
      )}
    </div>
  );
};
