// source
// https://codeburst.io/create-a-search-pipe-to-dynamically-filter-results-with-angular-4-21fd3a5bec5c

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) {
      return []; 
    }
    if(!searchText) { 
      return items;
    }

    searchText = searchText.toLowerCase();
    return items.filter( it => {
      const searchStr = it['summary'] + it['description'];
      return searchStr.toLowerCase().includes(searchText);
    });
   }
}
