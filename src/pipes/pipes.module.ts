import { NgModule } from '@angular/core';
import { FilterMovementByTypePipe } from './filter-movement-by-type/filter-movement-by-type';
import { FormatCurrency } from './format-currency/format-currency'
@NgModule({
	declarations: [FilterMovementByTypePipe, FormatCurrency],
	imports: [],
	exports: [FilterMovementByTypePipe, FormatCurrency]
})
export class PipesModule {}
