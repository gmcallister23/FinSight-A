// FinSight-A/frontend/src/components/Watchlist.tsx

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchWatchlistQuotes } from "../features/watchlist/watchlistSlice";

export default function Watchlist() {
  const dispatch = useAppDispatch();

  const { items, quotes } = useAppSelector((state) => state.watchlist);

  const preview = items;

  useEffect(() => {
    if (preview.length > 0) {
      dispatch(fetchWatchlistQuotes(preview));
    }
  }, [dispatch, items]);

  return (
    <div className="rounded-xl border border-[#24354D] bg-[#101C31] px-3 py-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex items-center justify-between gap-3 lg:shrink-0 lg:justify-start">
          <h2 className="text-xl text-white">⭐ Watchlist</h2>

          <span className="rounded bg-[#6C63FF] px-2 py-1 text-sm">
            {items.length} Stocks
          </span>
        </div>

        <div className="flex w-full min-w-0 items-center gap-6 overflow-x-auto whitespace-nowrap px-0 lg:flex-1 lg:px-2">
          {preview.length === 0 ? (
            <p className="text-gray-400">Your watchlist is empty.</p>
          ) : (
            preview.map((stock) => {
              const quote = quotes[stock.symbol];

              const price = Number(quote?.price);
              const changePercent = Number(
                quote?.change_percent?.replace("%", ""),
              );

              const hasQuote =
                quote?.price !== undefined && !Number.isNaN(price);

              const isPositive =
                !Number.isNaN(changePercent) && changePercent >= 0;

              return (
                <div
                  key={stock.id}
                  className="flex items-center gap-3 whitespace-nowrap"
                >
                  <span className="font-medium text-white">{stock.symbol}</span>

                  {hasQuote ? (
                    <>
                      <span className="text-white">
                        {price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>

                      <span
                        className={
                          isPositive ? "text-green-400" : "text-red-400"
                        }
                      >
                        {isPositive ? "▲" : "▼"}{" "}
                        {Math.abs(changePercent).toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">
                      Market data unavailable
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <Link to="/watchlist" className="w-full lg:w-auto lg:shrink-0">
          <button className="w-full cursor-pointer rounded-lg bg-[#3DD6F5] px-4 py-2 text-sm hover:opacity-50 lg:w-auto">
            View Full Watchlist →
          </button>
        </Link>
      </div>
    </div>
  );
}
