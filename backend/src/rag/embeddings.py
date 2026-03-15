from sentence_transformers import SentenceTransformer

# Se descarga la primera vez (~90MB) y queda en caché
# Modelo multilingüe — funciona muy bien con español
_model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)


def get_embedding(texto: str) -> list[float]:
    """
    Genera un vector de 384 dimensiones en local.
    Sin llamadas a APIs externas. Completamente gratis.
    """
    texto = texto.replace("\n", " ").strip()
    vector = _model.encode(texto, normalize_embeddings=True)
    return vector.tolist()