from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),  # Main input page
    path("generate/", views.generate_text, name="generate_text"),  # Process form and display result page
    path("about/", views.about, name="about"),  # About page
    path("contact/", views.contact, name="contact"),  # Contact page
]
