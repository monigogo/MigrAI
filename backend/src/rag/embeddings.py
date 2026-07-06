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

    texto = texto.replace("\n", " ").strip()
    vector = _get_model().encode(texto, normalize_embeddings=True)
    return vector.tolist()