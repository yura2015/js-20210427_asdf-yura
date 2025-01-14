import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
    element;
    subElements = {};
    components = {};

    constructor() {

    }

    async updateComponents(from, to) {
        const data = await fetchJson(`${BACKEND_URL}/api/dashboard/bestsellers`)
        this.components.SortableTable.addRows(data);

        this.components.ordersChart.update(from,to);
        this.components.salesChart.update(from,to);
        this.components.customsChart.update(from,to);
    }

   initComponents() {
        let now = new Date(); 
        let from = new Date(); 
        const to = new Date( now.setMonth( now.getMonth() - 1 ) );
        const rangePicker = new RangePicker( {from, to } );

        const sortableTable = new SortableTable(header, {
            url: `api/dashboard/bestsellers`,  
            isSortlocaly: true
        });

        const ordersChart = new ColumnChart( {
            url: `api/dashboard/orders`,
            range: { from, to },
            label: 'orders'
        });
        const salesChart = new ColumnChart( {
            url: `api/dashboard/sales`,
            range: { from, to },
            label: 'orders'
        });

       const customersChart = new ColumnChart( {
            url: `api/dashboard/customers`,
            range: { from, to },
            label: 'orders'
        });

        this.components = {
            rangePicker,
            sortableTable,
            ordersChart,
            salesChart,
            customersChart
        };

       
    }

    randerComponents() {
        Object.keys(this.components).forEach(component => {
            const root = this.subElements[component];
            const { element } = this.components[component];

            root.append(element);
        });
    }

    get template() {
        return ` <div class="dashboard">
                   <div class="content__top-panel">
                     <h2 class="page_title">Dashboard</h2>
                     <!---  -->
                     <div data-element="rangePicker"></div>
                   </div>
                   <div data-element="ChartsRoot" class="dashboard__charts">
                   <!---  -->
                      <div data-element="ordersChart" class="dashboard__chart_orders"></div>
                      <div data-element="salesChart" class="dashboard__chart_sales"></div>
                      <div data-element="customersChart" class="dashboard__chart_customers"></div>
                   </div>
                   <h3 class="block-title" >Best sales</h3>
                   <div data-element="sortableTable">
                   <!---  -->
                   </div>
                </div>
               `
    }
     render() {
        
        this.element = document.createElement('div'); // (*)
        this.element.innerHTML = this.template;
        this.element = this.element.firstElementChild;
        this.subElements = this.getSubElements(this.element);

        this.initComponents();
        this.randerComponents() ;
        this.initEventListener();
        return this.element;
     }

     getSubElements(element) {
         const elements = element.querySelectorAll('[data-element]');

         return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;

          return accum;
        }, {});
     }

     initEventListener() {
         this.components.rangePicker.element.addEventListener('date-select', event => {  
            const {from, to } = event.detail;
            this.updateComponents(from, to);
        });
     }


      remove () {
        if (this.element) {
            this.element.remove();
        }
     }

      // NOTE: ������� ����������� �������, ���� ��� ����
      destroy() {
        this.remove();
        for(let component in this.components) {
            this.components[component].destroy();
        }
        this.element = null;
        this.subElements = {};
      }


}
