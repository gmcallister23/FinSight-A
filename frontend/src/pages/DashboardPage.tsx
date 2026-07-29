// FinSight-A/frontend/src/pages/DashboardPage.tsx

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchPortfolio,
  fetchPortfolios,
} from "../features/portfolio/portfolioSlice";
import { fetchWatchlist } from "../features/watchlist/watchlistSlice";
import { fetchDashboard } from "../features/dashboard/dashboardSlice";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import PortfolioAllocation from "../components/PortfolioAllocation";
import PortfolioPerformance from "../components/PortfolioPerformance";
import PortfolioHighlights from "../components/PortfolioHighlights";
import PortfolioValue from "../components/PortfolioValue";
import PortfolioInsight from "../components/PortfolioFinSight";
import Watchlist from "../components/Watchlist";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAuth();

  const selectedPortfolio = useAppSelector(
    (state) => state.portfolio.selectedPortfolio,
  );

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchPortfolios());
    dispatch(fetchWatchlist());
  }, [dispatch]);

  useEffect(() => {
    if (selectedPortfolio) {
      dispatch(fetchPortfolio(selectedPortfolio.id));
    }
  }, [selectedPortfolio, dispatch]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0D1B2A] flex flex-col">
      <main className="flex-1 px-3 py-3 flex flex-col min-h-0 lg:px-2 lg:py-1">
        <div className="mb-5">
          <Watchlist />
        </div>

        <div className="grid grid-cols-1 gap-3 lg:h-[calc(100vh-310px)] lg:min-h-0 lg:grid-cols-12 lg:overflow-hidden">
          <div className="col-span-1 min-h-0 lg:col-span-4">
            <PortfolioAllocation />
          </div>

          <div className="col-span-1 flex min-h-0 flex-col gap-3 lg:col-span-5 lg:gap-4">
            <PortfolioPerformance />

            <div className="min-h-0 flex-1">
              <PortfolioHighlights />
            </div>
          </div>

          <div className="col-span-1 min-h-0 lg:col-span-3">
            <PortfolioValue />
          </div>
        </div>

        <div className="pt-3 shrink-0">
          <PortfolioInsight />
        </div>
      </main>
    </div>
  );
}