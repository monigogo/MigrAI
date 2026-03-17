import os
import psutil
import time
from sentence_transformers import SentenceTransformer

process = psutil.Process(os.getpid())
print(f"Memory before: {process.memory_info().rss / 1024 / 1024:.2f} MB")
model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
print(f"Memory after: {process.memory_info().rss / 1024 / 1024:.2f} MB")
