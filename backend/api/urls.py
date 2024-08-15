from django.urls import include, path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls

from api import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"patient", views.PatientViewSet)
router.register(r"personal", views.PersonalViewSet)
router.register(r"new_patient", views.NewPatientViewSet)
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

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("docs/", include_docs_urls(title="API")),
]

urlpatterns += router.urls
