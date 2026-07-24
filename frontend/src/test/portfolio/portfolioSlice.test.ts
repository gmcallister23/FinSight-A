//Test 1 setSelectedPortfolio

import reducer, { setSelectedPortfolio, fetchPortfolios, addPortfolio, removePortfolio, addHolding } from "../../features/portfolio/portfolioSlice";

describe('portfolioSlice', () => {
    it('sets selected portfolio', () => {
        const portfolio = {
            id: '123',
            name: 'Growth Portfolio',
            description: 'Long-term investments',
            holdings_count: 0
        };

        const state = reducer(
            undefined,
            setSelectedPortfolio(portfolio)
        )
        expect(state.selectedPortfolio).toEqual(portfolio)
    })

    it("loads portfolios and selectes the first portfolio", () => {
        const payload = {
            portfolios: [
                {
                    id: '1',
                    name: 'Growth Portfolio',
                    description: 'Long-term investments',
                    holdings_count: 3
                },
                {
                    id: '2',
                    name: 'Dividend Portfolio',
                    description: 'Income investments',
                    holdings_count: 5,
                },
            ],
            total: 2,
        };
        const state = reducer(
            undefined,
            fetchPortfolios.fulfilled(payload, "", undefined)
            
        );

            expect(state.portfolioStatus).toBe('succeeded');

            expect(state.portfolios).toHaveLength(2);

            expect(state.selectedPortfolio).not.toBeNull();

            expect(state.selectedPortfolio?.name).toBe("Growth Portfolio");
    })

    //AddPortfolioFullfilled

    it('adds a new portfolio', () => {
        const newPortfolio = {
            id: '3',
            name: "Retirement Portfolio",
            description: 'Long-term retirement investments',
            holdings_count: 0,
        };
        const state = reducer (
            undefined,
            addPortfolio.fulfilled(newPortfolio, "", {
                name: newPortfolio.name,
                description: newPortfolio.description
            })
        );
        expect(state.portfolios).toHaveLength(1);
        expect(state.portfolios[0].name).toBe("Retirement Portfolio");
    })
    //Remove Portfolio
    it('removes a portfolio and clears selected portfolio data', () => {
        const initialState = {
            ...reducer(undefined, {type: "init"}),

            portfolios: [{
                id: '1',
                name: 'Grwoth Portfolio',
                description: 'Long-term investments',
                holdings_count: 2,
            },
            {
                id: '2',
                name: 'Dividend Portfolio',
                description: 'Income investments',
                holdings_count: 3,
            }
            ],

            selectedPortfolio: {
                id: '1',
                name: 'Growth Portfolio',
                description: 'Long-term investments',
                holdings_count: 2
            },
            holdings: [
                {
                    id: 'holding-1',
                    symbol: 'AAPL',
                    quantity: 10,
                    avg_cost: 150
                }
            ]

        }
        const state = reducer (
            initialState,
            removePortfolio.fulfilled(
                '1', "", "1"
            )
        );
        expect(state.portfolios).toHaveLength(1);
        expect(state.portfolios[0].id).toBe('2');
        expect(state.selectedPortfolio).toBeNull();
        expect(state.holdings).toEqual([]);
    });
    //add holding fulfilled 

    it('adds a holding to the portfolio', () => {
        const newHolding = {
            id: 'holding-1',
            symbol: 'AAPL',
            quantity: 10,
            avg_cost: 190
        };

        const state = reducer(
            undefined, addHolding.fulfilled(
                newHolding, "", {
                    portfolioId: 'portfolio-1',
                    holding: {
                        symbol: "AAPL",
                        quantity: 0,
                        avg_cost: 190
                    },
                }
            )
        );
        expect(state.holdings).toHaveLength(1);
        expect(state.holdings[0].symbol).toBe('AAPL');
        expect(state.holdings[0].quantity).toBe(10);
    })
})