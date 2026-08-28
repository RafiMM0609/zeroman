---
title: "Understanding RAG Fundamentals: From Data Ingestion to Knowledge Graphs"
titleId: "Panduan Fundamental RAG: Dari Ingestion, Vector Search, hingga Knowledge Graph & Summary"
excerpt: "Membahas tuntas arsitektur Retrieval-Augmented Generation (RAG): pipeline data ingestion & retrieval, perbedaan Sparse vs Dense Vector, Knowledge Graph RAG, serta Summary Knowledge."
excerptId: "Membahas tuntas arsitektur Retrieval-Augmented Generation (RAG): pipeline data ingestion & retrieval, perbedaan Sparse vs Dense Vector, Knowledge Graph RAG, serta Summary Knowledge."
category: "ai-architecture"
date: "2026-08-28"
readTime: 12
tags: ["AI", "RAG", "Vector Database", "GraphRAG", "Architecture"]
featured: true
ogImage: "https://zeroman.my.id/images/og-image.png"
---

# Panduan Fundamental RAG: Dari Ingestion, Vector Search, hingga Knowledge Graph & Summary

Dalam era perkembangan Large Language Model (LLM), salah satu tantangan terbesar yang sering dihadapi adalah **halusinasi** (AI memberikan jawaban yang terdengar meyakinkan namun salah secara fakta) dan **keterbatasan pengetahuan** (*knowledge cutoff* serta ketiadaan akses ke data privat/enterprise).

Untuk mengatasi masalah tersebut, muncullah arsitektur **Retrieval-Augmented Generation (RAG)**. Artikel ini akan membahas secara mendalam fundamental RAG, mulai dari alur *data ingestion*, proses *retrieval*, tipe-tipe vektor (*Sparse* vs *Dense*), hingga teknik tingkat lanjut seperti **Knowledge Graph** dan **Summary Knowledge**.

---

## 1. Apa itu Retrieval-Augmented Generation (RAG)?

Secara sederhana, RAG adalah teknik yang memberikan akses kepada LLM ke basis pengetahuan eksternal secara dinamis saat merespons *prompt*. Daripada mengandalkan ingatan internal model yang statis, RAG bertindak seperti sistem ujian "buka buku":

1. **Retrieval**: Mencari informasi/dokumen relevan dari basis data eksternal sesuai pertanyaan user.
2. **Augmentation**: Menyisipkan potongan informasi (*context*) yang ditemukan ke dalam *prompt* LLM.
3. **Generation**: Meminta LLM menghasilkan jawaban berdasarkan *context* relevan yang telah disajikan.

---

## 2. Pipeline Utama RAG: Ingestion hingga Retrieval

Arsitektur RAG standar terbagi menjadi dua alur utama: **Data Ingestion (Offline/Background Process)** dan **Retrieval & Generation (Online/Real-time Process)**.

```
[ Data Ingestion Pipeline ]
Raw Data (PDF, Docs, DB) ➔ Data Parsing ➔ Chunking ➔ Embedding Generation ➔ Vector Store

[ Retrieval & Generation Pipeline ]
User Query ➔ Query Embedding ➔ Similarity Search ➔ Reranking ➔ Context Injection ➔ LLM Response
```

### A. Tahap 1: Data Ingestion

*Ingestion* adalah alur persiapan data agar siap dicari secara efisien oleh sistem:

1. **Data Extraction & Parsing**: Mengambil data dari berbagai sumber (PDF, Markdown, HTML, database SQL/NoSQL) dan mengonversinya menjadi teks bersih.
2. **Chunking (Pemotongan Teks)**: Memotong dokumen panjang menjadi bagian-bagian kecil (*chunks*).
   - *Fixed-size Chunking*: Memotong berdasarkan jumlah karakter/token tertentu (misal 512 token).
   - *Sentence / Paragraph Chunking*: Memotong berdasarkan struktur kalimat atau paragraf.
   - *Semantic Chunking*: Memotong berdasarkan perubahan makna atau ide dalam teks.
3. **Embedding Generation**: Setiap *chunk* teks dikonversi menjadi bentuk vektor numerik (*high-dimensional array*) menggunakan model *embedding*.
4. **Indexing & Vector Storage**: Vektor beserta metadata pendukung (seperti sumber dokumen, nomor halaman, tanggal) disimpan ke dalam **Vector Database** (misalnya Pinecone, Qdrant, Chroma, atau Pgvector).

### B. Tahap 2: Retrieval & Generation

Saat user mengajukan pertanyaan, alur real-time berikut akan dieksekusi:

1. **Query Processing**: Pertanyaan user dikonversi menjadi *query embedding* menggunakan model *embedding* yang sama dengan tahap ingestion.
2. **Similarity Search**: Sistem melakukan pencarian kemiripan (*similarity search*) di Vector Database menggunakan metrik seperti *Cosine Similarity*, *Dot Product*, atau *Euclidean Distance* untuk mengambil top-K *chunk* paling relevan.
3. **Reranking (Opsional namun Sangat Dianjurkan)**: Menggunakan model *Cross-Encoder* (seperti Cohere Rerank atau BGE-Reranker) untuk menilai ulang tingkat relevansi hasil pencarian awal secara lebih presisi.
4. **Context Injection & LLM Generation**: *Chunk* terbaik digabungkan bersama instruksi sistem (*system prompt*) dan pertanyaan user, lalu dikirim ke LLM untuk menghasilkan jawaban berdasar fakta (*fact-based answer*).

---

## 3. Tipe Vector: Sparse Vector vs Dense Vector

Dalam sistem pencarian (*retrieval*), terdapat dua jenis representasi vektor utama: **Sparse Vector** dan **Dense Vector**. 

*(Catatan: Istilah "parse" yang sering terdengar di komunitas merujuk pada **Sparse Vector**, sedangkan "dence" adalah **Dense Vector**).*

| Fitur | Sparse Vector (Vektor Jarang) | Dense Vector (Vektor Padat) |
| :--- | :--- | :--- |
| **Dimensi** | Sangat Tinggi (30.000+ hingga ukuran kosakata) | Terkontrol & Padat (384, 768, 1536+) |
| **Representasi Nilai** | Sebagian besar elemen bernilai `0` | Hampir semua elemen terisi nilai *floating-point* |
| **Fokus Pencarian** | Kata kunci eksak (*Exact Keyword Matching*) | Makna & Konteks Semantik (*Semantic Similarity*) |
| **Algoritma / Model** | BM25, TF-IDF, SPLADE | OpenAI Embedding, BGE, E5, Cohere |
| **Keunggulan Utama** | Sangat baik untuk pencarian nomor ID, nama produk, istilah teknis, dan kata langka. | Mengerti sinonim dan makna tanpa perlu kata yang persis sama (misal: "mobil" = "kendaraan"). |

### Hybrid Search (Sparse + Dense)

Arsitektur RAG modern tidak lagi memilih salah satu, melainkan menggabungkan keduanya dalam metode **Hybrid Search**. 

Sistem akan menjalankan pencarian **BM25 (Sparse)** dan **Semantic Embedding (Dense)** secara paralel, kemudian mengonversikan hasil skor keduanya menggunakan algoritma **Reciprocal Rank Fusion (RRF)**. Hasilnya adalah sistem pencarian yang tidak hanya paham makna kalimat, tetapi juga presisi terhadap kata kunci khusus.

---

## 4. Knowledge Graph dalam RAG (GraphRAG)

Meskipun Vector Search sangat handal dalam mencari potongan teks yang mirip secara semantik, Vector Search berbasis *chunk* memiliki keterbatasan: **kehilangan hubungan antar-entitas dan konteks global**.

Sebagai contoh, jika Anda menanyakan *"Apa dampak keputusan CEO A terhadap proyek B di anak perusahaan C?"*, dokumen yang dibutuhkan mungkin tersebar di belasan bab terpisah. *Chunking* biasa sering kali gagal menghubungkan fakta-fakta tersebut.

Di sinilah **Knowledge Graph RAG (GraphRAG)** berperan:

```
[ Entitas A (Orang: CEO) ] ───( MEMIMPIN )───► [ Entitas B (Perusahaan) ]
                                                   │
                                            ( MEMILIKI PROYEK )
                                                   ▼
                                           [ Entitas C (Proyek B) ]
```

1. **Struktur Triplet (Subject - Predicate - Object)**: GraphRAG mengekstrak entitas (Node) dan hubungan/relasi (Edge) dari dokumen. Contoh: `(John Doe) - [IS_CEO_OF] -> (TechCorp)`.
2. **Multi-Hop Reasoning**: GraphRAG memungkinkan pencarian melintasi beberapa hubungan entitas (*multi-hop*), sehingga AI mampu menjawab pertanyaan kompleks yang membutuhkan sintesis dari berbagai bagian dokumen.
3. **Global Summarization**: GraphRAG membentuk *community clusters* pada graf untuk memberikan ringkasan tingkat makro atas seluruh isi pengetahuan.

---

## 5. Summary Knowledge (Hierarchical & Summary Indexing)

Tantangan lain dari pemotongan teks (*chunking*) adalah hilangnya gambaran umum (*the big picture*). Ketika sebuah dokumen 100 halaman dipotong menjadi 200 *chunk* kecil, tidak ada satu pun *chunk* yang mampu menjawab pertanyaan ringkasan seperti *"Apa topik utama dokumen ini?"*.

**Summary Knowledge** memecahkan masalah ini melalui teknik **Hierarchical Indexing** atau **Summary-Based Retrieval**:

1. **Parent-Child Chunking**: Dokumen dibagi menjadi *parent chunk* yang lebih besar (atau ringkasan bab), dan *child chunk* yang lebih kecil (detail paragraf).
2. **Summary Indexing**: Setiap dokumen atau bagian utama dibuatkan *summary* (ringkasan) singkat menggunakan LLM. Vektor dibuat dari ringkasan tersebut.
3. **Two-Step Retrieval**:
   - **Langkah 1**: Pencarian awal mencocokkan query user dengan *Summary Index* untuk menemukan dokumen atau bab yang relevan.
   - **Langkah 2**: Setelah dokumen/bab yang tepat ditemukan, sistem baru mengambil *child chunks* (detail teks) di dalam bagian tersebut untuk dimasukkan ke prompt LLM.

Pendekatan ini memastikan LLM mendapatkan konteks **makro** (melalui summary) sekaligus detail **mikro** (melalui child chunk) tanpa membuang-buang batas token context window.

---

## Kesimpulan

Sistem RAG yang efektif telah berkembang dari sekadar *Naive RAG* (pencarian vektor sederhana) menjadi arsitektur yang sangat terstruktur:

1. **Ingestion & Retrieval**: Mengubah data mentah menjadi chunk, embedding, dan indeks terstruktur yang siap dicari secara real-time.
2. **Hybrid Vector Search**: Menggabungkan **Sparse Vector** (BM25 untuk kata kunci eksak) dan **Dense Vector** (Embedding untuk makna semantik).
3. **Knowledge Graph (GraphRAG)**: Memungkinkan penalaran relasi kompleks antar-entitas (*multi-hop reasoning*).
4. **Summary Knowledge**: Menjaga gambaran umum dokumen melalui indeks hierarkis dan ringkasan bertingkat.

Dengan memadukan keempat komponen ini, Anda dapat membangun sistem AI yang tidak hanya akurat dan bebas halusinasi, tetapi juga mampu memahami struktur data enterprise yang kompleks.

