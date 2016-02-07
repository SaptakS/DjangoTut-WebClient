from django import forms
from django.forms import ModelForm
from django.forms.widgets import RadioSelect, Textarea

from models import *
from multichoice.models import *

class QuestionForm(forms.Form):
    def __init__(self, question, *args, **kwargs):
        super(QuestionForm, self).__init__(*args, **kwargs)
        choice_list = [x for x in question.get_answers_list()]
        self.fields["answers"] = forms.ChoiceField(choices=choice_list,
                                                   widget=RadioSelect)


class EssayForm(forms.Form):
    def __init__(self, question, *args, **kwargs):
        super(EssayForm, self).__init__(*args, **kwargs)
        self.fields["answers"] = forms.CharField(
            widget=Textarea(attrs={'style': 'width:100%'}))


class CreateMCQuestionForm(ModelForm):
    class Meta:
        model = CustomMCQuestion
        fields = ['content', 'answer_order', 'correct_ans', 'wrong_ans1', 'wrong_ans2', 'wrong_ans3']


class CreateQuizForm(ModelForm):
    class Meta:
        model = Quiz
        fields = ['title', 'description', 'category', 'max_questions', 'pass_mark']
