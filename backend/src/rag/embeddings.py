from sentence_transformers import SentenceTransformer

_model: SentenceTransformer | None = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(
            "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
    return _model


def get_embedding(texto: str) -> list[float]:
    """
    Genera un vector de 384 dimensiones en local.
    Sin llamadas a APIs externas. Completamente gratis.
    """
    texto = texto.replace("\n", " ").strip()
    vector = _get_model().encode(texto, normalize_embeddings=True)
    return vector.tolist()