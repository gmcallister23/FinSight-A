import type { Holding } from "../types/portfolio";
import { StockQuote } from "../types/stock";
import HoldingCard from "./HoldingCard";

interface HoldingListProps {
    holdings: Holding[];
    portfolioId: string;
    quotes: Record<string, StockQuote>;
    onDelete: (holding: Holding) => void;
}

export default function HoldingList({
    holdings,
    portfolioId,
    quotes,
    onDelete
}: HoldingListProps) {
    if (holdings.length === 0) {
        return (
            <p>
                No holdings yet.
            </p>
        );
    }

    return (
        <div className="overflow-hiddedn rounded-xl border border-slate-700 bg-slate-900">
           
            <div className="grid grid-cols-6 border-b border-slate-700 px-4 py-3 text-sm font-semibold text-slate-400">
                <span>Symbol</span>
                <span>Shares</span>
                <span>Avg Cost</span>
                <span>Value</span>
                <span></span>
            </div>
            {holdings.map((holding) => (
                <HoldingCard
                key={holding.id}
                holding={holding}
                portfolioId={portfolioId}
                quote={quotes[holding.symbol]}
                onDelete={onDelete}
                />
            ))}
            
        </div>
    )
}