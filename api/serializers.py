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


class PersonalSerializer(serializers.ModelSerializer):
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
        medical_history = Medical_History.objects.create(
            id_patient=patient, **validated_data
        )
        return medical_history

    def to_representation(self, instance):
        representation = super(NewPatientSerializer, self).to_representation(instance)
        patient_representation = PatientSerializer(instance.id_patient).data
        representation["patient_data"] = patient_representation
        return representation


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"

    def to_representation(self, instance):
        representation = super(AppointmentSerializer, self).to_representation(instance)
        patient_representation = PatientSerializer(instance.id_patient).data
        personal_representation = PersonalSerializer(instance.id_personal).data
        representation["patient_data"] = patient_representation
        representation["personal_data"] = personal_representation
        return representation


class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = "__all__"


class BudgetDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget_Detail
        fields = "__all__"
        extra_kwargs = {
            "id_budget": {"read_only": True},
        }

    def to_representation(self, instance):
        representation = super(BudgetDetailSerializer, self).to_representation(instance)
        treatment_representation = TreatmentSerializer(instance.id_treatment).data
        representation["treatment_data"] = treatment_representation
        return representation


class BudgetSerializer(serializers.ModelSerializer):
    detailFields = BudgetDetailSerializer(many=True)

    class Meta:
        model = Budget
        fields = "__all__"

    def create(self, validated_data):
        detail_data = validated_data.pop("detailFields")
        budget = Budget.objects.create(**validated_data)
        for detail in detail_data:
            Budget_Detail.objects.create(id_budget=budget, **detail)
        return budget

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.status = validated_data.get("status", instance.status)
        instance.save()

        detail_data = validated_data.pop("detailFields", [])
        Budget_Detail.objects.filter(id_budget=instance).delete()

        for detail in detail_data:
            Budget_Detail.objects.create(id_budget=instance, **detail)
        return instance

    def to_representation(self, instance):
        representation = super(BudgetSerializer, self).to_representation(instance)
        patient_representation = PatientSerializer(instance.id_patient).data
        representation["patient_data"] = patient_representation
        return representation
