import Card from './Card';

interface KPIBoxProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
}

export default function KPIBox({ title, value, subtitle, trend }: KPIBoxProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-default">
      <p className="text-[10px] font-semibold text-[#3A2F2F]/40 uppercase tracking-widest mb-3">
        {title}
      </p>
      <p className="text-3xl font-semibold text-[#3A2F2F] tracking-tight mb-1">{value}</p>
      {subtitle && <p className="text-xs text-[#3A2F2F]/40 mb-3">{subtitle}</p>}
      {trend !== undefined && (
        <span
          className={`text-[10px] font-semibold px-2 py-1 rounded-full inline-block ${
            trend >= 0 ? 'bg-[#A8C3A0]/20 text-[#4A7A42]' : 'bg-[#F4B8A8]/30 text-[#B05040]'
          }`}
        >
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs prior period
        </span>
      )}
    </Card>
  );
}
