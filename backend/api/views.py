from django.contrib.auth.models import Group, User
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, viewsets
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from api.serializers import *
from api.models import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["email"]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    # permission_classes = [permissions.IsAuthenticated]


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    # permission_classes = [permissions.IsAuthenticated]


class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer
    # permission_classes = [permissions.IsAuthenticated]


class MedicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_patient"]


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    # permission_classes = [permissions.IsAuthenticated]


class Appointments(viewsets.ReadOnlyModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_patient", "id_personal"]


class TreatmentViewSet(viewsets.ModelViewSet):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_patient"]


class BudgetDetailViewSet(viewsets.ModelViewSet):
    queryset = Budget_Detail.objects.all()
    serializer_class = BudgetDetailSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_budget__id_patient"]


class PaymentControlFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(
        field_name="created_at", lookup_expr="gte", label="Start Date"
    )
    end_date = django_filters.DateFilter(
        field_name="created_at", lookup_expr="lte", label="End Date"
    )

    class Meta:
        model = PaymentControl
        fields = ["start_date", "end_date"]


class PaymentControlViewSet(viewsets.ModelViewSet):
    queryset = PaymentControl.objects.all()
    serializer_class = PaymentControlSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PaymentControlFilter


class OdontogramViewSet(viewsets.ModelViewSet):
    queryset = Odontogram.objects.all()
    serializer_class = OdontogramSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id", "id_patient"]


class OdontogramTeethViewSet(viewsets.ModelViewSet):
    queryset = OdontogramTeeth.objects.all()
    serializer_class = OdontogramTeethSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_odontogram", "tooth_number"]


class OdontogramToothConditionViewSet(viewsets.ModelViewSet):
    queryset = OdontogramToothCondition.objects.all()
    serializer_class = OdontogramToothConditionSerializer


class NotesViewSet(viewsets.ModelViewSet):
    queryset = Notes.objects.all()
    serializer_class = NotesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        "content_type__app_label": ["exact"],
        "content_type__model": ["exact"],
        "object_id": ["exact"],
        "id": ["exact"],
    }


@csrf_exempt
def send_contact_email(request):
    if request.method == "POST":
        name = request.POST.get("name")
        lastname = request.POST.get("lastname")
        email = request.POST.get("email")
        message = request.POST.get("message")

        subject = f"Nuevo mensaje de {name} {lastname}"
        body = f"Nombre: {name} {lastname}\nCorreo: {email}\n\nMensaje:\n{message}"
        send_mail(subject, body, email, ["cdiespecializada@gmail.com"])

        return JsonResponse({"status": "success", "message": "Mensaje enviado"})
    return JsonResponse({"status": "fail", "message": "Error."}, status=405)
