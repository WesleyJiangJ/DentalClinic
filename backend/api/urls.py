from django.urls import include, path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from rest_framework_simplejwt.views import TokenRefreshView
from api import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"patient", views.PatientViewSet)
router.register(r"personal", views.PersonalViewSet)
router.register(r"medicalhistory", views.MedicalHistoryViewSet)
router.register(r"appointment", views.AppointmentViewSet)
router.register(r"appointments", views.Appointments, basename="appointments")
router.register(r"treatment", views.TreatmentViewSet)
router.register(r"budget", views.BudgetViewSet)
router.register(r"payment", views.PaymentViewSet)
router.register(r"paymentcontrol", views.PaymentControlViewSet)
router.register(r"odontogram", views.OdontogramViewSet)
router.register(r"odontogramteeth", views.OdontogramTeethViewSet)
router.register(r"odontogramtoothcondition", views.OdontogramToothConditionViewSet)
router.register(r"notes", views.NotesViewSet)
router.register(r"files", views.FilesViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("docs/", include_docs_urls(title="API")),
    path("send-email/", views.send_contact_email, name="send_contact_email"),
    path(
        "api/token/",
        views.CustomTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("upload/", views.upload_file, name="upload_file"),
]

urlpatterns += router.urls
