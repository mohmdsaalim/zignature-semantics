from django.urls import path

from .views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    GoogleLoginView,
    LogoutView,
    PasswordChangeView,
    RegisterView,
    UserView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", CookieTokenObtainPairView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="auth-token-refresh"),
    path("password/change/", PasswordChangeView.as_view(), name="auth-password-change"),
    path("user/", UserView.as_view(), name="auth-user"),
    path("google/", GoogleLoginView.as_view(), name="auth-google"),
]
