// ==========================================
// GigShield AI — Tier Badge Component
// ==========================================

import { getTierInfo } from '../engine/riskEngine';

export default function TierBadge({ tier, size = 'md' }) {
    const info = getTierInfo(tier);

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${sizeClasses[size]}`}
            style={{
                backgroundColor: `${info.color}15`,
                color: info.color,
                borderColor: `${info.color}30`,
            }}
        >
            <span>{info.icon}</span>
            {info.label}
        </span>
    );
}
