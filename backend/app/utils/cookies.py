from fastapi import Request, Response

def get_tokens_from_cookies(request: Request):
    return (
        request.cookies.get("access_token"),
        request.cookies.get("refresh_token")
    )

def set_tokens_in_cookies(response: Response, tokens: dict):
    access_token = tokens.get('access_token')
    expires_in = tokens.get('expires_in')
    refresh_token = tokens.get('refresh_token')
    print(f"access_token: {access_token}")
    print(f"expires_in: {expires_in}")
    print(f"refresh_token: {refresh_token}")

    response.set_cookie(key='access_token', value=access_token, httponly=True, secure=True, samesite='none', max_age=expires_in, domain=".onrender.com")
    if refresh_token:
        response.set_cookie(key='refresh_token', value=refresh_token, httponly=True, secure=True, samesite='none', max_age=86400, domain=".onrender.com")