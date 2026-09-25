import os
import subprocess
import tempfile
import shutil
from pathlib import Path
from django.conf import settings
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def escape_latex(text: str) -> str:
    if not text:
        return ""
    chars = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
        '\\': r'\textbackslash{}',
    }
    out = ""
    for c in text:
        out += chars.get(c, c)
    return out

def generate_latex_source(resume, template_name="Minimal ATS"):
    """
    Renders structured resume data into controlled LaTeX source.
    Escapes all user-submitted text to prevent LaTeX injection.
    """
    personal = getattr(resume, 'personal_info', None)
    name = escape_latex(personal.full_name if personal else "Resume Name")
    email = escape_latex(personal.email if personal else "")
    phone = escape_latex(personal.phone if personal else "")
    location = escape_latex(personal.location if personal else "")
    linkedin = escape_latex(personal.linkedin if personal else "")
    github = escape_latex(personal.github if personal else "")
    summary = escape_latex(personal.summary if personal else "")

    contact_parts = [p for p in [phone, email, location, linkedin, github] if p]
    contact_str = " | ".join(contact_parts)

    if template_name == "Computer Vision / ML Engineer":
        latex = [
            r"\documentclass[a4paper,9pt]{article}",
            r"\usepackage[empty]{fullpage}",
            r"\usepackage{titlesec}",
            r"\usepackage{enumitem}",
            r"\usepackage[hidelinks]{hyperref}",
            r"\usepackage{fancyhdr}",
            r"\usepackage{tabularx}",
            r"\pagestyle{fancy}",
            r"\fancyhf{}",
            r"\renewcommand{\headrulewidth}{0pt}",
            r"\addtolength{\oddsidemargin}{-0.6in}",
            r"\addtolength{\textwidth}{1.2in}",
            r"\addtolength{\topmargin}{-0.7in}",
            r"\addtolength{\textheight}{1.4in}",
            r"\titleformat{\section}{\large\bfseries}{}{0em}{}[\titlerule]",
            r"\titlespacing*{\section}{0pt}{4pt}{2pt}",
            r"\newcommand{\resumeSubheading}[4]{",
            r"\item",
            r"\begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}",
            r"\textbf{#1} & \textbf{\small #2} \\",
            r"\textit{\small #3} & \textit{\small #4} \\",
            r"\end{tabular*}",
            r"}",
            r"\begin{document}",
            r"\begin{center}",
            f"{{\\Huge \\textbf{{{name}}}}} \\\\[4pt]",
            f"Email: {email} $|$ Phone: {phone} $|$ GitHub: {github} $|$ LinkedIn: {linkedin}",
            r"\vspace{4pt}",
            r"\hrule",
            r"\vspace{5pt}",
            r"\end{center}"
        ]
    else:
        latex = [
            r"\documentclass[10pt,a4paper]{article}",
            r"\usepackage[utf8]{inputenc}",
            r"\usepackage[margin=0.6in]{geometry}",
            r"\usepackage{hyperref}",
            r"\usepackage{titlesec}",
            r"\usepackage{enumitem}",
            r"\usepackage{xcolor}",
            r"\pagestyle{empty}",
            r"\definecolor{primary}{RGB}{30, 41, 59}",
            r"\titleformat{\section}{\large\bfseries\color{primary}}{}{0em}{}[\titlerule]",
            r"\titlespacing*{\section}{0pt}{10pt}{5pt}",
            r"\setlist[itemize]{noitemsep, topsep=2pt, leftmargin=15pt}",
            r"\begin{document}",
            r"\begin{center}",
            f"{{\\Huge \\bfseries \\color{{primary}} {name}}}\\\\[4pt]",
            f"{{\\small {contact_str}}}",
            r"\end{center}",
            r"\vspace{5pt}",
        ]

    order = resume.section_order or ['personal', 'summary', 'education', 'experience', 'projects', 'skills', 'certifications']

    for section in order:
        if section == 'summary' and summary:
            latex.append(r"\section*{Professional Summary}")
            latex.append(summary)
            latex.append(r"\vspace{5pt}")

        elif section == 'education':
            eds = resume.educations.all().order_by('order')
            if eds.exists():
                latex.append(r"\section*{Education}")
                for ed in eds:
                    inst = escape_latex(ed.institution)
                    deg = escape_latex(ed.degree)
                    field = escape_latex(ed.field_of_study)
                    dates = f"{escape_latex(ed.start_date)} - {escape_latex(ed.end_date)}"
                    gpa = f" (GPA: {escape_latex(ed.gpa)})" if ed.gpa else ""
                    latex.append(f"\\textbf{{{deg}{' in ' + field if field else ''}}} \\hfill {{\\small {dates}}}\\\\")
                    latex.append(f"{{\\textit{{{inst}}}}}{gpa}\\\\")
                    if ed.description:
                        latex.append(f"{{\\small {escape_latex(ed.description)}}}\\\\")
                    latex.append(r"\vspace{3pt}")

        elif section == 'experience':
            exps = resume.experiences.all().order_by('order')
            if exps.exists():
                latex.append(r"\section*{Experience}")
                for exp in exps:
                    comp = escape_latex(exp.company)
                    pos = escape_latex(exp.position)
                    loc = escape_latex(exp.location)
                    dates = f"{escape_latex(exp.start_date)} - {'Present' if exp.is_current else escape_latex(exp.end_date)}"
                    latex.append(f"\\textbf{{{pos}}} \\hfill {{\\small {dates}}}\\\\")
                    latex.append(f"{{\\textit{{{comp}{', ' + loc if loc else ''}}}}}\\\\")
                    bullets = exp.description_bullets or []
                    if bullets:
                        latex.append(r"\begin{itemize}")
                        for b in bullets:
                            latex.append(f"  \\item {escape_latex(b)}")
                        latex.append(r"\end{itemize}")
                    latex.append(r"\vspace{3pt}")

        elif section == 'projects':
            projs = resume.projects.all().order_by('order')
            if projs.exists():
                latex.append(r"\section*{Projects}")
                for pr in projs:
                    pname = escape_latex(pr.name)
                    tech = f" [{', '.join([escape_latex(t) for t in pr.technologies])}]" if pr.technologies else ""
                    latex.append(f"\\textbf{{{pname}}}{tech}\\\\")
                    if pr.description:
                        latex.append(f"{{\\small {escape_latex(pr.description)}}}\\\\")
                    bullets = pr.bullet_points or []
                    if bullets:
                        latex.append(r"\begin{itemize}")
                        for b in bullets:
                            latex.append(f"  \\item {escape_latex(b)}")
                        latex.append(r"\end{itemize}")
                    latex.append(r"\vspace{3pt}")

        elif section == 'skills':
            sks = resume.skills.all().order_by('order')
            if sks.exists():
                latex.append(r"\section*{Skills}")
                for sk in sks:
                    cname = escape_latex(sk.category_name)
                    slist = ", ".join([escape_latex(s) for s in (sk.skills_list or [])])
                    latex.append(f"\\textbf{{{cname}:}} {slist}\\\\")
                latex.append(r"\vspace{3pt}")

        elif section == 'certifications':
            certs = resume.certifications.all().order_by('order')
            if certs.exists():
                latex.append(r"\section*{Certifications}")
                for c in certs:
                    cname = escape_latex(c.name)
                    iss = f" - {escape_latex(c.issuer)}" if c.issuer else ""
                    dt = f" ({escape_latex(c.issue_date)})" if c.issue_date else ""
                    latex.append(f"\\textbf{{{cname}}}{iss}{dt}\\\\")
                latex.append(r"\vspace{3pt}")

    latex.append(r"\end{document}")
    return "\n".join(latex)


def generate_pdf_reportlab(resume, output_path):
    """
    Generates a high-quality PDF using Python's ReportLab as a reliable compilation fallback.
    """
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1e293b'),
        alignment=1, # Center
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#475569'),
        alignment=1, # Center
        spaceAfter=12
    )

    section_heading = ParagraphStyle(
        'SecHead',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=10,
        spaceAfter=4,
        textTransform='uppercase'
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#1e293b'),
        fontName='Helvetica-Bold'
    )

    body_sub = ParagraphStyle(
        'BodySub',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155'),
        fontName='Helvetica-Oblique'
    )

    body_text = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#1e293b')
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        leftIndent=12,
        textColor=colors.HexColor('#334155')
    )

    elements = []

    personal = getattr(resume, 'personal_info', None)
    if personal and personal.full_name:
        elements.append(Paragraph(personal.full_name, title_style))
        parts = [p for p in [personal.phone, personal.email, personal.location, personal.linkedin, personal.github] if p]
        if parts:
            elements.append(Paragraph(" | ".join(parts), subtitle_style))

    order = resume.section_order or ['personal', 'summary', 'education', 'experience', 'projects', 'skills', 'certifications']

    for sec in order:
        if sec == 'summary' and personal and personal.summary:
            elements.append(Paragraph("Professional Summary", section_heading))
            elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=6))
            elements.append(Paragraph(personal.summary, body_text))
            elements.append(Spacer(1, 6))

        elif sec == 'education':
            eds = resume.educations.all().order_by('order')
            if eds.exists():
                elements.append(Paragraph("Education", section_heading))
                elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=6))
                for ed in eds:
                    dates = f"{ed.start_date} - {ed.end_date}" if ed.start_date else ""
                    elements.append(Paragraph(f"<b>{ed.degree}</b> {f'in {ed.field_of_study}' if ed.field_of_study else ''} <font color='#64748b' size=8>({dates})</font>", body_bold))
                    elements.append(Paragraph(f"<i>{ed.institution}</i> {f'| GPA: {ed.gpa}' if ed.gpa else ''}", body_sub))
                    if ed.description:
                        elements.append(Paragraph(ed.description, body_text))
                    elements.append(Spacer(1, 4))

        elif sec == 'experience':
            exps = resume.experiences.all().order_by('order')
            if exps.exists():
                elements.append(Paragraph("Experience", section_heading))
                elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=6))
                for exp in exps:
                    dates = f"{exp.start_date} - {'Present' if exp.is_current else exp.end_date}"
                    elements.append(Paragraph(f"<b>{exp.position}</b> <font color='#64748b' size=8>({dates})</font>", body_bold))
                    elements.append(Paragraph(f"<i>{exp.company}</i> {f'- {exp.location}' if exp.location else ''}", body_sub))
                    for b in (exp.description_bullets or []):
                        elements.append(Paragraph(f"• {b}", bullet_style))
                    elements.append(Spacer(1, 4))

        elif sec == 'projects':
            projs = resume.projects.all().order_by('order')
            if projs.exists():
                elements.append(Paragraph("Projects", section_heading))
                elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=6))
                for pr in projs:
                    tech = f" <i>[{', '.join(pr.technologies)}]</i>" if pr.technologies else ""
                    elements.append(Paragraph(f"<b>{pr.name}</b>{tech}", body_bold))
                    if pr.description:
                        elements.append(Paragraph(pr.description, body_text))
                    for b in (pr.bullet_points or []):
                        elements.append(Paragraph(f"• {b}", bullet_style))
                    elements.append(Spacer(1, 4))

        elif sec == 'skills':
            sks = resume.skills.all().order_by('order')
            if sks.exists():
                elements.append(Paragraph("Skills & Expertise", section_heading))
                elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=6))
                for sk in sks:
                    slist = ", ".join(sk.skills_list or [])
                    elements.append(Paragraph(f"<b>{sk.category_name}:</b> {slist}", body_text))
                elements.append(Spacer(1, 4))

        elif sec == 'certifications':
            certs = resume.certifications.all().order_by('order')
            if certs.exists():
                elements.append(Paragraph("Certifications", section_heading))
                elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=6))
                for c in certs:
                    dt = f" ({c.issue_date})" if c.issue_date else ""
                    elements.append(Paragraph(f"<b>{c.name}</b> {f'- {c.issuer}' if c.issuer else ''}{dt}", body_text))
                elements.append(Spacer(1, 4))

    doc.build(elements)


def compile_pdf_document(doc_instance):
    """
    Isolated PDF compilation worker method.
    Tries pdflatex CLI command if available, falls back to ReportLab engine.
    """
    doc_instance.status = 'PROCESSING'
    doc_instance.save()

    resume = doc_instance.resume
    latex_code = generate_latex_source(resume, doc_instance.template.name if doc_instance.template else "Minimal ATS")
    doc_instance.latex_code = latex_code

    media_dir = Path(settings.MEDIA_ROOT) / 'resumes_pdf'
    media_dir.mkdir(parents=True, exist_ok=True)
    pdf_filename = f"resume_{resume.id}_{doc_instance.id.hex[:8]}.pdf"
    pdf_path = media_dir / pdf_filename

    # Attempt LaTeX compilation first using MiKTeX / system pdflatex
    miktex_paths = [
        r"C:\Users\srava\AppData\Local\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe",
        r"C:\Program Files\MiKTeX\miktex\bin\x64\pdflatex.exe",
        r"C:\Program Files (x86)\MiKTeX\miktex\bin\pdflatex.exe",
    ]
    pdflatex_bin = shutil.which('pdflatex') or shutil.which('xelatex')
    if not pdflatex_bin:
        for p in miktex_paths:
            if os.path.exists(p):
                pdflatex_bin = p
                break
    compiled = False

    if pdflatex_bin:
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                tex_file = Path(tmpdir) / "document.tex"
                tex_file.write_text(latex_code, encoding='utf-8')

                res = subprocess.run(
                    [pdflatex_bin, "-interaction=nonstopmode", "-output-directory", tmpdir, str(tex_file)],
                    stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=20
                )
                generated_tmp_pdf = Path(tmpdir) / "document.pdf"
                if generated_tmp_pdf.exists():
                    shutil.copy(generated_tmp_pdf, pdf_path)
                    compiled = True
        except Exception as e:
            doc_instance.error_message = f"LaTeX compiler error: {str(e)}"

    if not compiled:
        # Fallback to python reportlab engine
        try:
            generate_pdf_reportlab(resume, str(pdf_path))
            compiled = True
        except Exception as e:
            doc_instance.status = 'FAILED'
            doc_instance.error_message = f"PDF Generation Error: {str(e)}"
            doc_instance.save()
            return False

    if compiled:
        doc_instance.status = 'SUCCESS'
        doc_instance.pdf_file = f"resumes_pdf/{pdf_filename}"
        doc_instance.pdf_url = f"/media/resumes_pdf/{pdf_filename}"
        doc_instance.error_message = ""
        doc_instance.save()
        return True
