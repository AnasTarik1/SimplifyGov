from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Procedure, UploadedDocument, Administration
from .serializers import ProcedureSerializer, UploadedDocumentSerializer, AdministrationSerializer
from .services import extract_text, detect_document_type

@api_view(["GET"])
def list_procedures(request):
    procedures = Procedure.objects.all()
    serializer = ProcedureSerializer(procedures, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def list_administrations(request):
    administrations = Administration.objects.all()
    serializer = AdministrationSerializer(administrations, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def check_documents(request):
    procedure_code = request.data.get("procedure")
    uploaded_docs = request.data.get("documents", [])

    try:
        procedure = Procedure.objects.get(code=procedure_code)
    except Procedure.DoesNotExist:
        return Response({"error": "Procédure inconnue"}, status=404)

    required_docs = procedure.documents.all()
    required_codes = [doc.code for doc in required_docs]

    present = [doc for doc in required_codes if doc in uploaded_docs]
    missing = [doc for doc in required_codes if doc not in uploaded_docs]

    return Response({
        "procedure": procedure.code,
        "present": present,
        "missing": missing,
        "complete": len(missing) == 0
    })


@api_view(["POST"])
def upload_document(request):
    file = request.FILES.get("file")

    if not file:
        return Response({"error": "Aucun fichier envoyé"}, status=400)

    uploaded = UploadedDocument.objects.create(
        file=file,
        filename=file.name,
        detected_type="inconnu",
        extracted_text=""
    )

    file_path = uploaded.file.path

    extracted_text = extract_text(file_path)
    detected_type = detect_document_type(extracted_text, uploaded.filename)

    uploaded.extracted_text = extracted_text[:3000]
    uploaded.detected_type = detected_type
    uploaded.save()

    serializer = UploadedDocumentSerializer(uploaded)

    return Response({
        "message": "Document uploadé et analysé avec succès",
        "document": serializer.data
    })