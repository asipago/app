import { Directive } from '@angular/core';

/**
 * Generated class for the MoneyMaskDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[money-mask]' // Attribute selector
})
export class MoneyMaskDirective {

  constructor() {
    console.log('Hello MoneyMaskDirective Directive');
  }

}
