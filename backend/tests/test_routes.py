import pytest
from httpx import AsyncClient, ASGITransport
from src.api.main import app


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        res = await client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_listar_paises():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        res = await client.get("/api/v1/paises")
    assert res.status_code == 200
    data = res.json()
    assert "paises" in data
    assert "Colombia" in data["paises"]
    assert "Brasil" in data["paises"]
    assert len(data["paises"]) == 21


_FORM_DOCUMENTO = {
    "pregunta": "¿Qué dice este documento?",
    "sesion_id": "test-123",
    "pais": "Colombia",
    "rango_edad": "26-35",
}


@pytest.mark.asyncio
async def test_documento_rechaza_tipo_no_pdf():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        res = await client.post(
            "/api/v1/preguntar-con-documento",
            data=_FORM_DOCUMENTO,
            files={"archivo": ("nota.txt", b"hola", "text/plain")},
        )
    assert res.status_code == 415


@pytest.mark.asyncio
async def test_documento_rechaza_pdf_demasiado_grande():
    from src.api.routes import MAX_PDF_BYTES

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        res = await client.post(
            "/api/v1/preguntar-con-documento",
            data=_FORM_DOCUMENTO,
            files={"archivo": ("grande.pdf", b"x" * (MAX_PDF_BYTES + 1), "application/pdf")},
        )
    assert res.status_code == 413