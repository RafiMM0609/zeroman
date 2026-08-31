---
title: "Fundamental Modular Monolith Architecture"
titleId: "Fundamental Arsitektur Modular Monolith"
excerpt: "Panduan taktis memahami struktur dasar, aturan main, dan contoh implementasi Modular Monolith menggunakan Python."
excerptId: "Panduan taktis memahami struktur dasar, aturan main, dan contoh implementasi Modular Monolith menggunakan Python."
category: "apps-architecture"
date: "2026-08-27"
readTime: 7
tags: ["Architecture", "Modular Monolith", "Python", "Backend", "Design Patterns"]
featured: false
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

## Struktur Project Python

Struktur direktori yang disiplin adalah fondasi utama Modular Monolith. Berikut standar struktur project pada Python:

```text
src/
├── modules/
│   ├── ordering/
│   │   ├── domain/               # Entity, Value Objects, Domain Events
│   │   ├── application/          # Use Cases, Commands, Queries
│   │   ├── infrastructure/       # Repository, Database Persistence
│   │   └── __init__.py           # Public API (Satu-satunya pintu keluar modul)
│   │
│   ├── inventory/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── __init__.py           # Public API
│   │
│   └── payment/
│       └── ...
│
├── shared/                       # Kernel bersama (Event Bus, Base Interfaces, Utils)
│   ├── event_bus.py
│   └── result.py
│
└── main.py                       # Entry point aplikasi
```

---

## Aturan Main (Architectural Rules)

Agar arsitektur ini tidak runtuh kembali menjadi Monolith Spaghetti, ada 4 aturan wajib:

1. **Strict Public API Boundary**
   Modul A dilarang keras meng-import berkas internal Modul B secara langsung.
   - ❌ `from modules.ordering.infrastructure.order_repo import OrderRepository`
   - ✅ `from modules.ordering import inventory_facade` (akses via `__init__.py`)

2. **Isolated Data Ownership**
   Satu modul, satu tabel/skema data. Dilarang melakukan cross-module SQL `JOIN`. Jika Modul Order butuh data Customer, minta via Public API modul Customer atau simpan read-model terpisah via domain event.

3. **Asynchronous In-Memory Communication**
   Gunakan *Domain Events* via *In-Memory Event Bus* untuk komunikasi antar-modul yang bersifat *eventual consistency*. Ini memutus *direct coupling* antar modul.

4. **Single Runtime Process**
   Seluruh modul berjalan dalam satu proses (Python runtime) dan satu codebase repository (Monorepo atau Single Repo).

---

## Contoh Implementasi Python

Berikut contoh konkret penerapan komunikasi antar-modul dan pembatasan akses di Python.

### 1. Shared Event Bus (`src/shared/event_bus.py`)

```python
import asyncio
from dataclasses import dataclass, field
from datetime import datetime
from typing import TypeVar, Generic, Callable, Awaitable, Dict, List

@dataclass
class DomainEvent:
    event_name: str
    occurred_on: datetime = field(default_factory=datetime.now)

T = TypeVar('T', bound=DomainEvent)
EventHandler = Callable[[T], Awaitable[None]]

class InMemoryEventBus:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(InMemoryEventBus, cls).__new__(cls)
            cls._instance._handlers: Dict[str, List[EventHandler]] = {}
        return cls._instance

    def subscribe(self, event_name: str, handler: EventHandler) -> None:
        if event_name not in self._handlers:
            self._handlers[event_name] = []
        self._handlers[event_name].append(handler)

    async def publish(self, event: DomainEvent) -> None:
        handlers = self._handlers.get(event.event_name, [])
        await asyncio.gather(*(handler(event) for handler in handlers))
```

### 2. Inventory Module - Public Contract (`src/modules/inventory/__init__.py`)

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from shared.event_bus import DomainEvent

# Event contract yang dipublikasikan oleh Inventory
@dataclass
class StockReservedEvent(DomainEvent):
    product_id: str = ""
    quantity: int = 0

    def __post_init__(self):
        self.event_name = "StockReserved"

# Public API Interface untuk panggilan sinkronus terbatas
class IInventoryFacade(ABC):
    @abstractmethod
    async def check_stock(self, product_id: str) -> bool:
        pass

class InventoryFacade(IInventoryFacade):
    async def check_stock(self, product_id: str) -> bool:
        # Simulasi pengecekan database internal inventory
        return True

inventory_facade: IInventoryFacade = InventoryFacade()
```

### 3. Ordering Module - Handling Order (`src/modules/ordering/application/create_order.py`)

```python
from dataclasses import dataclass
from datetime import datetime
from shared.event_bus import InMemoryEventBus, DomainEvent
from modules.inventory import inventory_facade  # Hanya import dari public __init__!

@dataclass
class OrderCreatedEvent(DomainEvent):
    order_id: str = ""
    product_id: str = ""
    quantity: int = 0

    def __post_init__(self):
        self.event_name = "OrderCreated"

class CreateOrderUseCase:
    def __init__(self):
        self.event_bus = InMemoryEventBus()

    async def execute(self, order_id: str, product_id: str, quantity: int) -> None:
        # 1. Verifikasi stock via Public Facade (Synchronous Read)
        is_available = await inventory_facade.check_stock(product_id)
        if not is_available:
            raise ValueError("Stok tidak mencukupi")

        # 2. Simpan order ke database internal Ordering
        print(f"[OrderModule] Order {order_id} berhasil dibuat.")

        # 3. Publish Event (Asynchronous Decoupled Communication)
        event = OrderCreatedEvent(
            order_id=order_id,
            product_id=product_id,
            quantity=quantity,
            occurred_on=datetime.now()
        )

        await self.event_bus.publish(event)
```

### 4. Wireup Event Handler & Main App (`src/main.py`)

```python
import asyncio
from shared.event_bus import InMemoryEventBus
from modules.ordering.application.create_order import CreateOrderUseCase, OrderCreatedEvent

# Listener di Modul Inventory mendengarkan event dari Modul Ordering
event_bus = InMemoryEventBus()

async def handle_order_created(event: OrderCreatedEvent) -> None:
    print(f"[InventoryModule] Memotong stok untuk produk {event.product_id} sejumlah {event.quantity}")

event_bus.subscribe("OrderCreated", handle_order_created)

# Jalankan Simulasi
async def bootstrap():
    create_order = CreateOrderUseCase()
    await create_order.execute("ORD-101", "PROD-99", 2)

if __name__ == "__main__":
    asyncio.run(bootstrap())
```

---

## Kesimpulan

Modular Monolith bukan sekadar arsitektur transisi menuju Microservices, melainkan **arsitektur tujuan** (*destination architecture*) yang pragmatis. Sistem ini memberikan kemudahan refactoring, pengujian yang cepat, dan batas modul yang jelas tanpa menambah kompleksitas infrastruktur sejak hari pertama.
