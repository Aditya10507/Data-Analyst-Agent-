from typing import Any


def build_report_html(context: dict[str, Any]) -> str:
    """Build and return the complete business report HTML document."""
    return f"""
    <html><head><meta charset=\"utf-8\"><style>{build_report_css()}</style></head><body>
      {build_cover_page(context)}
      <main>
        {build_executive_summary(context)}
        {build_kpi_section(context["kpis"])}
        {build_quality_section(context["quality"])}
        {build_insights_section(context["insights"])}
        {build_charts_section(context["charts"])}
        {build_cleaning_section(context["cleaning_actions"])}
        {build_recommendations_section(context["recommendations"])}
      </main>
    </body></html>
    """


def build_cover_page(context: dict[str, Any]) -> str:
    """Build and return the standalone report cover page."""
    return f"""
    <section class=\"cover\">
      <div class=\"brand\">AI DATA ANALYST</div>
      <div class=\"cover-content\">
        <p class=\"eyebrow\">BUSINESS ANALYSIS REPORT</p>
        <h1>Decision-ready data, clearly explained.</h1>
        <p class=\"dataset\">{context['filename']}</p>
        <p class=\"cover-meta\">Generated {context['generated_at']}</p>
      </div>
      <p class=\"cover-footer\">Prepared from the uploaded dataset and its approved cleaning workflow.</p>
    </section>
    """


def build_executive_summary(context: dict[str, Any]) -> str:
    """Build and return the executive summary section."""
    return f"<section><p class=\"eyebrow blue\">EXECUTIVE SUMMARY</p><h2>At a glance</h2><p class=\"summary\">{context['summary']}</p></section>"


def build_kpi_section(kpis: list[dict[str, str]]) -> str:
    """Build and return the KPI cards section."""
    cards = "".join(f"<article class=\"kpi\"><span>{item['label']}</span><strong>{item['value']}</strong></article>" for item in kpis)
    return f"<section><p class=\"eyebrow blue\">CORE METRICS</p><div class=\"kpi-grid\">{cards}</div></section>"


def build_quality_section(quality: dict[str, Any]) -> str:
    """Build and return the data-quality score and issue section."""
    issues = "".join(f"<li><span>{item['label']}</span><strong>{item['value']}</strong></li>" for item in quality['issues'])
    issue_content = f"<ul class=\"issue-list\">{issues}</ul>" if issues else "<p class=\"muted\">No material quality issues were detected.</p>"
    return f"""
    <section class=\"quality-section\"><p class=\"eyebrow blue\">DATA QUALITY</p><h2>Trust the analysis</h2>
      <div class=\"quality-layout\"><div class=\"score\"><strong>{quality['score']}</strong><span>/100</span><b>Grade {quality['grade']}</b></div>
      <div><div class=\"quality-bar\"><i style=\"width: {quality['score']}%\"></i></div><p class=\"muted\">Missing values {quality['null_percent']:.1f}% | Duplicate rows {quality['duplicate_percent']:.1f}% | Outliers {quality['outlier_percent']:.1f}%</p>{issue_content}</div></div>
    </section>
    """


def build_insights_section(insights: list[dict[str, str]]) -> str:
    """Build and return the business-insights section."""
    cards = "".join(build_insight_card(insight) for insight in insights)
    content = cards or "<p class=\"muted\">No AI insights were available for this report.</p>"
    return f"<section><p class=\"eyebrow blue\">BUSINESS INSIGHTS</p><h2>What stands out</h2><div class=\"insight-grid\">{content}</div></section>"


def build_insight_card(insight: dict[str, str]) -> str:
    """Build and return one colored business-insight card."""
    card_type = insight['type'] if insight['type'] in {"trend", "warning", "info"} else "info"
    return f"<article class=\"insight {card_type}\"><p class=\"tag\">{card_type}</p><h3>{insight['headline']}</h3><p>{insight['body']}</p></article>"


def build_charts_section(charts: list[str]) -> str:
    """Build and return the report chart gallery section."""
    images = "".join(f"<figure><img src=\"{image}\" alt=\"Histogram chart\"></figure>" for image in charts)
    content = f"<div class=\"chart-grid\">{images}</div>" if images else "<p class=\"muted\">Chart thumbnails were not available for this report.</p>"
    return f"<section><p class=\"eyebrow blue\">KEY CHARTS</p><h2>Visual evidence</h2>{content}</section>"


def build_cleaning_section(actions: list[dict[str, str]]) -> str:
    """Build and return the completed cleaning-actions table."""
    rows = "".join(f"<tr><td>{item['action']}</td><td>{item['column']}</td><td>{item['affected']}</td></tr>" for item in actions)
    content = f"<table><thead><tr><th>Action</th><th>Column</th><th>Affected rows</th></tr></thead><tbody>{rows}</tbody></table>" if rows else "<p class=\"muted\">No cleaning actions were recorded.</p>"
    return f"<section><p class=\"eyebrow blue\">CLEANING LOG</p><h2>Data preparation</h2>{content}</section>"


def build_recommendations_section(recommendations: list[str]) -> str:
    """Build and return the report's recommended next actions."""
    items = "".join(f"<li>{item}</li>" for item in recommendations)
    return f"<section class=\"recommendations\"><p class=\"eyebrow\">RECOMMENDED NEXT ACTIONS</p><h2>Take the analysis forward</h2><ol>{items}</ol></section>"


def build_report_css() -> str:
    """Build and return CSS for a polished printable PDF report."""
    return """
    @page { size: A4; margin: 0; } @page :first { background: #0b172a; margin: 0; }
    * { box-sizing: border-box; } body { color: #172033; font-family: DejaVu Sans, sans-serif; font-size: 10pt; margin: 0; }
    main { padding: 17mm 16mm 16mm; } section { break-inside: avoid; margin: 0 0 14mm; } h1 { font-size: 33pt; line-height: 1.13; margin: 0; max-width: 520px; }
    h2 { font-size: 20pt; margin: 2mm 0 5mm; } h3 { font-size: 12pt; margin: 0 0 3mm; } p { line-height: 1.5; margin: 0; }
    .cover { color: #f8fafc; height: 280mm; page-break-after: always; position: relative; }.brand { color: #75d4c3; font-size: 12pt; font-weight: bold; left: 20mm; letter-spacing: 1.5px; position: absolute; top: 22mm; }.cover-content { left: 20mm; position: absolute; top: 120mm; }.eyebrow { color: #94a3b8; font-size: 8pt; font-weight: bold; letter-spacing: 1.2px; margin-bottom: 4mm; }.eyebrow.blue { color: #176b87; }
    .dataset { color: #75d4c3; font-size: 15pt; margin-top: 10mm; overflow-wrap: anywhere; }.cover-meta,.cover-footer { color: #cbd5e1; font-size: 9pt; margin-top: 3mm; }.cover-footer { bottom: 22mm; left: 20mm; position: absolute; }.summary { color: #475569; font-size: 12pt; max-width: 620px; }
    .kpi-grid { display: grid; gap: 4mm; grid-template-columns: repeat(4, 1fr); }.kpi { background: #eef6ff; border: 1px solid #cde3fb; border-radius: 4px; min-height: 29mm; padding: 5mm; }.kpi span,.muted { color: #64748b; font-size: 8pt; }.kpi strong { display: block; font-size: 19pt; margin-top: 3mm; }
    .quality-section { background: #f8fafc; border-left: 5px solid #0f766e; padding: 6mm; }.quality-layout { display: grid; gap: 7mm; grid-template-columns: 35mm 1fr; align-items: center; }.score { color: #0f766e; text-align: center; }.score strong { font-size: 30pt; }.score span { color: #64748b; }.score b { display: block; font-size: 10pt; }.quality-bar { background: #dbeafe; border-radius: 3mm; height: 5mm; overflow: hidden; }.quality-bar i { background: #0f766e; display: block; height: 100%; }.issue-list { list-style: none; margin: 3mm 0 0; padding: 0; }.issue-list li { border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; padding: 2mm 0; }
    .insight-grid,.chart-grid { display: grid; gap: 4mm; grid-template-columns: repeat(3, 1fr); }.insight { border: 1px solid #e2e8f0; border-radius: 4px; min-height: 55mm; padding: 5mm; }.insight p { color: #475569; font-size: 9pt; }.insight .tag { font-size: 7pt; font-weight: bold; margin-bottom: 2mm; text-transform: uppercase; }.insight.trend { border-top: 4px solid #0284c7; }.insight.warning { border-top: 4px solid #d97706; }.insight.info { border-top: 4px solid #0f766e; }
    figure { border: 1px solid #e2e8f0; margin: 0; padding: 2mm; } img { display: block; height: auto; width: 100%; } table { border-collapse: collapse; width: 100%; } th { background: #eaf2ff; color: #1e3a5f; text-align: left; } td,th { border-bottom: 1px solid #dbe3ee; padding: 3mm; } .recommendations { background: #0b172a; color: #f8fafc; margin-left: -16mm; margin-right: -16mm; padding: 12mm 16mm; }.recommendations .eyebrow { color: #75d4c3; }.recommendations h2 { margin-bottom: 5mm; }.recommendations li { margin-bottom: 3mm; }
    """
