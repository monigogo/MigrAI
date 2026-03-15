import fitz  # PyMuPDF


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Lee los bytes de un PDF y devuelve el texto completo.
    Se usa cuando el usuario adjunta un documento de su comunidad autónoma.
    """
    doc   = fitz.open(stream=file_bytes, filetype="pdf")
    partes = []

    for num_pag, pagina in enumerate(doc, start=1):
        texto = pagina.get_text()
        if texto.strip():
            partes.append(f"── Página {num_pag} ──\n{texto}")

    doc.close()
    texto_completo = "\n".join(partes)

    if not texto_completo.strip():
        return (
            "No se pudo extraer texto de este documento. "
            "Puede ser un PDF escaneado sin OCR. "
            "Por favor, describe el contenido del documento con tus palabras."
        )

    return texto_completo