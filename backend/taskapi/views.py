from django.contrib.auth.models import User
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import Task
from .serializers import RegisterSerializer, UserSerializer, TaskSerializer


# ── Auth Views ────────────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    """POST /api/register/ - Create new user"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'Account created successfully!',
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """POST /api/login/ - Login and get JWT tokens"""
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=400)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid credentials.'}, status=401)

    refresh = RefreshToken.for_user(user)
    return Response({
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """POST /api/logout/ - Blacklist refresh token"""
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logged out successfully.'})
    except Exception:
        return Response({'error': 'Invalid token.'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """GET /api/profile/ - Get current user info"""
    return Response(UserSerializer(request.user).data)


# ── Task Views ────────────────────────────────────────────────────────────────

class TaskListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/tasks/         - List all tasks for logged-in user
    POST /api/tasks/         - Create a new task
    Supports: ?status=pending|completed  ?priority=low|medium|high  ?search=keyword
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'deadline', 'priority']

    def get_queryset(self):
        qs = Task.objects.filter(user=self.request.user)
        status_filter = self.request.query_params.get('status')
        priority_filter = self.request.query_params.get('priority')
        if status_filter in ['pending', 'completed']:
            qs = qs.filter(status=status_filter)
        if priority_filter in ['low', 'medium', 'high']:
            qs = qs.filter(priority=priority_filter)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/tasks/<id>/  - Get single task
    PUT    /api/tasks/<id>/  - Update task
    PATCH  /api/tasks/<id>/  - Partial update (e.g., toggle status)
    DELETE /api/tasks/<id>/  - Delete task
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_stats_view(request):
    """GET /api/tasks/stats/ - Task counts summary"""
    qs = Task.objects.filter(user=request.user)
    total = qs.count()
    completed = qs.filter(status='completed').count()
    pending = qs.filter(status='pending').count()
    high_priority = qs.filter(priority='high', status='pending').count()
    return Response({
        'total': total,
        'completed': completed,
        'pending': pending,
        'high_priority': high_priority,
    })
