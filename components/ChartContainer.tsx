import { ReactNode } from 'react';
import Card from './Card';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function ChartContainer({ title, subtitle, children }: ChartContainerProps) {
  return (
    <Card>
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[#3A2F2F]">{title}</h3>
        {subtitle && <p className="text-xs text-[#3A2F2F]/40 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}
