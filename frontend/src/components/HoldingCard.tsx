import type { Holding } from "../types/portfolio";
import { useAppDispatch } from "../app/hooks";
import { updateHolding } from "../features/portfolio/portfolioSlice";
import { useState } from "react";
import UpdateHoldingForm from "./UpdateHoldingForm";
import type { StockQuote } from "../types/stock";

interface HoldingCardProps {
    holding: Holding;
    portfolioId: string;
    quote?: StockQuote;
    onDelete: (holding: Holding) => void;
}

export default function HoldingCard({
    holding,
    portfolioId,
    quote,
    onDelete,
}: HoldingCardProps){

    const [editingHolding, setEditingHolding] = useState(false);
    
    const currentPrice = quote?.price ?? 0;
    const marketValue = holding.quantity * currentPrice;

    return (
        <div className="grid grid-cols-6 items-center border border-slate-800 bg-slate-900 px-4 py-3 transition hover:border-slate-700 hover:bg-slate-500">
            <div className="font-semibold">
                {holding.symbol}
            </div>
            <div>
                Quantity: {Number(holding.quantity).toFixed(0)}
            </div>
            <div>
                Average Cost: ${Number(holding.avg_cost).toFixed(2)}
            </div>
            <div>
                {marketValue.toFixed(2)}
            </div>

            <button 
            className="rounded-lg px-3 py-1 text-sm text-cyan-400 hover:bg-cyan-500 hover:text-white"
            onClick={() => setEditingHolding(true)}>
                Edit
            </button>

            <button className="rounded-lg px-3 py-1 text-sm text-red-400 hover:bg-red-500 hover:text-white"
            onClick={() => onDelete(holding)}>
                Delete
            </button>

            {editingHolding && (
                <UpdateHoldingForm
                portfolioId={portfolioId}
                holding={holding}
                onClose={() => setEditingHolding(false)}
            />
            )}
        </div>                    
    )

}