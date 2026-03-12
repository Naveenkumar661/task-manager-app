from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────────────────
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.profile_view, name='profile'),

    # ── Tasks ─────────────────────────────────────────────────────────────────
    path('tasks/', views.TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/stats/', views.task_stats_view, name='task-stats'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
]
