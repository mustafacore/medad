from django.urls import path
from apps.usermodule import views

urlpatterns = [
    path("", views.index, name="index"),  # Main input page
    path("generate/", views.generate_text, name="generate_text"),  # Process form and display result page
    path("about/", views.about, name="about"),  # About page
    path("contact/", views.contact, name="contact"),  # Contact page
    path("status/<uuid:job_id>/", views.check_status, name="check_status"),
    path("contact/send/", views.contact_proxy, name="contact_proxy"),
]
