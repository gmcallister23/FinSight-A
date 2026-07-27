import { useAppSelector } from "../app/hooks";
import { useState } from "react";
import TransactionForm from './TransactionForm'

export default function TransactionList() {
    const { transactions, transactionStatus } = useAppSelector(
        (state) => state.portfolio
    );

    const [showTransactionForm, setShowTransactionForm] = useState(false);
     const selectedPortfolio = useAppSelector(
        state => state.portfolio.selectedPortfolio
    );

    if (transactionStatus === 'loading') {
        return (
            <div className='rounded-xl border border-[#24354D] bg-[#101C31] p-4'>
                <p className="text-gray-400">
                    Loading transactions...
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-[#24354D] bg-[#101C31] p-4">
            <header className="flex items-center justify-between">
            <h2 className="mb-4 text-xl font-semibold text-white">
                Transaction History
            </h2>

            <div>
                                       
                <button 
                className='border rounded-lg py-2 px-2 bg-cyan-500 mt-2 mb-2 transition hover:bg-slate-500'
                onClick={() => setShowTransactionForm(true)}>
                    Add Transaction
                </button>
                {showTransactionForm && selectedPortfolio && (
                    <TransactionForm
                    portfolioId={selectedPortfolio.id}
                    onClose={() => setShowTransactionForm(false)}
                    />
                )}
            </div>
            </header>
            {transactions.length === 0 ? (
                <p className="text-gray-400">
                    No transactions yet.
                </p>
            ) : (
                <div className="space-y-3">
                    {transactions.map((transaction) => (
                        <div
                        key={transaction.id}
                        className="flex items-center justify-between rounded-lg border border-[#24354D] bg-[#162337] p-3"
                        >
                            <div>
                            <p className="font-semibold text-white">{transaction.symbol}</p>
                            <p className="text-sm text-gray-400">
                                {new Date(transaction.traded_at).toLocaleDateString()}
                            </p>
                            </div>
                            <div className="text-center">
                            <p className={transaction.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                                {transaction.type.toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-300">
                                {Number(transaction.quantity).toFixed(0)} shares
                            </p>
                            </div>
                            <div className="text-right">
                                <p className='text-white'>
                                    {transaction.price_at_trade ? `$${Number(transaction.price_at_trade).toFixed(2)}` : 'N/A'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}