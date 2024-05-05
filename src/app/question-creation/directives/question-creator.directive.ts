import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[questionCreator]'
})
export class QuestionCreatorDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
