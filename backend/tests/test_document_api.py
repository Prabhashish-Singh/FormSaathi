import unittest

from fastapi.testclient import TestClient

from app.main import app


class DocumentApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_endpoint_is_available(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_document_upload_requires_authentication(self):
        response = self.client.post(
            "/api/documents/upload",
            files={"file": ("notice.pdf", b"%PDF-test", "application/pdf")},
        )
        self.assertEqual(response.status_code, 401)

    def test_document_list_requires_bearer_token(self):
        response = self.client.get("/api/documents")
        self.assertIn(response.status_code, {401, 422})

    def test_auth_me_requires_bearer_token(self):
        response = self.client.get("/api/auth/me")
        self.assertIn(response.status_code, {401, 422})

    def test_standalone_upload_requires_authentication(self):
        response = self.client.post(
            "/api/upload",
            files={"file": ("notice.pdf", b"%PDF-test", "application/pdf")},
        )
        self.assertEqual(response.status_code, 401)

    def test_standalone_ask_requires_authentication(self):
        response = self.client.post(
            "/api/ask",
            json={
                "document_text": "Test document",
                "question": "What is this?",
                "output_language": "English",
            },
        )
        self.assertEqual(response.status_code, 401)

    def test_cors_preflight_allows_the_vite_development_origin(self):
        response = self.client.options(
            "/api/documents/upload",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "authorization,content-type",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.headers["access-control-allow-origin"],
            "http://localhost:5173",
        )


if __name__ == "__main__":
    unittest.main()
