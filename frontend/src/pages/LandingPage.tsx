//FinSight-A/frontend/src/pages/LandingPage.tsx

import TrendingStocks from "../components/TrendingStocks";
import TrendingPerformance from "../components/TrendingPerformance";
import TrendingHighlights from "../components/TrendingHighlights";
import UnlockCard from "../components/UnlockCard";
import FinSight from "../components/FinSight";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] overflow-y-auto bg-[#0D1B2A] lg:h-[calc(100vh-64px)] lg:overflow-hidden">
      <main className="w-full px-3 py-3 lg:h-full lg:px-1 lg:py-1">
        <div className="grid grid-cols-1 gap-3 lg:h-full lg:grid-cols-12">
          <div className="col-span-1 min-h-0 lg:col-span-4">
            <TrendingStocks />
          </div>

          <div className="col-span-1 flex min-h-0 flex-col gap-3 lg:col-span-5 lg:gap-1">
            <TrendingPerformance />

            <div className="flex-1">
              <TrendingHighlights />
            </div>
          </div>

          <div className="col-span-1 flex min-h-0 flex-col gap-3 lg:col-span-3 lg:gap-1">
            <UnlockCard />

            <div className="flex-1">
              <FinSight />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}