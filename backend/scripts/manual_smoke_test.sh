#!/usr/bin/env bash
#
# Manual smoke test for the deployed FinSight backend.
#
# Runs through the full core user journey against a live deployment
# (signup -> login -> portfolio CRUD -> transactions -> AI -> watchlist
# -> performance -> cleanup) to confirm everything works end-to-end
# after a deploy. Used to verify the Render deployment on 2026-07-28
# after fixing the cross-domain cookie (samesite) bug and Danny's
# pen test findings (P1/P2/P3).
#
# Usage:
#   BASE_URL=https://finsight-a.onrender.com ./scripts/manual_smoke_test.sh
#   (defaults to http://localhost:8000 if BASE_URL is not set)

set -e

BASE_URL="${BASE_URL:-http://localhost:8000}"
COOKIE_JAR=$(mktemp)
TEST_EMAIL="smoketest_$(date +%s)@example.com"
TEST_PASSWORD="SmokeTest123"

echo "Running smoke test against: $BASE_URL"
echo "Test account: $TEST_EMAIL"
echo ""

pass() { echo "  PASS: $1"; }
fail() { echo "  FAIL: $1"; exit 1; }

echo "== 1. Health check =="
curl -sf "$BASE_URL/health" > /dev/null && pass "health check" || fail "health check"

echo "== 2. Signup =="
curl -sf -X POST "$BASE_URL/api/v1/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" > /dev/null \
  && pass "signup" || fail "signup"

echo "== 3. Login (stores cookie) =="
curl -sf -c "$COOKIE_JAR" -X POST "$BASE_URL/api/v1/auth/login" \
  -d "username=$TEST_EMAIL&password=$TEST_PASSWORD" > /dev/null \
  && pass "login" || fail "login"

echo "== 4. Get current user (verifies cookie survives) =="
curl -sf -b "$COOKIE_JAR" "$BASE_URL/api/v1/auth/me" > /dev/null \
  && pass "get current user (cookie persisted)" || fail "get current user"

echo "== 5. Update profile (PATCH /me) =="
curl -sf -b "$COOKIE_JAR" -X PATCH "$BASE_URL/api/v1/auth/me" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Smoke","last_name":"Test","username":"smoketest_user"}' > /dev/null \
  && pass "update profile" || fail "update profile"

echo "== 6. Create portfolio =="
PORTFOLIO_ID=$(curl -sf -b "$COOKIE_JAR" -X POST "$BASE_URL/api/v1/portfolios" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoke Test Portfolio","description":"Created by smoke test"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
[ -n "$PORTFOLIO_ID" ] && pass "create portfolio ($PORTFOLIO_ID)" || fail "create portfolio"

echo "== 7. Buy transaction =="
curl -sf -b "$COOKIE_JAR" -X POST "$BASE_URL/api/v1/portfolios/$PORTFOLIO_ID/transactions" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","type":"buy","quantity":10,"price_at_trade":300}' > /dev/null \
  && pass "buy transaction" || fail "buy transaction"

echo "== 8. Sell transaction (partial) =="
curl -sf -b "$COOKIE_JAR" -X POST "$BASE_URL/api/v1/portfolios/$PORTFOLIO_ID/transactions" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","type":"sell","quantity":3,"price_at_trade":310}' > /dev/null \
  && pass "sell transaction" || fail "sell transaction"

echo "== 9. Get portfolio with holdings =="
HOLDINGS=$(curl -sf -b "$COOKIE_JAR" "$BASE_URL/api/v1/portfolios/$PORTFOLIO_ID")
echo "$HOLDINGS" | grep -q '"quantity":"7.0000"' \
  && pass "holdings correctly show 7 shares after buy 10 / sell 3" \
  || fail "holdings quantity mismatch"

echo "== 10. AI insights =="
curl -sf -b "$COOKIE_JAR" "$BASE_URL/api/v1/portfolios/$PORTFOLIO_ID/insights" > /dev/null \
  && pass "AI insights (Groq)" || fail "AI insights"

echo "== 11. AI chat =="
curl -sf -b "$COOKIE_JAR" -X POST "$BASE_URL/api/v1/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"How is my portfolio doing?"}' > /dev/null \
  && pass "AI chat (Groq)" || fail "AI chat"

echo "== 12. Portfolio performance =="
curl -sf -b "$COOKIE_JAR" "$BASE_URL/api/v1/portfolios/$PORTFOLIO_ID/performance?range=1W" > /dev/null \
  && pass "portfolio performance" || fail "portfolio performance"

echo "== 13. Watchlist add =="
curl -sf -b "$COOKIE_JAR" -X POST "$BASE_URL/api/v1/watchlist" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"TSLA"}' > /dev/null \
  && pass "watchlist add" || fail "watchlist add"

echo "== 14. Watchlist delete =="
curl -sf -b "$COOKIE_JAR" -X DELETE "$BASE_URL/api/v1/watchlist/TSLA" \
  && pass "watchlist delete" || fail "watchlist delete"

echo "== 15. Unauthenticated requests are rejected =="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/portfolios")
[ "$STATUS" = "401" ] && pass "unauthenticated request correctly rejected (401)" \
  || fail "expected 401, got $STATUS"

echo "== 16. Cleanup: delete portfolio =="
curl -sf -b "$COOKIE_JAR" -X DELETE "$BASE_URL/api/v1/portfolios/$PORTFOLIO_ID" \
  && pass "portfolio deleted" || fail "portfolio delete"

rm -f "$COOKIE_JAR"

echo ""
echo "All smoke tests passed."
