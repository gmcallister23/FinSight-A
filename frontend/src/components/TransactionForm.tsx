import { useAppDispatch } from "../app/hooks";
import { addTransaction, fetchHoldings, fetchTransactions } from "../features/portfolio/portfolioSlice";
import { useState, useEffect } from "react";
import type { FormEvent } from 'react';
import { getQuote } from '../services/portfolioApi';

interface AddTransactionFormProps {
    portfolioId: string;
    onClose: () => void;
}

export default function AddTransactionForm({
    portfolioId, onClose
} : AddTransactionFormProps) {

    const dispatch = useAppDispatch();
    const [symbol, setSymbol] = useState('');
    const [type, setType] = useState<'buy' | 'sell'>('buy');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (!symbol) return;
        
        async function fetchQuote() {
            const quote = await getQuote(symbol);
            setPrice(Number(quote.price));
        }
        fetchQuote();
    }, [symbol])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if(!symbol || quantity <= 0 || price <= 0) {
            return;
        }
        try{
        await dispatch(addTransaction({
            portfolioId,
            transaction: {
                symbol: symbol.toUpperCase(),
                type,
                quantity,
                price_at_trade: price
            }
            })
        ).unwrap();

        await dispatch(fetchTransactions(portfolioId));

        await dispatch(fetchHoldings(portfolioId));

        onClose();
    } catch (error) {console.log('Failed to add transaction:', error)}
    };
    return (
        <form onSubmit={handleSubmit}>
            <h3>Add Transaction</h3>
            <header className="grid grid-cols-6 gap-4">
                <p>Stock</p>
                <p>Buy/Sell</p>
                <p>Quantity</p>
                <p>Price</p>
            </header>
            <div className="grid grid-cols-6 gap-4">
            <input
            className="bg-white border rounded-lg text-black "
            type='text'
            placeholder="Symbol"
            value={symbol}
            onChange={(e) => {
                setSymbol(e.target.value.toUpperCase())
            }}
            />
            <select
            className="border rounded-lg"
            value={type}
            onChange={(e) => setType(e.target.value as 'buy' | 'sell')}
            >
                <option value='buy'>Buy</option>
                <option value='sell'>Sell</option>
            </select>

            <input
            className="border rounded-lg bg-white text-black"
            type='number'
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <input
            className="border rounded-lg bg-white text-black"
            type='number'
            placeholder="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            />
            

            <button className='px-2 border rounded-lg bg-cyan-400 hover:bg-green-400 transition'type='submit'>Confirm</button>
            <button className='px-2 border rounded-lg bg-slate-400 hover:bg-red-400 transition'type='button' onClick={onClose}>Cancel</button>
            </div>
        </form>
    )
}