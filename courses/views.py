from django.shortcuts import render

def course_single(request):
    ''' View Function for course-single.html '''
    return render(request, 'course-single.html')

def courses_listing(request):
    ''' View Function for course-listings.html '''
    return render(request, 'courses-listing.html')

def gkdose(request):
    ''' View Function for gkdose.html '''
    return render(request, 'gkdose.html')

def gk_single(request):
    ''' View Function for course-single.html '''
    return render(request, 'gk-single.html')

def mock(request):
    ''' View Function for mock.html '''
    return render(request, 'mock.html')

def blog(request):
    ''' View Function for blog.html '''
    return render(request, 'blog.html')

def blog_single(request):
    ''' View Function for course-single.html '''
    return render(request, 'blog-single.html')

def news(request):
    ''' View Function for news.html '''
    return render(request, 'news.html')

def news_single(request):
    ''' View Function for course-single.html '''
    return render(request, 'news-single.html')