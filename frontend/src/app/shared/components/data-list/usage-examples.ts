// Esempi di utilizzo del componente data-list
import { DataListItem, DataListConfig } from './data-list.component';

// ESEMPIO 1: Products Layout
export const productsData: DataListItem[] = [
  {
    id: 1,
    title: 'TaoTronics Wall Clock',
    subtitle: '$699',
    imageUrl: './assets/images/ecommerce/png/11.png',
    badge: {
      text: 'In Stock',
      type: 'success',
      icon: 'ri-circle-fill'
    },
    rightContent: {
      primary: '1000',
      secondary: 'Sales'
    }
  },
  {
    id: 2,
    title: 'Club Fleece Hoodie',
    subtitle: '$55',
    imageUrl: './assets/images/ecommerce/png/12.png',
    badge: {
      text: 'In Stock',
      type: 'success',
      icon: 'ri-circle-fill'
    },
    rightContent: {
      primary: '3,100',
      secondary: 'Sales'
    }
  },
  {
    id: 3,
    title: 'SmartGizmo Pro Headset',
    subtitle: '$199',
    imageUrl: './assets/images/ecommerce/png/14.png',
    badge: {
      text: 'In Stock',
      type: 'success',
      icon: 'ri-circle-fill'
    },
    rightContent: {
      primary: '1,250',
      secondary: 'Sales'
    }
  },
  {
    id: 4,
    title: 'TaoTronics Cattle',
    subtitle: '$699',
    imageUrl: './assets/images/ecommerce/png/16.png',
    badge: {
      text: 'Out Of Stock',
      type: 'danger',
      icon: 'ri-circle-fill'
    },
    rightContent: {
      primary: '1,000',
      secondary: 'Sales'
    }
  },
  {
    id: 5,
    title: 'UltraMaze Ladies Bag',
    subtitle: '$89',
    imageUrl: './assets/images/ecommerce/png/13.png',
    badge: {
      text: 'In Stock',
      type: 'success',
      icon: 'ri-circle-fill'
    },
    rightContent: {
      primary: '2,150',
      secondary: 'Sales'
    }
  }

];

export const productsConfig: DataListConfig = {
  layout: 'products',
  showCard: true,
  cardTitle: 'Top Selling Products',
  showViewAll: true,
  viewAllText: 'View All'
};

// Uso nel template:
// <app-data-list [items]="productsData" [config]="productsConfig"></app-data-list>

// ESEMPIO 2: Recent Activity Layout
export const activityData: DataListItem[] = [
  {
    id: 1,
    title: 'John Doe placed an order for',
    secondaryText: ' 5x Apple iPhone 14',
    date: '24,Nov',
    time: '08:45 AM',
    primaryClass: '',
    secondaryClass: 'fw-medium text-primary'
  },
  {
    id: 2,
    title: 'Payment of $1,250.00 received from Alice Smith for',
    secondaryText: ' Order #1020',
    date: '24,Nov',
    time: '09:15 AM',
    primaryClass: '',
    secondaryClass: 'fw-medium text-warning'
  },
  {
    id: 3,
    title: 'David Brown requested a refund for ',
    secondaryText: '1x Samsung Galaxy S22',
    date: '24,Nov',
    time: '10:00 AM',
    primaryClass: '',
    secondaryClass: 'fw-medium text-info'
  },
  {
    id: 4,
    title: 'Product ID: 5409 ',
    secondaryText: '(Sony WH-1000XM5) stock dropped below threshold.',
    date: '24,Nov',
    time: '10:45 AM',
    primaryClass: 'fw-medium text-success',
    secondaryClass: ''
  },
  {
    id: 5,
    title: 'Emma Johnson left a 5-star review on ',
    secondaryText: 'Product ID: 7312',
    additionalInfo: ' (Dell XPS 13).',
    date: '24,Nov',
    time: '11:30 AM',
    primaryClass: '',
    secondaryClass: 'fw-medium text-orange'
  }
];

export const activityConfig: DataListConfig = {
  layout: 'activity',
  showCard: true,
  cardTitle: 'Recent Activity',
  showViewAll: true,
  viewAllText: 'View All'
};

// ESEMPIO 3: Top Customers Layout
export const customersData: DataListItem[] = [
  {
    id: 1,
    title: 'Jane Smith',
    subtitle: 'janesmith215@gmail.com',
    avatar: {
      text: 'JS',
      color: 'primary'
    },
    rightContent: {
      primary: '$23,755',
      secondary: 'Spent',
      colorClass: 'text-primary'
    }
  },
  {
    id: 2,
    title: 'Jhon Doe',
    subtitle: 'jhondoe431@gmail.com',
    avatar: {
      text: 'JD',
      color: 'secondary'
    },
    rightContent: {
      primary: '$14,563',
      secondary: 'Spent',
      colorClass: 'text-secondary'
    }
  },
  {
    id: 3,
    title: 'Alicia Keys',
    subtitle: 'aliciakeys986@gmail.com',
    avatar: {
      text: 'AK',
      color: 'warning'
    },
    rightContent: {
      primary: '$12,075',
      secondary: 'Spent',
      colorClass: 'text-warning'
    }
  },
  {
    id: 4,
    title: 'Leo Phillip',
    subtitle: 'leophillip77@gmail.com',
    avatar: {
      text: 'LP',
      color: 'info'
    },
    rightContent: {
      primary: '$10,485',
      secondary: 'Spent',
      colorClass: 'text-info'
    }
  },
  {
    id: 5,
    title: 'Brenda Simpson',
    subtitle: 'brendasimpson075@gmail.com',
    avatar: {
      text: 'BS',
      color: 'success'
    },
    rightContent: {
      primary: '$8,533',
      secondary: 'Spent',
      colorClass: 'text-success'
    }
  }
];

export const customersConfig: DataListConfig = {
  layout: 'customers',
  showCard: true,
  cardTitle: 'Top Customers',
  showViewAll: true,
  viewAllText: 'View All'
};

// ESEMPIO 4: Top User Channels Layout
export const channelsData: DataListItem[] = [
  {
    id: 1,
    title: 'CloudComm',
    subtitle: 'Digital Communication',
    imageUrl: './assets/images/company-logos/1.png',
    trend: {
      direction: 'up',
      value: '2.98%'
    },
    rightContent: {
      primary: '3,765'
    },
    progress: {
      value: 75,
      color: 'bg-primary'
    }
  },
  {
    id: 2,
    title: 'BuzzWave',
    subtitle: 'Social Media',
    imageUrl: './assets/images/company-logos/2.png',
    trend: {
      direction: 'down',
      value: '6.45%'
    },
    rightContent: {
      primary: '2,855'
    },
    progress: {
      value: 45,
      color: 'bg-secondary'
    }
  },
  {
    id: 3,
    title: 'NexusNet',
    subtitle: 'Networking',
    imageUrl: './assets/images/company-logos/3.png',
    trend: {
      direction: 'up',
      value: '1.95%'
    },
    rightContent: {
      primary: '2,384'
    },
    progress: {
      value: 81,
      color: 'bg-warning'
    }
  },
  {
    id: 4,
    title: 'FlashConnect',
    subtitle: 'Direct Marketing',
    imageUrl: './assets/images/company-logos/4.png',
    trend: {
      direction: 'down',
      value: '5.91%'
    },
    rightContent: {
      primary: '1,755'
    },
    progress: {
      value: 60,
      color: 'bg-info'
    }
  },
  {
    id: 5,
    title: 'EchoLink',
    subtitle: 'Feedback & Surveys',
    imageUrl: './assets/images/company-logos/5.png',
    trend: {
      direction: 'up',
      value: '3.75%'
    },
    rightContent: {
      primary: '1,525'
    },
    progress: {
      value: 53,
      color: 'bg-success'
    }
  }
];

export const channelsConfig: DataListConfig = {
  layout: 'channels',
  showCard: true,
  cardTitle: 'Top User Channels',
  showViewAll: true,
  viewAllText: 'View All'
};

// Uso completo in un componente:
/*
@Component({
  template: `
    <div class="row">
      <div class="col-md-3">
        <div class="card custom-card overflow-hidden">
          <div class="card-header justify-content-between">
            <div class="card-title">Top Selling Products</div>
            <a href="javascript:void(0);" class="text-muted fs-12 text-decoration-underline">
              View All<i class="ti ti-arrow-narrow-right"></i>
            </a>
          </div>
          <div class="card-body p-0">
            <app-data-list [items]="productsData" [config]="productsConfig"></app-data-list>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card custom-card">
          <div class="card-header justify-content-between">
            <div class="card-title">Recent Activity</div>
            <a href="javascript:void(0);" class="text-muted fs-12 text-decoration-underline">
              View All<i class="ti ti-arrow-narrow-right"></i>
            </a>
          </div>
          <div class="card-body px-5">
            <app-data-list [items]="activityData" [config]="activityConfig"></app-data-list>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExampleComponent {
  productsData = productsData;
  productsConfig = productsConfig;
  activityData = activityData;
  activityConfig = activityConfig;
}
*/
