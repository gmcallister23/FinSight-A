import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { addHolding } from "../features/portfolio/portfolioSlice";
import { FormEvent } from 'react';



interface AddHoldingFormProps{
    portfolioId: string;
    onClose: () => void;
}
export default function AddHoldingForm({
    
    portfolioId,
    onClose,
}: AddHoldingFormProps) {

    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [avgCost, setAvgCost] = useState(0);
    const dispatch = useAppDispatch();

    const handleSubmit = (
        e: FormEvent 
    ) => {
        e.preventDefault();

        if (!symbol || quantity <= 0 || avgCost <= 0) {
            return;
        }

        dispatch(addHolding({
            portfolioId,
            holding: {
                symbol,
                quantity,
                avg_cost:avgCost
            }
        }))

        onClose();
    };

    return (

        <form onSubmit={handleSubmit}>
            <header
            className="grid grid-cols-5 gap-4"
            >
                <p>Symbol</p>
                <p>Quantity</p>
                <p>Price</p>
                <p></p>
            </header>
            <div className="grid grid-cols-5 gap-4">
            <input
            className="border rounded-lg bg-white text-black"
            type='text'
            placeholder="Symbol"
            value={symbol}
            onChange={(e) => 
                setSymbol(
                    e.target.value.toUpperCase()
                )
            }
            />
            <input
            className="border rounded-lg bg-white text-black"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => 
                setQuantity(Number(e.target.value))
            }
            />
            <input
            className="border rounded-lg bg-white text-black"
            type='number'
            placeholder="Average Cost"
            value={avgCost}
            onChange={(e) => 
                setAvgCost(Number(e.target.value))
            }
            />
            
            <button className='border rounded-lg bg-cyan-400 hover:bg-green-400 transition'type='submit'>
                Add Holding
            </button>
            <button className='px-2 border rounded-lg bg-slate-400 hover:bg-red-400 transition'type='button' onClick={onClose}>Cancel</button>
            </div>
        </form>

)}

