---
title: "Fundamental Modular Monolith Architecture"
titleId: "Fundamental Arsitektur Modular Monolith"
excerpt: "Panduan taktis memahami struktur dasar, aturan main, dan contoh implementasi Modular Monolith menggunakan TypeScript."
excerptId: "Panduan taktis memahami struktur dasar, aturan main, dan contoh implementasi Modular Monolith menggunakan TypeScript."
category: "modular-monolith-architecture"
date: "2026-08-27"
readTime: 7
tags: ["Architecture", "Modular Monolith", "TypeScript", "Backend", "Design Patterns"]
featured: true
ogImage: "https://zeroman.my.id/images/og-image.png"
---

# Fundamental Modular Monolith Architecture

Seiring berjalannya waktu, landscape arsitektur software terus berevolusi untuk menjawab tantangan kompleksitas sistem dan dinamika tim.

- **Monolith Klasik**: Cepat diawal, namun seiring bertambahnya fitur dan developer, basis kode sering berubah menjadi *big ball of mud* (spaghetti code) karena batas antar fitur kabur.
- **Microservices**: Menawarkan independensi deployment dan batasan domain yang tegas. Namun, kompensasinya adalah overhead operasional yang tinggi, jaringan yang tidak stabil (network latency), serta kompleksitas *distributed system*.

**Modular Monolith** hadir sebagai titik tengah (*sweet spot*): memberikan **ketegasan batas isolasi logis ala Microservices** tanpa mengorbankan **kemudahan operasional dan efisiensi single deployment unit ala Monolith**.

---

## Konsep Dasar

Modular Monolith adalah pola arsitektur di mana aplikasi dibangun sebagai satu kesatuan rilis (*single deployment unit*), namun secara internal terbagi menjadi modul-modul independen yang terisolasi dengan ketat.

Setiap modul mewakili satu *Bounded Context* (domain bisnis tertentu) yang memiliki:
1. **Public API Contract**: Antarmuka resmi untuk interaksi dari luar modul.
2. **Internal Implementation**: Logika bisnis dan infrastruktur yang tersembunyi dari modul lain.
3. **Data Ownership**: Kepemilikan data khusus yang tidak boleh diakses langsung oleh modul lain.

---

## Struktur Project TypeScript

Struktur direktori yang disiplin adalah fondasi utama Modular Monolith. Berikut standar struktur project pada TypeScript:

```text
src/
├── modules/
│   ├── ordering/
│   │   ├── domain/               # Entity, Value Objects, Domain Events
│   │   ├── application/          # Use Cases, Commands, Queries
│   │   ├── infrastructure/       # Repository, Database Persistence
│   │   └── index.ts              # Public API (Satu-satunya pintu keluar modul)
│   │
│   ├── inventory/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── index.ts              # Public API
│   │
│   └── payment/
│       └── ...
│
├── shared/                       # Kernel bersama (Event Bus, Base Interfaces, Utils)
│   ├── event-bus.ts
│   └── result.ts
│
└── main.ts                       # Entry point aplikasi
```

---

## Aturan Main (Architectural Rules)

Agar arsitektur ini tidak runtuh kembali menjadi Monolith Spaghetti, ada 4 aturan wajib:

1. **Strict Public API Boundary**
   Modul A dilarang keras meng-import berkas internal Modul B secara langsung.
   - ❌ `import { OrderRepository } from '../ordering/infrastructure/order.repo'`
   - ✅ `import { OrderingModule } from '../ordering'` (akses via `index.ts`)

2. **Isolated Data Ownership**
   Satu modul, satu tabel/skema data. Dilarang melakukan cross-module SQL `JOIN`. Jika Modul Order butuh data Customer, minta via Public API modul Customer atau simpan read-model terpisah via domain event.

3. **Asynchronous In-Memory Communication**
   Gunakan *Domain Events* via *In-Memory Event Bus* untuk komunikasi antar-modul yang bersifat *eventual consistency*. Ini memutus *direct coupling* antar modul.

4. **Single Runtime Process**
   Seluruh modul berjalan dalam satu proses (Node.js/Bun) dan satu codebase repository (Monorepo atau Single Repo).

---

## Contoh Implementasi TypeScript

Berikut contoh konkret penerapan komunikasi antar-modul dan pembatasan akses di TypeScript.

### 1. Shared Event Bus (`src/shared/event-bus.ts`)

```typescript
export interface DomainEvent {
  eventName: string;
  occurredOn: Date;
}

type EventHandler<T extends DomainEvent> = (event: T) => Promise<void>;

export class InMemoryEventBus {
  private static instance: InMemoryEventBus;
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  private constructor() {}

  public static getInstance(): InMemoryEventBus {
    if (!InMemoryEventBus.instance) {
      InMemoryEventBus.instance = new InMemoryEventBus();
    }
    return InMemoryEventBus.instance;
  }

  public subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void {
    const existing = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, [...existing, handler]);
  }

  public async publish<T extends DomainEvent>(event: T): Promise<void> {
    const handlers = this.handlers.get(event.eventName) || [];
    await Promise.all(handlers.map((h) => h(event)));
  }
}
```

### 2. Inventory Module - Public Contract (`src/modules/inventory/index.ts`)

```typescript
// Event contract yang dipublikasikan oleh Inventory
export interface StockReservedEvent extends DomainEvent {
  eventName: 'StockReserved';
  productId: string;
  quantity: number;
}

// Public API Interface untuk panggilan sinkronus terbatas
export interface IInventoryFacade {
  checkStock(productId: string): Promise<boolean>;
}

class InventoryFacade implements IInventoryFacade {
  async checkStock(productId: string): Promise<boolean> {
    // Simulasi pengecekan database internal inventory
    return true;
  }
}

export const inventoryFacade: IInventoryFacade = new InventoryFacade();
```

### 3. Ordering Module - Handling Order (`src/modules/ordering/application/create-order.ts`)

```typescript
import { InMemoryEventBus } from '../../../shared/event-bus';
import { inventoryFacade } from '../../inventory'; // Hanya import dari public index!

export interface OrderCreatedEvent {
  eventName: 'OrderCreated';
  occurredOn: Date;
  orderId: string;
  productId: string;
  quantity: number;
}

export class CreateOrderUseCase {
  private eventBus = InMemoryEventBus.getInstance();

  async execute(orderId: string, productId: string, quantity: number): Promise<void> {
    // 1. Verifikasi stock via Public Facade (Synchronous Read)
    const isAvailable = await inventoryFacade.checkStock(productId);
    if (!isAvailable) {
      throw new Error('Stok tidak mencukupi');
    }

    // 2. Simpan order ke database internal Ordering
    console.log(`[OrderModule] Order ${orderId} berhasil dibuat.`);

    // 3. Publish Event (Asynchronous Decoupled Communication)
    const event: OrderCreatedEvent = {
      eventName: 'OrderCreated',
      occurredOn: new Date(),
      orderId,
      productId,
      quantity,
    };

    await this.eventBus.publish(event);
  }
}
```

### 4. Wireup Event Handler & Main App (`src/main.ts`)

```typescript
import { InMemoryEventBus } from './shared/event-bus';
import { CreateOrderUseCase, OrderCreatedEvent } from './modules/ordering/application/create-order';

// Listener di Modul Inventory mendengarkan event dari Modul Ordering
const eventBus = InMemoryEventBus.getInstance();

eventBus.subscribe<OrderCreatedEvent>('OrderCreated', async (event) => {
  console.log(`[InventoryModule] Memotong stok untuk produk ${event.productId} sejumlah ${event.quantity}`);
});

// Jalankan Simulasi
async function bootstrap() {
  const createOrder = new CreateOrderUseCase();
  await createOrder.execute('ORD-101', 'PROD-99', 2);
}

bootstrap();
```

---

## Kesimpulan

Modular Monolith bukan sekadar arsitektur transisi menuju Microservices, melainkan **arsitektur tujuan** (*destination architecture*) yang pragmatis. Sistem ini memberikan kemudahan refactoring, pengujian yang cepat, dan batas modul yang jelas tanpa menambah kompleksitas infrastruktur sejak hari pertama.
