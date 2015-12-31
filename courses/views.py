from django.shortcuts import render

def course_single(request):
    ''' View Function for course-single.html '''
    return render(request, 'course-single.html')

def courses_listing(request):
    ''' View Function for course-listings.html '''
    return render(request, 'courses-listing.html')
