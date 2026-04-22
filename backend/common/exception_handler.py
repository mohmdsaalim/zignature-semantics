from rest_framework.views import exception_handler as drf_exception_handler


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is not None:
        code = getattr(exc, "default_code", "error")
        if isinstance(code, str):
            code = code.upper()

        response.data = {
            "error": {
                "code": code,
                "message": str(exc.detail) if hasattr(exc, "detail") else str(exc),
                "details": response.data if isinstance(response.data, dict) else None,
            }
        }

    return response
