import os
import subprocess
from django.contrib.auth.models import Group, User
from django.contrib.contenttypes.models import ContentType
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from django.core.mail import send_mail
from django.core.files.storage import default_storage
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import storage
from api.serializers import *
from api.models import *


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["email"]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def get_queryset(self):
        user = self.request.user
        # If the user is a clinic staff, it return all patients
        if user.groups.filter(name="PersonalGroup").exists():
            return Patient.objects.all()
        # If the user is a patient, it return only their information
        if user.groups.filter(name="PatientGroup").exists():
            return Patient.objects.filter(user=user)
        # If not is a doctor or a patient, it return an empty queryset
        return Patient.objects.none()


class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer

    def get_queryset(self):
        user = self.request.user
        # If the user is a clinic staff, it return all personal
        if user.groups.filter(name="PersonalGroup").exists():
            return Personal.objects.all()
        return Personal.objects.none()


class MedicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id_patient"]

    def get_queryset(self):
        user = self.request.user
        # If the user is a clinic staff, it return all medical history
        if user.groups.filter(name="PersonalGroup").exists():
            return MedicalHistory.objects.all()
        return MedicalHistory.objects.none()


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        # If the user is a clinic staff, it return all appointments
        if user.groups.filter(name="PersonalGroup").exists():
            return Appointment.objects.all()
        # If the user is a patient, it return only their information
        if user.groups.filter(name="PatientGroup").exists():
            patient = Patient.objects.get(user=user)
            return Appointment.objects.filter(id_patient=patient.pk)
        # If not is a doctor or a patient, it return an empty queryset
        return Appointment.objects.none()


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

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name="PersonalGroup").exists():
            return Odontogram.objects.all()
        return Odontogram.objects.none()


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

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name="PersonalGroup").exists():
            return Notes.objects.all()
        return Notes.objects.none()


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


@api_view(["POST"])
def upload_file(request):
    file_obj = request.FILES["file"]
    bucket = storage.bucket()
    blob = bucket.blob(file_obj.name)
    blob.upload_from_file(file_obj.file)
    blob.make_public()
    file_url = blob.public_url

    return JsonResponse({"file_url": file_url}, status=201)


class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        "content_type__app_label": ["exact"],
        "content_type__model": ["exact"],
        "object_id": ["exact"],
    }


def get_content_type(request, app_label, model_name):
    try:
        content_type = ContentType.objects.get(
            app_label=app_label, model=model_name.lower()
        )
        return JsonResponse({"content_type_id": content_type.id})
    except ContentType.DoesNotExist:
        return JsonResponse({"error": "Model not found"}, status=404)


class DatabaseBackupView(APIView):
    def get(self, request):
        try:
            # Path where the backup will be temporarily stored
            backup_dir = settings.DBBACKUP_STORAGE_OPTIONS["location"]

            # Create the backup
            subprocess.run(["python", "manage.py", "dbbackup"], check=True)

            # Find the most recent backup file
            backup_files = sorted(
                [f for f in os.listdir(backup_dir) if f.endswith(".dump")],
                key=lambda f: os.path.getmtime(os.path.join(backup_dir, f)),
                reverse=True,
            )
            if not backup_files:
                return JsonResponse(
                    {"error": "No backup files were found."}, status=404
                )

            # Select the most recent file
            backup_file_path = os.path.join(backup_dir, backup_files[0])

            # Open the file and send it as response
            with open(backup_file_path, "rb") as backup_file:
                response = HttpResponse(
                    backup_file.read(), content_type="application/octet-stream"
                )
                response["Content-Disposition"] = (
                    f"attachment; filename={backup_files[0]}"
                )

            # Remove the file after sending it as response
            os.remove(backup_file_path)

            return response

        except subprocess.CalledProcessError:
            return JsonResponse(
                {"error": "There was a problem creating the backup."}, status=500
            )


class DatabaseRestoreView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        if "file" not in request.FILES:
            return JsonResponse(
                {"error": "No se proporcionó ningún archivo de backup."}, status=400
            )

        # Temporarily save the uploaded file
        backup_file = request.FILES["file"]
        temp_file_path = os.path.join(
            settings.DBBACKUP_STORAGE_OPTIONS["location"], backup_file.name
        )

        with default_storage.open(temp_file_path, "wb+") as destination:
            for chunk in backup_file.chunks():
                destination.write(chunk)

        try:
            # Restore the database
            subprocess.run(
                [
                    "python",
                    "manage.py",
                    "dbrestore",
                    "--input-filename",
                    temp_file_path,
                    "--noinput",
                ],
                check=True,
            )
            return JsonResponse(
                {"success": "The database was successfully restored."}, status=200
            )

        except subprocess.CalledProcessError:
            return JsonResponse(
                {"error": "There was a problem restoring the database."}, status=500
            )

        finally:
            # Delete the temporary file after restore
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
