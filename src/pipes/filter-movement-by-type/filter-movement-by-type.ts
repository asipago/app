import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMovementByType',
})
export class FilterMovementByTypePipe implements PipeTransform {

  transform(items: any, filter: any) {

	if (!items || !filter) {
		return items;
	}

	return items.filter(item => item.type.indexOf(filter.type) !== -1);


    /*return movement.filter(item => {
        let shouldInclude: boolean = item.type === filter.type;
        return filter.include ? shouldInclude : !shouldInclude;
    });*/
  }

}
