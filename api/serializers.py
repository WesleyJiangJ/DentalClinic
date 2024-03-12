import importlib
from django.contrib.auth.models import Group, User
from rest_framework import serializers

from api.models import *


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class PatientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class PersonalSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Personal
        fields = '__all__'

class Medical_HistorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Medical_History
        fields = '__all__'
        
class AppointmentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'