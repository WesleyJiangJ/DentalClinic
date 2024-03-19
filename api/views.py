from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response

from api.serializers import *

from api.models import *


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""

    queryset = User.objects.all()
    # queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """API endpoint that allows groups to be viewed or edited."""

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    # permission_classes = [permissions.IsAuthenticated]


class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer
    # permission_classes = [permissions.IsAuthenticated]


class Medical_HistoryViewSet(viewsets.ModelViewSet):
    queryset = Medical_History.objects.all()
    serializer_class = Medical_HistorySerializer
    # permission_classes = [permissions.IsAuthenticated]


# class AppointmentViewSet(viewsets.ModelViewSet):
#     queryset = Appointment.objects.all()
#     serializer_class = AppointmentSerializer
#     permission_classes = [permissions.IsAuthenticated]
