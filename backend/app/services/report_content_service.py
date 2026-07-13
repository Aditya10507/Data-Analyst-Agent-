from html import escape
from typing import Any

from app.services.report_quality_service import read_quality

INSIGHT_LIMIT = 5
RECOMMENDATION_LIMIT = 3


def read_insights(result: dict[str, Any]) -> list[dict[str, str]]:
    """Read and return sanitized report insights."""
    insights = result.get("insights", [])
    if not isinstance(insights, list):
        return []
    return [
        {
            "body": escape(str(insight.get("body", ""))),
            "headline": escape(str(insight.get("headline", "Insight"))),
            "type": escape(str(insight.get("type", "info"))),
        }
        for insight in insights[:INSIGHT_LIMIT]
        if isinstance(insight, dict)
    ]


def read_cleaning_actions(result: dict[str, Any]) -> list[dict[str, str]]:
    """Read and return normalized data-cleaning action rows."""
    actions = result.get("cleaning_report", [])
    if not isinstance(actions, list):
        return []
    return [build_cleaning_action(action) for action in actions if isinstance(action, dict)]


def build_cleaning_action(action: dict[str, Any]) -> dict[str, str]:
    """Build and return one user-readable cleaning action."""
    action_name = str(action.get("action", "data review")).replace("_", " ").title()
    column_name = str(action.get("column", "All columns"))
    return {
        "action": escape(action_name),
        "column": escape(column_name),
        "affected": f"{int(action.get('row_count', 0)):,}",
    }


def build_recommendations(result: dict[str, Any]) -> list[str]:
    """Build and return focused next actions from report findings."""
    quality = read_quality(result)
    recommendations = build_quality_recommendations(quality)
    recommendations.extend(insight["headline"] for insight in read_insights(result))
    return recommendations[:RECOMMENDATION_LIMIT] or ["Review the available report findings before making a decision."]


def build_quality_recommendations(quality: dict[str, Any]) -> list[str]:
    """Build and return recommendations for measurable quality concerns."""
    recommendations = []
    if quality["null_percent"] > 0:
        recommendations.append("Review fields with missing values before using them for decisions.")
    if quality["duplicate_percent"] > 0:
        recommendations.append("Confirm duplicate records represent repeat events before reporting totals.")
    if quality["outlier_percent"] > 0:
        recommendations.append("Validate unusually high or low values with the data owner.")
    return recommendations
