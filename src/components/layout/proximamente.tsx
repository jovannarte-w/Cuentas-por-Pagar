import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function Proximamente({
  icon: Icon,
  titulo,
  descripcion,
  fase,
}: {
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
  fase: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center text-center gap-3 py-16">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-6" />
        </div>
        <h2 className="text-lg font-semibold">{titulo}</h2>
        <p className="text-sm text-muted-foreground max-w-md">{descripcion}</p>
        <span className="text-xs font-mono text-muted-foreground/70 mt-2">{fase}</span>
      </CardContent>
    </Card>
  );
}
