from django.core.management.base import BaseCommand
from core.models import Procedure, RequiredDocument, Administration


class Command(BaseCommand):
    help = "Insert default SimplifyGov data"

    def handle(self, *args, **kwargs):
        data = {
            "visa": {
                "title": "Visa étudiant",
                "documents": [
                    ("passeport", "Passeport valide"),
                    ("lettre_admission", "Lettre d’admission"),
                    ("assurance", "Assurance"),
                    ("justificatif_ressources", "Justificatif de ressources"),
                ],
            },
            "cin": {
                "title": "Carte nationale CIN",
                "documents": [
                    ("acte_naissance", "Acte de naissance"),
                    ("photo", "Photo d’identité"),
                    ("justificatif_domicile", "Justificatif de domicile"),
                ],
            },
            "passeport": {
                "title": "Passeport",
                "documents": [
                    ("cin", "Carte nationale CIN"),
                    ("photo", "Photo d’identité"),
                    ("justificatif_domicile", "Justificatif de domicile"),
                    ("ancien_passeport", "Ancien passeport"),
                ],
            },
        }

        for code, info in data.items():
            procedure, _ = Procedure.objects.get_or_create(
                code=code,
                defaults={"title": info["title"]}
            )

            for doc_code, label in info["documents"]:
                RequiredDocument.objects.get_or_create(
                    procedure=procedure,
                    code=doc_code,
                    defaults={"label": label}
                )

        administrations = [
    {
        "name": "Préfecture Rabat",
        "type": "Administration préfectorale",
        "city": "Rabat",
        "address": "Rue Moulay Slimane",
        "hours": "08:30 - 16:30",
        "latitude": 34.0209,
        "longitude": -6.8416,
    },
    {
        "name": "Préfecture de Police Rabat",
        "type": "Police / Commissariat",
        "city": "Rabat",
        "address": "Rue Trabless",
        "hours": "08:00 - 18:00",
        "latitude": 34.01670074,
        "longitude": -6.83333015,
    },
    {
        "name": "Tribunal de Première Instance Rabat",
        "type": "Justice / Tribunal",
        "city": "Rabat",
        "address": "Avenue de Madagascar",
        "hours": "08:30 - 15:30",
        "latitude": 34.0177,
        "longitude": -6.8326,
    },
]

        for admin in administrations:
            Administration.objects.get_or_create(
                name=admin["name"],
                defaults=admin
            )

        self.stdout.write(self.style.SUCCESS("Default data inserted successfully"))