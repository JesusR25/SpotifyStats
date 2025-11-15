from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException
from app.utils.cookies import get_tokens_from_cookies, set_tokens_in_cookies
from app.services.auth_service import AuthService

class AuthMiddleware(BaseHTTPMiddleware):

    def __init__(self, app):
        super().__init__(app)
        self.auth_service = AuthService()


    async def dispatch(self, request:Request, call_next):
        try:
            access_token, refresh_token = get_tokens_from_cookies(request)

            if not access_token:
                if refresh_token:
                    tokens = self.auth_service.refresh_token(refresh_token=refresh_token)
                    response = await call_next(request)
                    set_tokens_in_cookies(response=response, tokens=tokens)
                    return response
                else:
                    raise HTTPException(status_code=403,detail="Por favor vuelve a iniciar sesión.")

            response = await call_next(request)
            return response

        except HTTPException:
            raise
        except Exception as e:
            print("Ocurrio un error tratando de validar la autenticación del usuario.")