import { useMemo } from 'react';

/**
 * @param {{ label: string, revenue: number }[]} data — last N months, oldest → newest
 * @param {boolean} loading
 * @param {number} maxRevenue — precomputed max for scale (dashboard uses Math.max(..., 1))
 */
export default function AdminRevenueChart({ data = [], loading, maxRevenue }) {
  const chart = useMemo(() => {
    const n = data.length;
    if (n === 0) return null;
    const revenues = data.map((d) => Number(d.revenue) || 0);
    const max = Math.max(maxRevenue || 0, ...revenues, 1);
    const w = 640;
    const h = 220;
    const pad = { t: 20, r: 16, b: 44, l: 36 };
    const iw = w - pad.l - pad.r;
    const ih = h - pad.t - pad.b;
    const points = revenues.map((rev, i) => {
      const x = pad.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
      const y = pad.t + ih * (1 - rev / max);
      return { x, y, rev, label: data[i].label };
    });
    const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaD = `${lineD} L ${points[points.length - 1].x.toFixed(1)} ${(pad.t + ih).toFixed(1)} L ${points[0].x.toFixed(1)} ${(pad.t + ih).toFixed(1)} Z`;
    const gridYs = [0, 0.25, 0.5, 0.75, 1].map((g) => pad.t + ih * (1 - g));
    const yTicks = [1, 0.5, 0].map((ratio) => ({
      y: pad.t + ih * (1 - ratio),
      val: max * ratio,
    }));
    return { w, h, pad, points, lineD, areaD, gridYs, yTicks, max };
  }, [data, maxRevenue]);

  if (loading) {
    return (
      <div className="w-full h-[200px] sm:h-[220px] rounded-xl bg-primary-50/50 border border-primary-100 animate-pulse" />
    );
  }

  if (!chart) {
    return (
      <div className="flex items-center justify-center h-36 text-primary-500 text-sm rounded-xl border border-dashed border-primary-200">
        No data to chart
      </div>
    );
  }

  const { w, h, pad, points, lineD, areaD, gridYs, yTicks, max } = chart;
  const formatAxis = (v) => {
    if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
    if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return String(Math.round(v));
  };

  return (
    <div className="w-full -mx-1 sm:mx-0">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto max-h-[240px]"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Revenue trend over the last six months"
      >
        <defs>
          <linearGradient id="adminRevArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(22 163 74)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(22 163 74)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {gridYs.map((gy, i) => (
          <line
            key={i}
            x1={pad.l}
            y1={gy}
            x2={w - pad.r}
            y2={gy}
            stroke="rgb(226 232 240)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}
        {yTicks.map((t, i) => (
          <text
            key={i}
            x={4}
            y={t.y + 4}
            className="fill-primary-400"
            style={{ fontSize: '10px', fontWeight: 600 }}
          >
            {formatAxis(t.val)}
          </text>
        ))}
        <path d={areaD} fill="url(#adminRevArea)" />
        <path
          d={lineD}
          fill="none"
          stroke="rgb(22 101 52)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => {
          const isLast = i === points.length - 1;
          return (
            <g key={p.label}>
              <title>{`Rs. ${p.rev.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}</title>
              <circle
                cx={p.x}
                cy={p.y}
                r={isLast ? 5 : 4}
                fill={isLast ? 'rgb(22 163 74)' : 'white'}
                stroke="rgb(22 101 52)"
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={h - 12}
                textAnchor="middle"
                className={isLast ? 'fill-primary-800' : 'fill-primary-500'}
                style={{ fontSize: '11px', fontWeight: isLast ? 700 : 600 }}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
