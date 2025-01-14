﻿export default class SortableTable {
    element = null;
    subElements = null;
    constructor(headerConfig = [], {data = []} = {})   {    //constructor (headerConfig = [], data = []) 

            this.data = data;
            this.headerConfig = headerConfig;
            this.render();
  }

  getTabHeader() {
        return ` <div data-element="header" class="sortable-table__header sortable-table__row"> 
        ${this.headerConfig.map(item => this.getHeaderRow(item.id, item.title, item.sortable)).join('') }
        </div>`;
  }

  getHeaderRow(id, title, sortable) {
        return `
            <div class="sortable-table__cell" data-id="${id}" data-sortable="true" data-sortable="${sortable}">
            <span>${title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
          </div>
          `;
  }

  getTableBody () {
        return `
        <div data-element="body" class="sortable-table__body">
            ${this.getTableRows(this.data)}
        </div>
        `;
  }

  getTableRows(data) {
        return data.map(item => {
            return `
                <a href="/products/${item.id}" class="sortable-table__row">
                    ${this.getTableRow(item)}
                </a> `;
        }).join('');
  }

  getTableRow(item) {
        const cells = this.headerConfig.map(({id, template} ) => {
            return { 
                id,
                template
            };
        });
        return cells.map( ( { id, template}) => {
            return template
                ? template (item[id])
                : ` <div class="sortable-table__cell">${item[id]}</div> `;
        } ).join('');
  }

  getTable() {
        return `
        <div class="sortable-table">
            ${this.getTabHeader()}
            ${this.getTableBody()}
        </div>
          `;
  }

  render() {
        const wrapper = document.createElement('div'); // (*)
        wrapper.innerHTML = this.getTable();

        const element = wrapper.firstElementChild;
        this.element = element;
        
        this.subElements = this.getSubElements(element);
  }

  sort(field, order) {

        const sortedData = this.sortData(field, order);
        const allColumns = this.element.querySelectorAll(`.sortable-table__cell[data-id]`);
        const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`)
       
        allColumns.forEach(column => {
            column.dataset.order = '';
        });

        currentColumn.dataset.order = order;
        this.subElements.body.innerHTML =  this.getTableRows(sortedData);
     
 }

 sortData(field, order) {
        const arr = [...this.data];
        const column = this.headerConfig.find(item => item.id === field);
        const { sortType } = column;
        const directions = {
            asc: 1,
            desc: -1
        };
        const direction = directions[order];
        return arr.sort( (a,b) => {
            switch(sortType) {
                case 'namber':
                    return direction * (a[field] - b[field]);
                case 'string':
                    return direction * (a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst:'upper'}) ); 
                default:
                    return direction * (a[field] - b[field]);
            }
        });
 }

// getSubElements(element) {
//        const elements = element.querySelectorAll('[data-element]');
//        return [...elements].reduce((accum,subElement) => {
//            accum[subElement.dataset.element] = subElement;
//            return accum;
//        }, {});
//    }

    getSubElements(element) {
            const result = {};
            const elements = element.querySelectorAll('[data-element]');

            for(const subElement of elements) {
                const name = subElement.dataset.element;
                result[name] = subElement;
            }
            return result;
    }

    remove () {
        if(this.element) {
            this.element.remove();
        }
   }

   // NOTE: удаляем обработчики событий, если они есть
   destroy() {
     this.remove();
     this.element = null;
     this.subElements = {};
   }
}

