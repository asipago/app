import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DataProvider } from '@providers/data/data';

@Pipe({
    name: 'formatCurrency',
    pure: false
})
export class FormatCurrency implements PipeTransform {

    constructor(
        public dataProvider: DataProvider,
        public currencyPipe: CurrencyPipe
    ) { }
    
    transform(value: any, args?: any): any {
        const currencySymbol = this.dataProvider.getCurrencySymbol();
        return this.currencyPipe.transform(
            value,
            this.getSymbol(currencySymbol, !!args),
            this.getCode(currencySymbol, !!args),
            '1.2-2',
            this.getLang(currencySymbol, !!args)
        );
    }
    
    private getSymbol(symbol: string, args: boolean) {
        return args && symbol == 'BS' ? ' ' : symbol;
    }
    
    private getCode(symbol: string, args: boolean) {
        switch (symbol) {
            case 'BS': return 'code';
            default: return 'symbol'
        }
    }

    private getLang(symbol: string, args: boolean) {
        switch (symbol) {
            case 'BS': return 'es';
            default: return 'en'
        }
    }

}
