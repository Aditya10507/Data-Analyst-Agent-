import base64
import logging
from typing import Any

from minio.error import S3Error

from app.services.storage_service import read_object_bytes

CHART_LIMIT = 3

logger = logging.getLogger(__name__)


def read_chart_images(result: dict[str, Any]) -> list[str]:
    """Read and return embedded chart data URIs for the report."""
    object_names = read_chart_object_names(result)
    return [image for name in object_names if (image := read_chart_image(name))]


def read_chart_object_names(result: dict[str, Any]) -> list[str]:
    """Read and return up to three saved histogram thumbnail names."""
    histograms = result.get("charts", {}).get("histograms", {})
    if not isinstance(histograms, dict):
        return []
    return [
        str(chart["thumbnail_object_name"])
        for chart in histograms.values()
        if isinstance(chart, dict) and chart.get("thumbnail_object_name")
    ][:CHART_LIMIT]


def read_chart_image(object_name: str) -> str | None:
    """Read and return one chart image data URI when storage is available."""
    try:
        image_bytes = read_object_bytes(object_name)
        encoded_image = base64.b64encode(image_bytes).decode("ascii")
        return f"data:image/png;base64,{encoded_image}"
    except (OSError, S3Error):
        logger.warning("PDF report skipped unavailable chart thumbnail %s.", object_name)
        return None
