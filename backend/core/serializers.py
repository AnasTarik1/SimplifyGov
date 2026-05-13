from rest_framework import serializers
from .models import Procedure, RequiredDocument, UploadedDocument, Administration


class RequiredDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequiredDocument
        fields = ["id", "code", "label"]


class ProcedureSerializer(serializers.ModelSerializer):
    documents = RequiredDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Procedure
        fields = ["id", "code", "title", "documents"]


class UploadedDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedDocument
        fields = ["id", "file", "filename", "detected_type", "extracted_text", "uploaded_at"]


class AdministrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administration
        fields = ["id", "name", "type", "city", "address", "hours", "latitude", "longitude"]