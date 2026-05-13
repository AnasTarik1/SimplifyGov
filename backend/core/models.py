from django.db import models


class Procedure(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=150)

    def __str__(self):
        return self.title


class RequiredDocument(models.Model):
    procedure = models.ForeignKey(
        Procedure,
        related_name="documents",
        on_delete=models.CASCADE
    )

    code = models.CharField(max_length=80)
    label = models.CharField(max_length=150)

    def __str__(self):
        return self.label


class UploadedDocument(models.Model):
    file = models.FileField(upload_to="documents/")
    filename = models.CharField(max_length=255)

    detected_type = models.CharField(
        max_length=80,
        default="inconnu"
    )

    extracted_text = models.TextField(blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.filename


class Administration(models.Model):
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    hours = models.CharField(max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name