import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartCard({ title }: { title: string }) {
  return (
    <Card className="bg-[#141414] border-[#262626] text-white">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center text-[#A1A1A1]">
        {/* Recharts implementation would go here */}
        <p>Chart Placeholder</p>
      </CardContent>
    </Card>
  );
}
