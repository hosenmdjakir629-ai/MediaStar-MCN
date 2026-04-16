import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
}

export function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <Card className="bg-[#141414] border-[#262626] text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#A1A1A1]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-[#FF2D2D] font-medium">{trend}</p>
      </CardContent>
    </Card>
  );
}
