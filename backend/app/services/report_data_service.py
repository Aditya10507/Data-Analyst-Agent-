from datetime import datetime
from html import escape
from typing import Any

from app.models.job import Job
from app.services.report_chart_service import read_chart_images
from app.services.report_content_service import (
    build_recommendations,
    read_cleaning_actions,
    read_insights,
)
from app.services.report_quality_service import read_quality


def build_report_context(job: Job) -> dict[str, Any]:
    """Build and return presentation-ready data for one PDF report."""
    result = read_completed_result(job)
    return {
        "charts": read_chart_images(result),
        "cleaning_actions": read_cleaning_actions(result),
        "filename": escape(job.filename),
        "generated_at": format_generated_at(job.updated_at or job.created_at),
        "insights": read_insights(result),
        "kpis": build_kpis(result),
        "quality": read_quality(result),
        "recommendations": build_recommendations(result),
        "summary": build_summary(result),
    }


def read_completed_result(job: Job) -> dict[str, Any]:
    """Read and return the completed result payload or raise a value error."""
    if not job.result_json:
        raise ValueError("Job result is not ready for export.")
    return job.result_json


def build_kpis(result: dict[str, Any]) -> list[dict[str, str]]:
    """Build and return the KPI cards displayed in the report."""
    rows, columns = read_shape(result)
    quality = read_quality(result)
    return [
        {"label": "Rows analyzed", "value": f"{rows:,}"},
        {"label": "Columns analyzed", "value": f"{columns:,}"},
        {"label": "Missing values", "value": f"{quality['null_percent']:.1f}%"},
        {"label": "Duplicate rows", "value": f"{quality['duplicate_percent']:.1f}%"},
    ]


def build_summary(result: dict[str, Any]) -> str:
    """Build and return an executive summary for the dataset."""
    rows, columns = read_shape(result)
    quality = read_quality(result)
    return (
        f"This report profiles {rows:,} rows across {columns:,} columns. "
        f"The dataset received a data-quality score of {quality['score']}/100 "
        f"(grade {quality['grade']})."
    )


def read_shape(result: dict[str, Any]) -> tuple[int, int]:
    """Read and return dataset rows and columns from a result payload."""
    shape = result.get("shape", [0, 0])
    if not isinstance(shape, list) or len(shape) < 2:
        return 0, 0
    return int(shape[0]), int(shape[1])


def format_generated_at(timestamp: datetime | None) -> str:
    """Format and return the report generation timestamp."""
    value = timestamp or datetime.utcnow()
    return value.strftime("%d %b %Y, %H:%M UTC")
