import { NgModule } from '@angular/core';
import { PhoneMaskDirective } from './phone-mask/phone-mask';
import { MoneyMaskDirective } from './money-mask/money-mask';
import { NumericMaskDirective } from './numeric-mask/numeric-mask';

@NgModule({
	declarations: [
		PhoneMaskDirective,
    MoneyMaskDirective,
    NumericMaskDirective
  ],
	imports: [],
	exports: [
		PhoneMaskDirective,
    MoneyMaskDirective,
    NumericMaskDirective
  ]
})

export class DirectivesModule {}
