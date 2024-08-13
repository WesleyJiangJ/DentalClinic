from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

GENDER = [
    ("F", "Femenino"),
    ("M", "Masculino"),
]

DEPARTMENTS = [
    ("BO", "Boaco"),
    ("CA", "Carazo"),
    ("CI", "Chinandega"),
    ("CO", "Chontales"),
    ("ES", "Estelí"),
    ("GR", "Granada"),
    ("JI", "Jinotega"),
    ("LE", "León"),
    ("MD", "Madriz"),
    ("MN", "Managua"),
    ("MS", "Masaya"),
    ("MT", "Matagalpa"),
    ("NS", "Nueva Segovia"),
    ("SJ", "Río San Juan"),
    ("RV", "Rivas"),
    ("AN", "Región Autónoma de la Costa Caribe Norte"),
    ("AS", "Región Autónoma de la Costa Caribe Sur"),
]
MARITAL_STATUS = [
    ("S", "Soltero"),
    ("C", "Casado"),
    ("D", "Divorciado"),
    ("U", "Unión libre"),
    ("V", "Viudo"),
]

TEETH_STATUS = [
    (0, "Diente sano"),
    (1, "Caries"),
    (2, "Restauración"),
    (3, "Endodoncia"),
    (4, "Extracción"),
    (5, "Fractura"),
    (6, "Absceso"),
    (7, "Retracción gingival"),
    (8, "Diente impactado"),
    (9, "Supernumerario"),
    (10, "Maloclusión"),
    (11, "Movilidad"),
    (12, "Erupción dental"),
    (13, "Quiste dental"),
    (14, "Manchas o decoloraciones"),
    (15, "Hipoplasia del esmalte"),
    (16, "Sensibilidad dental"),
    (17, "Desgaste dental"),
    (18, "Erosión dental"),
    (19, "Recesión gingival"),
    (20, "Hipertrofia gingival"),
    (21, "Lesiones mucosas orales"),
    (22, "Bruxismo"),
    (23, "Trastornos de la ATM"),
    (24, "Cierre de diastemas"),
    (25, "Anomalías dentales"),
    (26, "Restos radiculares"),
    (27, "Amelogénesis imperfecta"),
]

SURFACE = [
    ("F", "Facial"),
    ("D", "Distral"),
    ("M", "Mesial"),
    ("L", "Lingual"),
    ("O", "Occlusal"),
]

ROLE = [
    (1, "Admin"),
    (2, "Doctor"),
    (3, "Asistente"),
    (4, "Paciente"),
]

APPOINTMENTSTATUS = [
    (1, "Activa"),
    (2, "Cancelada"),
    (3, "Realizada"),
]


# People
class Patient(models.Model):
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30)
    first_lastname = models.CharField(max_length=30)
    second_lastname = models.CharField(max_length=30)
    birthdate = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER)
    phone_number = models.CharField(max_length=8)
    email = models.EmailField(max_length=255, unique=True)
    address = models.CharField(max_length=256)
    origin = models.CharField(max_length=2, choices=DEPARTMENTS)
    marital_status = models.CharField(max_length=1, choices=MARITAL_STATUS)
    occupation = models.CharField(max_length=30)
    emergency_contact = models.CharField(max_length=60)
    emergency_number = models.CharField(max_length=8)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            self.first_name
            + " "
            + self.middle_name
            + " "
            + self.first_lastname
            + " "
            + self.second_lastname
        )


class Personal(models.Model):
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30)
    first_lastname = models.CharField(max_length=30)
    second_lastname = models.CharField(max_length=30)
    birthdate = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER)
    phone_number = models.CharField(max_length=8)
    origin = models.CharField(max_length=2, choices=DEPARTMENTS)
    email = models.EmailField()
    address = models.CharField(max_length=256)
    role = models.CharField(max_length=1, choices=ROLE)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            self.first_name
            + " "
            + self.middle_name
            + " "
            + self.first_lastname
            + " "
            + self.second_lastname
        )


class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    idPatient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True)
    idPersonal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


# Medical History
class Medical_History(models.Model):
    id_patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    allergies = models.BooleanField(default=False)
    pathological = models.BooleanField(default=False)
    pharmacological = models.BooleanField(default=False)
    hospitalitazation = models.BooleanField(default=False)
    surgical = models.BooleanField(default=False)
    transfusion = models.BooleanField(default=False)
    radiotherapy = models.BooleanField(default=False)
    chemotherapy = models.BooleanField(default=False)
    habit = models.BooleanField(default=False)
    observation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


# Appointment
class Appointment(models.Model):
    id_patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    id_personal = models.ForeignKey(Personal, on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    status = models.CharField(max_length=1, default=1, choices=APPOINTMENTSTATUS)
    reason = models.TextField(blank=False)
    observation = models.TextField(blank=True)


# Budget & Payments
class Treatment(models.Model):
    name = models.CharField(max_length=60)
    description = models.CharField(max_length=250)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Budget(models.Model):
    id_patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=256)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Budget_Detail(models.Model):
    id_budget = models.ForeignKey(
        Budget, related_name="detailFields", on_delete=models.CASCADE
    )
    id_treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE)
    id_personal = models.ForeignKey(
        Personal, on_delete=models.CASCADE, limit_choices_to={"role": 2}
    )
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class Payment(models.Model):
    id_budget = models.ForeignKey(Budget, on_delete=models.CASCADE, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


class PaymentControl(models.Model):
    id_payment = models.ForeignKey(Payment, on_delete=models.CASCADE)
    paid = models.DecimalField(max_digits=10, decimal_places=2)
    # note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Odontogram(models.Model):
    id_patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, limit_choices_to={"status": True}
    )
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class OdontogramTeeth(models.Model):
    id_odontogram = models.ForeignKey(Odontogram, on_delete=models.CASCADE)
    tooth_number = models.PositiveSmallIntegerField()
    surface = models.CharField(max_length=1, choices=SURFACE)
    observation = models.CharField(max_length=256, blank=True)
    status = models.CharField(max_length=2, choices=TEETH_STATUS)