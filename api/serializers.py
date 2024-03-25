from django.contrib.auth.models import Group, User
from rest_framework import serializers

from api.models import *


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"


class PersonalSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Personal
        fields = "__all__"


class NewPatientSerializer(serializers.ModelSerializer):
    patient_data = PatientSerializer(write_only=True)
    class Meta:
        model = Medical_History
        fields = "__all__"
        extra_kwargs = {
            "id_patient": {"read_only": True},
        }

    def create(self, validated_data):
        patient_data = validated_data.pop("patient_data")
        patient = Patient.objects.create(**patient_data)
        print(validated_data)
        medical_history = Medical_History.objects.create(
            id_patient=patient, **validated_data
        )
        return medical_history
    
    def to_representation(self, instance):
        representation = super(NewPatientSerializer, self).to_representation(instance)
        patient_representation = PatientSerializer(instance.id_patient).data
        representation['patient_data'] = patient_representation
        return representation

# class AppointmentSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = Appointment
#         fields = '__all__'