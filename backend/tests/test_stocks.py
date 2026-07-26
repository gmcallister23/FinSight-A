"""
Unit tests for stock market data endpoints.

Note: These test input validation and error handling only.
Actual Alpha Vantage API calls are not mocked here since they're
tested manually via Swagger (documented in Sprint 2 testing).
"""


def test_invalid_symbol_too_long_fails(client):
    """Symbol longer than 5 characters returns 400."""
    response = client.get("/api/v1/stocks/TOOLONG/price")
    assert response.status_code == 400


def test_invalid_symbol_with_numbers_fails(client):
    """Symbol with numbers returns 400."""
    response = client.get("/api/v1/stocks/AAP1/price")
    assert response.status_code == 400


def test_cache_stats_endpoint_requires_auth(client):
    """Cache stats endpoint requires authentication (see P3 finding)."""
    response = client.get("/api/v1/stocks/cache/stats")
    assert response.status_code == 401


def test_cache_stats_endpoint_accessible(client, auth_headers):
    """Cache stats endpoint returns valid structure when authenticated."""
    response = client.get("/api/v1/stocks/cache/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "hits" in data
    assert "misses" in data
    assert "hit_rate" in data


def test_cache_clear_endpoint_requires_auth(client):
    """Cache clear endpoint requires authentication (see P3 finding)."""
    response = client.post("/api/v1/stocks/cache/clear")
    assert response.status_code == 401


def test_cache_clear_endpoint(client, auth_headers):
    """Cache clear endpoint returns success message when authenticated."""
    response = client.post("/api/v1/stocks/cache/clear", headers=auth_headers)
    assert response.status_code == 200
    assert "message" in response.json()


def test_cache_clear_invalid_symbol_fails(client, auth_headers):
    """Cache clear with a malformed symbol returns 422 (see P3 finding)."""
    response = client.post(
        "/api/v1/stocks/cache/clear?symbol=<script>",
        headers=auth_headers,
    )
    assert response.status_code == 422


def test_price_history_invalid_days_fails(client):
    """Invalid days parameter (not 1/7/30/365) returns 400."""
    response = client.get("/api/v1/stocks/AAPL/history?days=15")
    assert response.status_code == 400


def test_price_history_no_data_returns_404(client):
    """Requesting history for symbol with no stored data returns 404."""
    response = client.get("/api/v1/stocks/ZZZZ/history?days=30")
    assert response.status_code == 404
