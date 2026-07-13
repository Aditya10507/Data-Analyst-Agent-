from html import escape
from typing import Any

ISSUE_LIMIT = 5


def read_quality(result: dict[str, Any]) -> dict[str, Any]:
    """Read and return normalized data-quality details."""
    quality = result.get("data_quality", {})
    if not isinstance(quality, dict):
        quality = {}
    return {
        "grade": escape(str(quality.get("grade", "Not scored"))),
        "issues": read_quality_issues(quality),
        "score": int(quality.get("score", 0)),
        "null_percent": float(quality.get("null_percent", calculate_null_percent(result))),
        "duplicate_percent": float(quality.get("duplicate_percent", 0)),
        "outlier_percent": float(quality.get("outlier_percent", 0)),
    }


def read_quality_issues(quality: dict[str, Any]) -> list[dict[str, str]]:
    """Read and return sanitized quality issue rows."""
    issues = quality.get("issues", [])
    if not isinstance(issues, list):
        return []
    return [
        {"label": escape(str(issue.get("label", "Quality check"))), "value": escape(str(issue.get("value", "")))}
        for issue in issues[:ISSUE_LIMIT]
        if isinstance(issue, dict)
    ]


def calculate_null_percent(result: dict[str, Any]) -> float:
    """Calculate and return mean column null percentage for old reports."""
    columns = result.get("stats", {}).get("columns", {})
    percentages = [float(item.get("null_percent", 0)) for item in columns.values()]
    return sum(percentages) / len(percentages) if percentages else 0.0
