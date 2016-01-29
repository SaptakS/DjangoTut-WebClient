"""tuts URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Import the include() function: from django.conf.urls import url, include
    3. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import url
from django.contrib import admin
from django.conf.urls import patterns, include, url

import login.views as login_views
import courses.views as courses_views
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.home),
    url(r'^home/$', views.home),
    url(r'^contact/$', views.contacts),
    url(r'^uc/$', views.uc),
    url(r'^course-single/$', courses_views.course_single),
    url(r'^courses-listing/$', courses_views.courses_listing),
    url(r'^gkdose/$', courses_views.gkdose),
    url(r'^mock/$', courses_views.mock),
    url(r'^quiz/$', include('quiz.urls')),
    #url(r'^$', 'django.contrib.auth.views.login'),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login'), # If user is not login it will redirect to login page
    url(r'^register/$', login_views.register),
    url(r'^register/success/$', login_views.register_success),
    #url(r'^home/$', login_views.home),
    url(r'^logout/$', login_views.logout_page),
]
