import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[questionHost]'
})
export class QuestionHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
