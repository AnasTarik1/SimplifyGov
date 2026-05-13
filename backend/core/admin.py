from django.contrib import admin
from .models import Procedure, RequiredDocument, UploadedDocument, Administration


class RequiredDocumentInline(admin.TabularInline):
    model = RequiredDocument
    extra = 1


@admin.register(Procedure)
class ProcedureAdmin(admin.ModelAdmin):
    list_display = ("id", "code", "title")
    search_fields = ("code", "title")
    inlines = [RequiredDocumentInline]


@admin.register(RequiredDocument)
class RequiredDocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "procedure", "code", "label")
    search_fields = ("code", "label")
    list_filter = ("procedure",)


@admin.register(UploadedDocument)
class UploadedDocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "filename", "detected_type", "uploaded_at")
    search_fields = ("filename", "detected_type")
    list_filter = ("detected_type", "uploaded_at")


@admin.register(Administration)
class AdministrationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "type", "city", "hours")
    search_fields = ("name", "type", "city")
    list_filter = ("city", "type")