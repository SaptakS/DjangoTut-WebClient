from django.shortcuts import render
from django.core.mail import send_mail
from tuts.forms import *
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.core.urlresolvers import reverse

def home(request):
    ''' Renders the template for home page of the website '''
    return render(request, 'index.html')

def contacts(request):
    ''' Renders the contacts page '''
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            name = request.POST.get('name')
            email = request.POST.get('email')
            phone = request.POST.get('phone')
            message = request.POST.get('message')
            send_mail('Contact Form Mail from - ' + name, message, email, ['info@studybasin.com'], fail_silently=False)     
            send_mail('Thank You for Contacting Us', "Thanks for contacting us. We will get back to you soon", 'info@studybasin.com', [email], fail_silently=False)

            return HttpResponseRedirect(reverse('/contact'))
    else:
        form = ContactForm() # A empty, unbound form

    return render_to_response(
        'contact.html',
        {'form':form},
        context_instance=RequestContext(request)
    )

def uc(request):
	'''Render the under construction page'''
	return render(request, '404.html')