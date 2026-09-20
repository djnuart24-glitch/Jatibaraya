import { JatibarayaDatabase } from '../types';

export const initialJatibarayaData: JatibarayaDatabase = {
  settings: {
    name: 'JATIBARAYA',
    fullName: "Jam'iyyah Thullabi Bandung Garut Sumedang Raya",
    slogan: 'Satu Baraya, Satu Langkah, Berkhidmat untuk Umat.',
    motto: 'Ti Priangan, Mondok di Lirboyo, Berkhidmat Pikeun Umat.',
    description:
      'Jatibaraya merupakan wadah kekeluargaan santri Priangan yang menjadi ruang untuk mempererat ukhuwah, mengembangkan potensi, serta menjalankan berbagai kegiatan pendidikan, dakwah, sosial, dan pengabdian masyarakat.',
    regions: ['Bandung', 'Garut', 'Sumedang', 'Cimahi'],
    logoUrl: '/assets/jatibaraya-logo.png',
    faviconUrl: '/assets/jatibaraya-logo.png',
    primaryColor: '#047857', // Emerald 700 (Pesantren & Ukhuwah)
    accentColor: '#f59e0b',  // Amber 500 (Kujang Emas Priangan)
    footerText: "Wadah kekeluargaan santri Priangan (Bandung, Garut, Sumedang, Cimahi) di Pondok Pesantren Lirboyo Kediri.",
    ctaText: 'Merawat Ukhuwah, Menumbuhkan Pengabdian.',
    ctaSubtext: 'Bersama membangun sinergi santri Priangan untuk kemaslahatan umat dan bangsa.',
    updated_at: new Date().toISOString(),
  },

  about: {
    vision:
      'Mewujudkan dalam semangat agama, kecerdasan, kemandirian dan taqwa menurut ketentuan syari’ah.',
    missions: [
      'Mendukung dan mempromosikan semua kegiatan siswa aktif berdasarkan pada iman dan kesolehan.',
      'Mengembangkan semangat nasionalisme, dengan mengorganisir acara-acara besar.',
      'Mengharumkan nama pondok pesantren di ranah nasional.',
      'Mengembangkan rencana kegiatan untuk mengasah kreatifitas dan membangun kemandirian.',
      'Menjalin ukhuwwah Islamiyah, Wathoniah dan Basyariah antar sesama santri.',
    ],
    characteristics: ['Pengabdian', 'Pendidikan', 'Kekeluargaan'],
    functions: [
      'Media komunikasi antar warga',
      'Media ukhuwah Islamiyah, Wathoniah, dan Basyariah',
      'Sarana pendidikan dan pengembangan sumber daya warga',
    ],
    updated_at: new Date().toISOString(),
  },

  symbols: [
    {
      id: 'sym-1',
      name: 'Globe Biru Bergaris Bujur & Lintang',
      meaning: 'Melambangkan wawasan intelektual yang luas, pandangan peradaban dunia, serta visi dakwah Islam yang rahmatan lil \'alamin. Santri Jatibaraya siap berdaya saing di kancah global tanpa tercerabut dari nilai-nilai syariat Islam dan tradisi pesantren.',
      elementColor: '#0284c7',
      iconName: 'globe',
    },
    {
      id: 'sym-2',
      name: 'Tiga Kitab / Buku Keilmuan',
      meaning: 'Melambangkan tiga pilar utama agama Islam (Iman, Islam, dan Ihsan) serta ketekunan santri dalam mengkaji khazanah kitab kuning (turats ulama salafus salih) di Pondok Pesantren Lirboyo Kediri yang dipadukan dengan wawasan keilmuan kontemporer.',
      elementColor: '#1e293b',
      iconName: 'books',
    },
    {
      id: 'sym-3',
      name: 'Kujang Emas Pasundan & Hulu Macan',
      meaning: 'Pusaka kebanggaan tatar Pasundan yang melambangkan identitas dan marwah kedaerahan santri Priangan (Bandung, Garut, Sumedang, Cimahi). Bilah yang tajam melambangkan ketajaman akal budi, keberanian ksatria, dan gagang hulu macan mencerminkan kepemimpinan yang mengayomi umat.',
      elementColor: '#f59e0b',
      iconName: 'kujang',
    },
    {
      id: 'sym-4',
      name: '9 Bintang Merah Melengkung',
      meaning: 'Melambangkan keteladanan Walisongo sebagai sembilan wali penyebar dakwah Islam yang ramah, damai, dan bijaksana di Nusantara. Posisi melengkung menaungi langkah santri, dengan warna merah memancarkan keberanian, ghirah perjuangan, dan cinta tanah air (hubbul wathan minal iman).',
      elementColor: '#dc2626',
      iconName: 'stars',
    },
    {
      id: 'sym-5',
      name: 'Pita Hijau Melengkung',
      meaning: 'Melambangkan ikatan kekeluargaan (baraya) dan tali ukhuwah islamiyah yang kokoh antar sesama santri Priangan di tanah perantauan. Warna hijau mencerminkan kedamaian, kesejukan akhlak, dan kemakmuran bumi Pasundan dalam naungan Ahlussunnah wal Jama\'ah.',
      elementColor: '#16a34a',
      iconName: 'ribbon',
    },
    {
      id: 'sym-6',
      name: 'Kaligrafi Arab "جاتي برايا"',
      meaning: 'Ditulis dalam aksara Arab/Pegon yang menjadi identitas literasi pesantren, mengukuhkan nama agung JATIBARAYA (Jam\'iyyah Thullabi Bandung Garut Sumedang Raya). "Jati" berarti sejati, dan "Baraya" berarti sanak kerabat—mengikat ikrar persaudaraan sejati para santri hingga akhir hayat.',
      elementColor: '#15803d',
      iconName: 'calligraphy',
    },
  ],

  programs: [
    {
      id: 'prog-1',
      title: 'Istighosah Bulanan',
      schedule: 'Dilaksanakan setiap bulan',
      category: 'Spiritual',
      description:
        'Berisi dzikir, doa, kirim Fatihah, penguatan spiritual, dan doa bersama untuk kelancaran belajar santri serta keberkahan keilmuan.',
      featured: true,
      published: true,
      order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-2',
      title: 'Temu Warga',
      schedule: 'Dua kali dalam setahun',
      category: 'Silaturahmi',
      description:
        'Menjadi ruang silaturahmi akbar, komunikasi terpadu, dan penguatan tali kekeluargaan segenap warga Jatibaraya di pondok.',
      featured: true,
      published: true,
      order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-3',
      title: 'Panitia Rombongan Liburan',
      schedule: 'Setiap masa liburan pesantren',
      category: 'Pelayanan',
      description:
        'Mengkoordinasikan kepulangan dan keberangkatan santri Priangan saat masa liburan agar perjalanan lebih tertib, aman, terpantau, dan mudah mendapatkan informasi armada.',
      featured: true,
      published: true,
      order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-4',
      title: 'Halal Bihalal',
      schedule: 'Dua tahun sekali (masa liburan, bergiliran)',
      category: 'Silaturahmi',
      description:
        'Dilaksanakan setiap dua tahun pada masa liburan dan diadakan secara bergiliran di Bandung, Garut, dan Sumedang sebagai ajang silaturahmi warga dan alumni.',
      featured: false,
      published: true,
      order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-5',
      title: 'Safari Ramadan Priangan',
      schedule: 'Setiap bulan suci Ramadan',
      category: 'Dakwah',
      description:
        'Program dakwah di wilayah Priangan. Jatibaraya membantu koordinasi dan pelaksanaan kegiatan dakwah di Priangan melalui Lim Cabang Priangan berupa Imam Tarawih, Pengajian, Dakwah, Mengajar Al-Qur’an, dan kegiatan keagamaan lainnya.',
      details: 'Dikoordinasikan melalui Lim Cabang Priangan untuk menyalurkan santri berkhidmah langsung ke masyarakat.',
      featured: true,
      published: true,
      order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-6',
      title: 'Tim Seminar',
      schedule: 'Masa liburan pesantren',
      category: 'Keilmuan',
      description:
        'Mengunjungi pesantren-pesantren di wilayah Priangan dengan menghadirkan pemateri berkompeten yang berasal dari alumni Jatibaraya untuk berbagi ilmu dan motivasi studi.',
      featured: false,
      published: true,
      order: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-7',
      title: 'Tim Bahtsul Masail',
      schedule: 'Agenda berkala & momentum ilmiah',
      category: 'Keilmuan',
      description:
        'Mengkoordinasikan forum kajian mendalam dan pembahasan persoalan keislaman (waqi’iyyah/maudhu’iyyah) yang melibatkan delegasi dari pesantren di kawasan Priangan.',
      featured: true,
      published: true,
      order: 7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-8',
      title: 'Badan Usaha Milik Baraya (BUMB)',
      schedule: 'Sepanjang tahun & masa liburan',
      category: 'Ekonomi',
      description:
        'Bergerak dalam bidang kemandirian ekonomi organisasi dan penjualan produk-produk Lirboyo pada masa liburan guna menopang operasional wadah kekeluargaan.',
      featured: false,
      published: true,
      order: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-9',
      title: 'Media Baraya',
      schedule: 'Rutin & Berkelanjutan',
      category: 'Media',
      description:
        'Mengelola saluran komunikasi publik dan media sosial Jatibaraya (Instagram, TikTok, YouTube), sekaligus mendokumentasikan serta mempublikasikan syiar kegiatan.',
      featured: false,
      published: true,
      order: 9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-10',
      title: 'Buka Bersama Ramadan',
      schedule: 'Bulan suci Ramadan',
      category: 'Silaturahmi',
      description:
        'Kegiatan kebersamaan warga dan alumni Jatibaraya di Priangan pada bulan Ramadan sebagai sarana mempererat ukhuwah dan konsolidasi santri.',
      featured: false,
      published: true,
      order: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-11',
      title: 'Sambangan Akbar Walisantri',
      schedule: 'Setiap bulan Maulid',
      category: 'Pelayanan',
      description:
        'Mengkoordinasikan walisantri dari Bandung, Garut, Sumedang, dan Cimahi untuk berkunjung ke Lirboyo sebagai kelompok Priangan terkoordinir.',
      details: 'Rangkaian: 1. Silaturahmi walisantri se-Priangan, 2. Temu Masyayikh Lirboyo, 3. Ziarah Maqbarah Kasepuhan Lirboyo.',
      featured: true,
      published: true,
      order: 11,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prog-12',
      title: 'Tim Pembangunan',
      schedule: 'Kondisional & Terencana',
      category: 'Pembangunan',
      description:
        'Tim khusus yang bertugas merencanakan dan mendukung kegiatan pembangunan fisik serta sarana prasarana sesuai kebutuhan organisasi.',
      featured: false,
      published: true,
      order: 12,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],

  news: [
    {
      id: 'news-1',
      title: 'Keluarga Besar Jatibaraya Bersiap Sambut Rombongan Liburan Santri Priangan',
      slug: 'persiapan-rombongan-liburan-santri-priangan',
      summary:
        'Panitia rombongan liburan Jatibaraya mulai melakukan koordinasi armada dan titik kumpul kepulangan santri menuju Bandung, Garut, Sumedang, dan Cimahi.',
      content:
        'Dalam rangka memberikan kenyamanan, keamanan, dan ketertiban perjalanan santri asal Priangan, Panitia Rombongan Liburan Jatibaraya telah menggelar koordinasi terpadu. Armada bus dan titik penurunan telah disiapkan di berbagai titik strategis Priangan.\n\n"Kami mengimbau kepada seluruh warga santri untuk tetap tertib menaati aturan keselamatan serta menjaga akhlakul karimah selama perjalanan," ujar koordinator kepengurusan.',
      category: 'Pelayanan',
      author: 'Media Baraya',
      date: '2026-09-10',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'news-2',
      title: 'Safari Ramadan Jatibaraya Siap Mengabdi Melalui Lim Cabang Priangan',
      slug: 'safari-ramadan-lim-cabang-priangan',
      summary:
        'Penyaluran santri untuk tugas imam shalat tarawih, pengajian kitab, dan pembelajaran Al-Qur’an di masjid-masjid se-Priangan.',
      content:
        'Jatibaraya kembali mengukuhkan komitmen pengabdian melalui program Safari Ramadan Priangan. Melalui koordinasi Lim Cabang Priangan, para santri akan diterjunkan langsung ke masyarakat untuk menghidupkan syiar keagamaan, mengajar tilawah Al-Qur’an, serta mengisi majelis ta’lim masyarakat.',
      category: 'Dakwah',
      author: 'Media Baraya',
      date: '2026-08-25',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],

  articles: [
    {
      id: 'art-1',
      title: 'Mondok di Lirboyo, Ngaji Tur Ngabdi Pikeun Maslahat Umat Priangan',
      slug: 'mondok-di-lirboyo-ngabdi-pikeun-umat',
      summary:
        'Refleksi nilai ketawadhuan, ketekunan thalabul ilmi di pondok pesantren, dan implementasinya saat kembali ke tanah Pasundan.',
      content:
        'Tradisi keilmuan pesantren mengakar kuat dalam sanubari para santri. Ketika seorang santri menuntut ilmu di Pondok Pesantren Lirboyo Kediri, nilai-nilai barokah, tawadhu, dan kecintaan pada syariat senantiasa diasah setiap hari.\n\nBagi santri Priangan yang terhimpun dalam Jatibaraya, bekal keilmuan tersebut bukan sekadar untuk diri sendiri, melainkan harus diterjemahkan menjadi khidmah nyata bagi masyarakat Jawa Barat dan umat secara luas.',
      category: 'Refleksi Santri',
      author: 'Keluarga Santri Jatibaraya',
      date: '2026-09-01',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],

  bahtsulMasail: [
    {
      id: 'bm-1',
      title: 'Hukum Transaksi Fitur PayLater & Pembayaran Tempo Digital Menurut Tinjauan Fiqih',
      slug: 'hukum-transaksi-paylater-digital-fiqih',
      masalah:
        'Seiring pesatnya perkembangan transaksi digital, marak masyarakat dan santri memanfaatkan layanan "PayLater" pada marketplace dan dompet digital. Pengguna membeli barang saat ini dan melakukan pembayaran di kemudian hari dengan dikenakan biaya administrasi atau margin bunga tertentu. Bagaimana kedudukan fiqih atas akad transaksi PayLater tersebut?',
      jawaban:
        'Transaksi PayLater pada dasarnya diklasifikasikan ke dalam dua bentuk akad:\n\n1. Jika skema yang diterapkan adalah akad Qardh (pinjaman dana) yang mensyaratkan adanya tambahan nominal pengembalian (bunga/riba) atas pokok hutang, maka hukumnya adalah HARAM secara ijma\' karena tergolong Riba Qardhi.\n\n2. Jika skema yang diterapkan berupa akad Murabahah bil Wakalah (pihak aplikasi/penyedia membeli barang atas pesanan konsumen lalu menjualnya kembali secara tempo dengan margin laba yang disepakati secara transparan sejak awal), maka hukumnya DIPERBOLEHKAN (Jawaz), dengan catatan tidak ada klausul denda keterlambatan yang diambil sebagai keuntungan pribadi kreditur.',
      ibarat:
        'عبارة من كتاب إعانة الطالبين، ج ٣، ص ٥٣:\n(قَوْلُهُ: كُلُّ قَرْضٍ جَرَّ مَنْفَعَةً) أَيْ شُرِطَ فِيهِ ذَلِكَ أَوْ كَانَ عُرْفًا مُطَّرِدًا، فَهُوَ رِبًا مُحَرَّمٌ إِجْمَاعًا.\n\nعبارة من بغية المسترشدين، ص ١٣٤:\n(فَائِدَةٌ): يَجُوزُ لِلْبَائِعِ أَنْ يَزِيدَ فِي الثَّمَنِ لِأَجْلِ التَّأْجِيلِ إِذَا عَقَدَ الْبَيْعَ عَلَى ثَمَنٍ مُعَيَّنٍ فِي حَالِ الْعَقْدِ وَلَمْ يَكُنْ هُنَاكَ شَرْطُ زِيَادَةٍ مَشْرُوطَةٍ مُتَأَخِّرَةٍ.',
      kategori: 'Muamalah Kontemporer',
      tingkat: 'Forum Musyawarah Bahtsul Masail Santri Priangan',
      tanggal: '2026-08-20',
      musyawirin: 'LBM Santri Jatibaraya (Perumus: Ust. Ahmad Fauzi, Katib: M. Salman)',
      mushahih: 'Dewan Asatidz Pembina Santri Jatibaraya Kediri',
      status: 'sah',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'bm-2',
      title: 'Keabsahan Penyaluran Zakat Fitrah Menggunakan Uang Tunai / Qimah bagi Madzhab Syafi\'i',
      slug: 'keabsahan-zakat-fitrah-uang-tunai-madzhab-syafii',
      masalah:
        'Sebagian masyarakat Priangan Jawa Barat kerap menyalurkan zakat fitrah dalam wujud uang tunai (qimah) seharga bahan makanan pokok dengan alasan kepraktisan dan kebutuhan mustahiq. Bagaimanakah tinjauan fiqih keabsahan penunaian zakat fitrah menggunakan uang tunai?',
      jawaban:
        'Menurut Qaul Mu\'tamad dalam Madzhab Syafi\'i, zakat fitrah WAJIB dikeluarkan berupa makanan pokok setempat (beras 1 sha\' / ± 2,7 - 3 kg) dan TIDAK SAH jika dibayarkan berupa uang tunai (qimah).\n\nNamun, apabila terdapat hajat atau maslahat bagi mustahiq, diperbolehkan bertaklid (mengikuti) pendapat Madzhab Hanafi yang membolehkan qimah, atau mengikuti qaul Imam ar-Ruyani dari kalangan Syafi\'iyyah, dengan ketentuan besaran nominal uang yang dikeluarkan disesuaikan dengan standar madzhab yang diikuti.',
      ibarat:
        'عبارة من المجموع شرح المهذب للإمام النووي، ج ٦، ص ١١٠:\nلَا يُجْزِئُ فِي الْفِطْرَةِ إِخْرَاجُ الْقِيمَةِ عِنْدَنَا، وَبِهِ قَالَ مَالِكٌ وَأَحْمَدُ وَدَاوُدُ، وَقَالَ أَبُو حَنِيفَةَ: يَجُوزُ.\n\nعبارة من كفاية الأخيار، ص ١٩٤:\nوَالْأَوْلَى لِلْمُحْتَاطِ لِدِينِهِ أَنْ يُخْرِجَ عَيْنَ الْقُوتِ خُرُوجًا مِنَ الْخِلَافِ، فَإِنْ ضَاقَ الْأَمْرُ اتَّسَعَ بِالتَّقْلِيدِ.',
      kategori: 'Ubudiyyah',
      tingkat: 'Komisi Fiqhiyyah Jatibaraya',
      tanggal: '2026-03-28',
      musyawirin: 'Dewan Musyawirin Bahtsul Masail Jatibaraya',
      mushahih: 'Masyayikh & Tim Perumus Fiqih Priangan',
      status: 'sah',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],

  announcements: [
    {
      id: 'ann-1',
      title: 'Jadwal Pengambilan Tiket & Koordinasi Titik Kumpul Rombongan Liburan',
      content:
        'Diumumkan kepada seluruh santri warga Bandung, Garut, Sumedang, dan Cimahi agar segera mengonfirmasi titik turun dan kepulangan melalui posko panitia rombongan Jatibaraya.',
      priority: 'penting',
      date: '2026-09-15',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],

  media: [
    {
      id: 'med-1',
      title: 'Suasana Istighosah Bulanan Warga Jatibaraya',
      caption: 'Doa bersama untuk keselamatan, kelancaran studi, dan keberkahan sanad keilmuan para santri.',
      category: 'DOKUMENTASI',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      date: '2026-08-15',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med-2',
      title: 'Kebersamaan Temu Warga Santri Priangan',
      caption: 'Mempererat tali ukhuwah islamiyah dan kekeluargaan antar santri Bandung, Garut, Sumedang, dan Cimahi.',
      category: 'DOKUMENTASI',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
      date: '2026-07-20',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med-3',
      title: 'Pemberangkatan Rombongan Liburan Santri',
      caption: 'Armada koordinasi kepulangan dan pemberangkatan santri Priangan yang aman dan tertib.',
      category: 'PROGRAM',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      date: '2026-06-10',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med-4',
      title: 'Forum Bahtsul Masail Santri Priangan',
      caption: 'Kajian kitab kuning dan musyawarah hukum keislaman kontemporer.',
      category: 'PROGRAM',
      imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=1200&q=80',
      date: '2026-05-18',
      created_at: new Date().toISOString(),
    },
  ],

  stats: {
    wargaCount: '—',    // Strictly uninvented as required
    alumniCount: '—',   // Strictly uninvented as required
    programCount: '—',  // Strictly uninvented as required
    kegiatanCount: '—', // Strictly uninvented as required
    referenceYear: '2026',
    updated_at: new Date().toISOString(),
  },

  contact: {
    whatsapp: '', // Strictly empty until set by admin
    email: '',    // Strictly empty until set by admin
    address: '',  // Strictly empty until set by admin
    gmapsUrl: '',
    updated_at: new Date().toISOString(),
  },

  socials: [
    {
      id: 'soc-1',
      platform: 'instagram',
      name: 'Instagram',
      handle: 'Jatibaraya',
      url: 'https://www.instagram.com/jatibaraya/',
      active: true,
    },
    {
      id: 'soc-2',
      platform: 'tiktok',
      name: 'TikTok',
      handle: '@jatibaraya',
      url: 'https://www.tiktok.com/@jatibaraya',
      active: true,
    },
    {
      id: 'soc-3',
      platform: 'youtube',
      name: 'YouTube',
      handle: 'Jatibaraya',
      url: 'https://www.youtube.com/@jatibaraya',
      active: true,
    },
  ],
};
