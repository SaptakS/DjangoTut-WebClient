from django import forms
from django.utils.translation import ugettext_lazy as _

class ContactForm(forms.Form):

    name = forms.CharField(widget=forms.TextInput(attrs=dict(required=True, max_length=30)), label='Name')
    email = forms.EmailField(widget=forms.TextInput(attrs=dict(required=True, max_length=30)), label=_("Email"))
    phone = forms.CharField(widget=forms.TextInput(attrs=dict(required=True, max_length=15, render_value=False)), label=_("Contact No."))
    message = forms.CharField(widget=forms.Textarea(attrs=dict(required=True, max_length=100, render_value=False)), label=_("Message"))
