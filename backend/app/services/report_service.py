from weasyprint import HTML

from app.models.job import Job
from app.services.report_data_service import build_report_context
from app.services.report_template_service import build_report_html


def build_report_pdf(job: Job) -> bytes:
    """Build and return a polished PDF report for one completed job."""
    context = build_report_context(job)
    return HTML(string=build_report_html(context)).write_pdf()
