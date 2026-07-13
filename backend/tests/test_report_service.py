from datetime import datetime
from types import SimpleNamespace

from app.services.report_data_service import build_report_context
from app.services.report_service import build_report_pdf
from app.services.report_template_service import build_report_html


def test_build_report_context_includes_business_sections(monkeypatch) -> None:
    """Assert report context includes quality, cleaning, and recommendations."""
    monkeypatch.setattr("app.services.report_chart_service.read_object_bytes", lambda name: b"chart-bytes")
    context = build_report_context(build_job())
    assert context["quality"]["score"] == 84
    assert context["cleaning_actions"][0]["action"] == "Fill Nulls"
    assert context["charts"][0].startswith("data:image/png;base64,")
    assert context["recommendations"]


def test_build_report_html_has_professional_sections(monkeypatch) -> None:
    """Assert the generated report HTML contains every business section."""
    monkeypatch.setattr("app.services.report_chart_service.read_object_bytes", lambda name: b"chart-bytes")
    document = build_report_html(build_report_context(build_job()))
    assert "BUSINESS ANALYSIS REPORT" in document
    assert "DATA QUALITY" in document
    assert "CLEANING LOG" in document
    assert "RECOMMENDED NEXT ACTIONS" in document


def test_build_report_pdf_returns_a_pdf_document(monkeypatch) -> None:
    """Assert the report service renders a non-empty PDF document."""
    monkeypatch.setattr("app.services.report_chart_service.read_object_bytes", lambda name: b"chart-bytes")
    document = build_report_pdf(build_job())
    assert document.startswith(b"%PDF")
    assert len(document) > 1000


def build_job() -> SimpleNamespace:
    """Build and return one completed job fixture for report tests."""
    return SimpleNamespace(
        filename="sales.csv",
        created_at=datetime(2026, 7, 13, 10, 30),
        updated_at=datetime(2026, 7, 13, 10, 35),
        result_json={
            "shape": [500, 8],
            "stats": {"columns": {"sales": {"null_percent": 2.0}}},
            "data_quality": {"score": 84, "grade": "B", "null_percent": 2.0, "duplicate_percent": 1.0, "outlier_percent": 0.5, "issues": [{"label": "Missing values", "value": "2.0%"}]},
            "cleaning_report": [{"action": "fill_nulls", "column": "sales", "row_count": 10}],
            "insights": [{"headline": "Revenue rose in Q2", "body": "North region grew steadily.", "type": "trend"}],
            "charts": {"histograms": {"sales": {"thumbnail_object_name": "charts/job/sales.png"}}},
        },
    )
