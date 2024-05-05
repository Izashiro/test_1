import { Component } from '@angular/core';
import { RadioQuestionComponent } from '../questionTypes/radio-question/radio-question.component';
import { TextQuestionComponent } from '../questionTypes/text-question/text-question.component';

export class ComponentMap {
    COMPONENT_MAP = {
        'text': TextQuestionComponent,
        'radio': RadioQuestionComponent
      };
}
