from django.urls import path
from .views import (
    list_procedures,
    list_administrations,
    check_documents,
    upload_document,
)

urlpatterns = [
    path("procedures/", list_procedures),
    path("administrations/", list_administrations),
    path("check-documents/", check_documents),
    path("upload/", upload_document),
]