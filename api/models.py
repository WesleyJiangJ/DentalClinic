from django.db import models

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

ODONTOGRAM = [
    (0, "Diente sano", "#FFFFFF"),  # Blanco
    (1, "Caries", "#FF0000"),  # Rojo
    (2, "Restauración", "Obturación", "#FFFF00"),  # Amarillo
    (3, "Endodoncia", "#00FF00"),  # Verde
    (4, "Extracción", "#808080"),  # Gris
    (5, "Fractura", "#800080"),  # Púrpura
    (6, "Absceso", "#FFA500"),  # Naranja
    (7, "Retracción gingival", "#00FFFF"),  # Cian
    (8, "Diente impactado", "#008080"),  # Verde azulado
    (9, "Supernumerario", "#FF1493"),  # Rosa fuerte
    (10, "Maloclusión", "#800000"),  # Marrón
    (11, "Movilidad", "#FF4500"),  # Naranja rojizo
    (12, "Erupción dental", "#40E0D0"),  # Turquesa medio
    (13, "Quiste dental", "#DA70D6"),  # Violeta claro
    (14, "Manchas o decoloraciones", "#D2691E"),  # Chocolate
    (15, "Hipoplasia del esmalte", "#B0E0E6"),  # Azul claro
    (16, "Sensibilidad dental", "#8B4513"),  # Silla de montar marrón
    (17, "Desgaste dental", "#A9A9A9"),  # Gris oscuro
    (18, "Erosión dental", "#008B8B"),  # Verde azulado oscuro
    (19, "Recesión gingival", "#2E8B57"),  # Verde mar oscuro
    (20, "Hipertrofia gingival", "#FFD700"),  # Amarillo oro
    (21, "Lesiones mucosas orales", "#8A2BE2"),  # Azul violeta oscuro
    (22, "Bruxismo", "#FF6347"),  # Tomate
    (23, "Trastornos de la ATM", "#6A5ACD"),  # Azul lavanda
    (24, "Cierre de diastemas", "#00FF7F"),  # Verde primavera
    (25, "Anomalías dentales", "#9932CC"),  # Púrpura oscuro
    (26, "Restos radiculares", "#8B0000"),  # Rojo oscuro
    (27, "Amelogénesis imperfecta", "#FFDAB9"),  # Melocotón
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
    email = models.EmailField()
    address = models.CharField(max_length=256)
    origin = models.CharField(max_length=2, choices=DEPARTMENTS)
    marital_status = models.CharField(max_length=1, choices=MARITAL_STATUS)
    occupation = models.CharField(max_length=30)
    emergency_contact = models.CharField(max_length=60)
    emergency_number = models.CharField(max_length=8)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Personal(models.Model):
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30)
    first_lastname = models.CharField(max_length=30)
    second_lastname = models.CharField(max_length=30)
    birthdate = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER)
    phone_number = models.CharField(max_length=8)
    email = models.EmailField()
    address = models.CharField(max_length=256)
    role = models.CharField(max_length=1)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


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
    observation = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)


# Appointment
class Appoitment(models.Model):
    id_patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    id_personal = models.ForeignKey(Personal, on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    status = models.CharField(max_length=1)
    observation = models.TextField(null=True)
    notes = models.TextField(null=True)


# Budget & Payments
class Budget(models.Model):
    id_patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    status = models.CharField(max_length=1)
    created_at = models.DateTimeField(auto_now_add=True)


class Budget_Detail(models.Model):
    id_budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    treatment = models.CharField(max_length=60)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class Payment_Control(models.Model):
    id_budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Payment_Control_History(models.Model):
    id_budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    modified_by = models.ForeignKey(Personal, on_delete=models.CASCADE)
    description = models.TextField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)


# Odontogram
class Odontogram(models.Model):
    id_medical_history = models.ForeignKey(Medical_History, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Odontogram_Area(models.Model):
    area = models.IntegerField()


class Odontogram_Teeth(models.Model):
    teeth = models.IntegerField()


class Odontogram_Face(models.Model):
    face = models.CharField(max_length=10)


class Odontogram_Status(models.Model):
    description = models.CharField(max_length=50)
    color = models.CharField(max_length=7)


class Odontogram_Resume(models.Model):
    id_odontogram = models.ForeignKey(Odontogram, on_delete=models.CASCADE)
    id_area = models.ForeignKey(Odontogram_Area, on_delete=models.CASCADE)
    id_teeth = models.ForeignKey(Odontogram_Teeth, on_delete=models.CASCADE)
    id_face = models.ForeignKey(Odontogram_Face, on_delete=models.CASCADE)
    id_status = models.ForeignKey(Odontogram_Status, on_delete=models.CASCADE)