/**
 * CatatSaham backend. Run setupCatatSaham() once, then deploy as Web App.
 * The data spreadsheet and the account spreadsheet are created automatically.
 * API access is protected by a shared key injected only by the CatatSaham Cloudflare Worker proxy.
 */
const CS_PROP = PropertiesService.getScriptProperties();
const CS = {
  DATA_ID: 'CATATSAHAM_DATA_SPREADSHEET_ID',
  ACCOUNT_ID: 'CATATSAHAM_ACCOUNT_SPREADSHEET_ID',
  API_KEY: 'CATATSAHAM_API_KEY',
  DEMO_ADMIN: 'demo_admin',
  DEMO_PASSWORD: 'CatatSaham@2026',
  DEMO_USER: 'trader01',
  DEMO_USER_PASSWORD: 'TraderDemo@2026'
};
const CS_STOCKS = [{"ticker":"AADI","name":"Adaro Andalan Indonesia","demoPrice":7500,"market":"IDX","isDemo":true},{"ticker":"AALI","name":"Astra Agro Lestari","demoPrice":7350,"market":"IDX","isDemo":true},{"ticker":"ABMM","name":"ABM Investama","demoPrice":3800,"market":"IDX","isDemo":true},{"ticker":"ACES","name":"Aspirasi Hidup Indonesia","demoPrice":650,"market":"IDX","isDemo":true},{"ticker":"ACST","name":"Acset Indonusa","demoPrice":120,"market":"IDX","isDemo":true},{"ticker":"ADCP","name":"Adhi Commuter Properti","demoPrice":50,"market":"IDX","isDemo":true},{"ticker":"ADES","name":"Akasha Wira International","demoPrice":9200,"market":"IDX","isDemo":true},{"ticker":"ADHI","name":"Adhi Karya","demoPrice":250,"market":"IDX","isDemo":true},{"ticker":"ADMR","name":"Adaro Minerals Indonesia","demoPrice":1180,"market":"IDX","isDemo":true},{"ticker":"ADRO","name":"Alamtri Resources Indonesia","demoPrice":2600,"market":"IDX","isDemo":true},{"ticker":"AGII","name":"Samator Indo Gas","demoPrice":1450,"market":"IDX","isDemo":true},{"ticker":"AGRO","name":"Bank Raya Indonesia","demoPrice":250,"market":"IDX","isDemo":true},{"ticker":"AKRA","name":"AKR Corporindo","demoPrice":1300,"market":"IDX","isDemo":true},{"ticker":"AMMN","name":"Amman Mineral Internasional","demoPrice":8200,"market":"IDX","isDemo":true},{"ticker":"AMRT","name":"Sumber Alfaria Trijaya","demoPrice":2850,"market":"IDX","isDemo":true},{"ticker":"ANTM","name":"Aneka Tambang","demoPrice":1540,"market":"IDX","isDemo":true},{"ticker":"APIC","name":"Pacific Strategic Financial","demoPrice":1150,"market":"IDX","isDemo":true},{"ticker":"ARCI","name":"Archi Indonesia","demoPrice":480,"market":"IDX","isDemo":true},{"ticker":"ARTO","name":"Bank Jago","demoPrice":2200,"market":"IDX","isDemo":true},{"ticker":"ASII","name":"Astra International","demoPrice":5100,"market":"IDX","isDemo":true},{"ticker":"ASLC","name":"Autopedia Sukses Lestari","demoPrice":100,"market":"IDX","isDemo":true},{"ticker":"ASSA","name":"Adi Sarana Armada","demoPrice":750,"market":"IDX","isDemo":true},{"ticker":"AUTO","name":"Astra Otoparts","demoPrice":2400,"market":"IDX","isDemo":true},{"ticker":"AVIA","name":"Avia Avian","demoPrice":350,"market":"IDX","isDemo":true},{"ticker":"BABP","name":"Bank MNC Internasional","demoPrice":70,"market":"IDX","isDemo":true},{"ticker":"BACA","name":"Bank Capital Indonesia","demoPrice":110,"market":"IDX","isDemo":true},{"ticker":"BANK","name":"Bank Aladin Syariah","demoPrice":1150,"market":"IDX","isDemo":true},{"ticker":"BAPA","name":"Bekasi Asri Pemula","demoPrice":70,"market":"IDX","isDemo":true},{"ticker":"BALI","name":"Bali Towerindo Sentra","demoPrice":1200,"market":"IDX","isDemo":true},{"ticker":"BBCA","name":"Bank Central Asia","demoPrice":10200,"market":"IDX","isDemo":true},{"ticker":"BBHI","name":"Allo Bank Indonesia","demoPrice":1200,"market":"IDX","isDemo":true},{"ticker":"BBKP","name":"Bank KB Indonesia","demoPrice":60,"market":"IDX","isDemo":true},{"ticker":"BBNI","name":"Bank Negara Indonesia","demoPrice":4700,"market":"IDX","isDemo":true},{"ticker":"BBRI","name":"Bank Rakyat Indonesia","demoPrice":3950,"market":"IDX","isDemo":true},{"ticker":"BBTN","name":"Bank Tabungan Negara","demoPrice":1320,"market":"IDX","isDemo":true},{"ticker":"BBYB","name":"Bank Neo Commerce","demoPrice":300,"market":"IDX","isDemo":true},{"ticker":"BCIC","name":"Bank JTrust Indonesia","demoPrice":100,"market":"IDX","isDemo":true},{"ticker":"BDMN","name":"Bank Danamon Indonesia","demoPrice":2600,"market":"IDX","isDemo":true},{"ticker":"BEKS","name":"Bank Pembangunan Daerah Banten","demoPrice":50,"market":"IDX","isDemo":true},{"ticker":"BFIN","name":"BFI Finance Indonesia","demoPrice":950,"market":"IDX","isDemo":true},{"ticker":"BHIT","name":"MNC Asia Holding","demoPrice":55,"market":"IDX","isDemo":true},{"ticker":"BIRD","name":"Blue Bird","demoPrice":1750,"market":"IDX","isDemo":true},{"ticker":"BJBR","name":"Bank BJB","demoPrice":900,"market":"IDX","isDemo":true},{"ticker":"BJTM","name":"Bank Pembangunan Daerah Jawa Timur","demoPrice":650,"market":"IDX","isDemo":true},{"ticker":"BMRI","name":"Bank Mandiri","demoPrice":5850,"market":"IDX","isDemo":true},{"ticker":"BNGA","name":"Bank CIMB Niaga","demoPrice":1800,"market":"IDX","isDemo":true},{"ticker":"BNII","name":"Bank Maybank Indonesia","demoPrice":230,"market":"IDX","isDemo":true},{"ticker":"BNLI","name":"Bank Permata","demoPrice":1150,"market":"IDX","isDemo":true},{"ticker":"BRIS","name":"Bank Syariah Indonesia","demoPrice":2700,"market":"IDX","isDemo":true},{"ticker":"BRMS","name":"Bumi Resources Minerals","demoPrice":400,"market":"IDX","isDemo":true},{"ticker":"BRPT","name":"Barito Pacific","demoPrice":1000,"market":"IDX","isDemo":true},{"ticker":"BSDE","name":"Bumi Serpong Damai","demoPrice":1000,"market":"IDX","isDemo":true},{"ticker":"BTPS","name":"Bank BTPN Syariah","demoPrice":1100,"market":"IDX","isDemo":true},{"ticker":"BUKA","name":"Bukalapak.com","demoPrice":120,"market":"IDX","isDemo":true},{"ticker":"BULL","name":"Buana Lintas Lautan","demoPrice":150,"market":"IDX","isDemo":true},{"ticker":"CAMP","name":"Campina Ice Cream Industry","demoPrice":330,"market":"IDX","isDemo":true},{"ticker":"CASS","name":"Cardig Aero Services","demoPrice":3000,"market":"IDX","isDemo":true},{"ticker":"CEKA","name":"Wilmar Cahaya Indonesia","demoPrice":1900,"market":"IDX","isDemo":true},{"ticker":"CFIN","name":"Clipan Finance Indonesia","demoPrice":300,"market":"IDX","isDemo":true},{"ticker":"CINT","name":"Chitose Internasional","demoPrice":300,"market":"IDX","isDemo":true},{"ticker":"CLEO","name":"Sariguna Primatirta","demoPrice":1200,"market":"IDX","isDemo":true},{"ticker":"CMRY","name":"Cisarua Mountain Dairy","demoPrice":5000,"market":"IDX","isDemo":true},{"ticker":"CPIN","name":"Charoen Pokphand Indonesia","demoPrice":4800,"market":"IDX","isDemo":true},{"ticker":"CTRA","name":"Ciputra Development","demoPrice":1100,"market":"IDX","isDemo":true},{"ticker":"CYBR","name":"ITSEC Asia","demoPrice":500,"market":"IDX","isDemo":true},{"ticker":"DEWA","name":"Darma Henwa","demoPrice":120,"market":"IDX","isDemo":true},{"ticker":"DGNS","name":"Diagnos Laboratorium Utama","demoPrice":100,"market":"IDX","isDemo":true},{"ticker":"DOID","name":"Bumi Resources","demoPrice":500,"market":"IDX","isDemo":true},{"ticker":"DRMA","name":"Dharma Polimetal","demoPrice":1000,"market":"IDX","isDemo":true},{"ticker":"DSNG","name":"Dharma Satya Nusantara","demoPrice":850,"market":"IDX","isDemo":true},{"ticker":"DSSA","name":"Dian Swastatika Sentosa","demoPrice":33000,"market":"IDX","isDemo":true},{"ticker":"EMTK","name":"Elang Mahkota Teknologi","demoPrice":500,"market":"IDX","isDemo":true},{"ticker":"ENRG","name":"Energi Mega Persada","demoPrice":250,"market":"IDX","isDemo":true},{"ticker":"ERAA","name":"Erajaya Swasembada","demoPrice":450,"market":"IDX","isDemo":true},{"ticker":"ESSA","name":"ESSA Industries Indonesia","demoPrice":700,"market":"IDX","isDemo":true},{"ticker":"EXCL","name":"XLSmart Telecom Sejahtera","demoPrice":2300,"market":"IDX","isDemo":true},{"ticker":"FAST","name":"Fast Food Indonesia","demoPrice":500,"market":"IDX","isDemo":true},{"ticker":"FILM","name":"MD Entertainment","demoPrice":3000,"market":"IDX","isDemo":true},{"ticker":"GJTL","name":"Gajah Tunggal","demoPrice":1100,"market":"IDX","isDemo":true},{"ticker":"GOTO","name":"GoTo Gojek Tokopedia","demoPrice":70,"market":"IDX","isDemo":true},{"ticker":"HEAL","name":"Medikaloka Hermina","demoPrice":1400,"market":"IDX","isDemo":true},{"ticker":"HMSP","name":"HM Sampoerna","demoPrice":700,"market":"IDX","isDemo":true},{"ticker":"HRUM","name":"Harum Energy","demoPrice":1200,"market":"IDX","isDemo":true},{"ticker":"ICBP","name":"Indofood CBP Sukses Makmur","demoPrice":11700,"market":"IDX","isDemo":true},{"ticker":"INCO","name":"Vale Indonesia","demoPrice":3800,"market":"IDX","isDemo":true},{"ticker":"INDF","name":"Indofood Sukses Makmur","demoPrice":7200,"market":"IDX","isDemo":true},{"ticker":"INDY","name":"Indika Energy","demoPrice":1500,"market":"IDX","isDemo":true},{"ticker":"INKP","name":"Indah Kiat Pulp & Paper","demoPrice":8000,"market":"IDX","isDemo":true},{"ticker":"INTP","name":"Indocement Tunggal Prakarsa","demoPrice":6500,"market":"IDX","isDemo":true},{"ticker":"ISAT","name":"Indosat Ooredoo Hutchison","demoPrice":2200,"market":"IDX","isDemo":true},{"ticker":"ITMG","name":"Indo Tambangraya Megah","demoPrice":25000,"market":"IDX","isDemo":true},{"ticker":"JPFA","name":"Japfa Comfeed Indonesia","demoPrice":1700,"market":"IDX","isDemo":true},{"ticker":"JSMR","name":"Jasa Marga","demoPrice":4300,"market":"IDX","isDemo":true},{"ticker":"KLBF","name":"Kalbe Farma","demoPrice":1500,"market":"IDX","isDemo":true},{"ticker":"LPKR","name":"Lippo Karawaci","demoPrice":75,"market":"IDX","isDemo":true},{"ticker":"LSIP","name":"PP London Sumatra Indonesia","demoPrice":1100,"market":"IDX","isDemo":true},{"ticker":"MAPA","name":"Map Aktif Adiperkasa","demoPrice":800,"market":"IDX","isDemo":true},{"ticker":"MAPI","name":"Mitra Adiperkasa","demoPrice":1500,"market":"IDX","isDemo":true},{"ticker":"MBMA","name":"Merdeka Battery Materials","demoPrice":500,"market":"IDX","isDemo":true},{"ticker":"MDKA","name":"Merdeka Copper Gold","demoPrice":2200,"market":"IDX","isDemo":true},{"ticker":"MEDC","name":"Medco Energi Internasional","demoPrice":1200,"market":"IDX","isDemo":true},{"ticker":"MIKA","name":"Mitra Keluarga Karyasehat","demoPrice":2600,"market":"IDX","isDemo":true},{"ticker":"MNCN","name":"Media Nusantara Citra","demoPrice":300,"market":"IDX","isDemo":true},{"ticker":"MPPA","name":"Matahari Putra Prima","demoPrice":80,"market":"IDX","isDemo":true},{"ticker":"MYOR","name":"Mayora Indah","demoPrice":2500,"market":"IDX","isDemo":true},{"ticker":"NCKL","name":"Trimegah Bangun Persada","demoPrice":950,"market":"IDX","isDemo":true},{"ticker":"PGAS","name":"Perusahaan Gas Negara","demoPrice":1600,"market":"IDX","isDemo":true},{"ticker":"PGEO","name":"Pertamina Geothermal Energy","demoPrice":1200,"market":"IDX","isDemo":true},{"ticker":"PTBA","name":"Bukit Asam","demoPrice":2700,"market":"IDX","isDemo":true},{"ticker":"PTRO","name":"Petrosea","demoPrice":2800,"market":"IDX","isDemo":true},{"ticker":"PWON","name":"Pakuwon Jati","demoPrice":450,"market":"IDX","isDemo":true},{"ticker":"RAJA","name":"Rukun Raharja","demoPrice":2500,"market":"IDX","isDemo":true},{"ticker":"SMGR","name":"Semen Indonesia","demoPrice":3100,"market":"IDX","isDemo":true},{"ticker":"SIDO","name":"Industri Jamu dan Farmasi Sido Muncul","demoPrice":600,"market":"IDX","isDemo":true},{"ticker":"SILO","name":"Siloam International Hospitals","demoPrice":2400,"market":"IDX","isDemo":true},{"ticker":"SMRA","name":"Summarecon Agung","demoPrice":500,"market":"IDX","isDemo":true},{"ticker":"SRTG","name":"Saratoga Investama Sedaya","demoPrice":1800,"market":"IDX","isDemo":true},{"ticker":"SSIA","name":"Surya Semesta Internusa","demoPrice":1000,"market":"IDX","isDemo":true},{"ticker":"TINS","name":"Timah","demoPrice":1100,"market":"IDX","isDemo":true},{"ticker":"TKIM","name":"Pabrik Kertas Tjiwi Kimia","demoPrice":7000,"market":"IDX","isDemo":true},{"ticker":"TLKM","name":"Telkom Indonesia","demoPrice":3000,"market":"IDX","isDemo":true},{"ticker":"TOWR","name":"Sarana Menara Nusantara","demoPrice":600,"market":"IDX","isDemo":true},{"ticker":"TPIA","name":"Chandra Asri Pacific","demoPrice":8000,"market":"IDX","isDemo":true},{"ticker":"UNTR","name":"United Tractors","demoPrice":25500,"market":"IDX","isDemo":true},{"ticker":"UNVR","name":"Unilever Indonesia","demoPrice":1800,"market":"IDX","isDemo":true},{"ticker":"WIFI","name":"Solusi Sinergi Digital","demoPrice":2600,"market":"IDX","isDemo":true},{"ticker":"WIKA","name":"Wijaya Karya","demoPrice":200,"market":"IDX","isDemo":true},{"ticker":"WINS","name":"Wintermar Offshore Marine","demoPrice":300,"market":"IDX","isDemo":true},{"ticker":"ACRO","name":"Samcro Hyosung Adilestari","demoPrice":200,"market":"IDX","isDemo":true},{"ticker":"ADMF","name":"Adira Dinamika Multi Finance","demoPrice":9000,"market":"IDX","isDemo":true},{"ticker":"ADMG","name":"Polychem Indonesia","demoPrice":90,"market":"IDX","isDemo":true},{"ticker":"AGRS","name":"Bank IBK Indonesia","demoPrice":80,"market":"IDX","isDemo":true},{"ticker":"ALTO","name":"Tri Banyan Tirta","demoPrice":100,"market":"IDX","isDemo":true},{"ticker":"AMAN","name":"Makmur Berkah Amanda","demoPrice":300,"market":"IDX","isDemo":true},{"ticker":"AMFG","name":"Asahimas Flat Glass","demoPrice":5000,"market":"IDX","isDemo":true},{"ticker":"ANJT","name":"Austindo Nusantara Jaya","demoPrice":1000,"market":"IDX","isDemo":true},{"ticker":"ARNA","name":"Arwana Citramulia","demoPrice":750,"market":"IDX","isDemo":true},{"ticker":"ASGR","name":"Astra Graphia","demoPrice":1400,"market":"IDX","isDemo":true},{"ticker":"ASRI","name":"Alam Sutera Realty","demoPrice":150,"market":"IDX","isDemo":true},{"ticker":"BBMD","name":"Bank Mestika Dharma","demoPrice":1700,"market":"IDX","isDemo":true},{"ticker":"BEST","name":"Bekasi Fajar Industrial Estate","demoPrice":100,"market":"IDX","isDemo":true},{"ticker":"BISI","name":"BISI International","demoPrice":1200,"market":"IDX","isDemo":true},{"ticker":"BMTR","name":"Global Mediacom","demoPrice":250,"market":"IDX","isDemo":true},{"ticker":"BNBA","name":"Bank Bumi Arta","demoPrice":800,"market":"IDX","isDemo":true},{"ticker":"BRAM","name":"Indo Kordsa","demoPrice":7000,"market":"IDX","isDemo":true},{"ticker":"BUDI","name":"Budi Starch & Sweetener","demoPrice":110,"market":"IDX","isDemo":true},{"ticker":"DMAS","name":"Puradelta Lestari","demoPrice":150,"market":"IDX","isDemo":true},{"ticker":"ELSA","name":"Elnusa","demoPrice":450,"market":"IDX","isDemo":true},{"ticker":"FREN","name":"Smartfren Telecom","demoPrice":50,"market":"IDX","isDemo":true},{"ticker":"GEMS","name":"Golden Energy Mines","demoPrice":6500,"market":"IDX","isDemo":true},{"ticker":"GPRA","name":"Perdana Gapuraprima","demoPrice":75,"market":"IDX","isDemo":true},{"ticker":"HERO","name":"Darya-Varia Laboratoria","demoPrice":1200,"market":"IDX","isDemo":true},{"ticker":"HEXA","name":"Hexindo Adiperkasa","demoPrice":5000,"market":"IDX","isDemo":true},{"ticker":"HOKI","name":"Buyung Poetra Sembada","demoPrice":100,"market":"IDX","isDemo":true},{"ticker":"INAF","name":"Indofarma","demoPrice":100,"market":"IDX","isDemo":true},{"ticker":"KAEF","name":"Kimia Farma","demoPrice":500,"market":"IDX","isDemo":true},{"ticker":"KIJA","name":"Kawasan Industri Jababeka","demoPrice":120,"market":"IDX","isDemo":true},{"ticker":"LINK","name":"Link Net","demoPrice":1500,"market":"IDX","isDemo":true},{"ticker":"LION","name":"Lion Metal Works","demoPrice":700,"market":"IDX","isDemo":true},{"ticker":"LPPF","name":"Matahari Department Store","demoPrice":1500,"market":"IDX","isDemo":true},{"ticker":"MBSS","name":"Mitrabahtera Segara Sejati","demoPrice":1200,"market":"IDX","isDemo":true},{"ticker":"MDLN","name":"Modernland Realty","demoPrice":60,"market":"IDX","isDemo":true},{"ticker":"MEGA","name":"Bank Mega","demoPrice":4000,"market":"IDX","isDemo":true},{"ticker":"MLBI","name":"Multi Bintang Indonesia","demoPrice":8000,"market":"IDX","isDemo":true},{"ticker":"MTDL","name":"Metrodata Electronics","demoPrice":600,"market":"IDX","isDemo":true},{"ticker":"NISP","name":"Bank OCBC NISP","demoPrice":1300,"market":"IDX","isDemo":true},{"ticker":"PANI","name":"Pantai Indah Kapuk Dua","demoPrice":12000,"market":"IDX","isDemo":true},{"ticker":"PANS","name":"Panin Sekuritas","demoPrice":1100,"market":"IDX","isDemo":true},{"ticker":"PNBN","name":"Bank Pan Indonesia","demoPrice":1300,"market":"IDX","isDemo":true},{"ticker":"PNLF","name":"Panin Financial","demoPrice":300,"market":"IDX","isDemo":true},{"ticker":"PUDP","name":"Pudjiadi Prestige","demoPrice":150,"market":"IDX","isDemo":true},{"ticker":"SCMA","name":"Surya Citra Media","demoPrice":200,"market":"IDX","isDemo":true},{"ticker":"SMDR","name":"Samudera Indonesia","demoPrice":350,"market":"IDX","isDemo":true},{"ticker":"SMKL","name":"Satyamitra Kemas Lestari","demoPrice":100,"market":"IDX","isDemo":true},{"ticker":"SMMA","name":"Sinarmas Multiartha","demoPrice":12000,"market":"IDX","isDemo":true},{"ticker":"SOCI","name":"Soechi Lines","demoPrice":180,"market":"IDX","isDemo":true},{"ticker":"TBIG","name":"Tower Bersama Infrastructure","demoPrice":1600,"market":"IDX","isDemo":true},{"ticker":"TSPC","name":"Tempo Scan Pacific","demoPrice":1700,"market":"IDX","isDemo":true},{"ticker":"ULTJ","name":"Ultra Jaya Milk Industry","demoPrice":1800,"market":"IDX","isDemo":true},{"ticker":"VICI","name":"Victoria Care Indonesia","demoPrice":300,"market":"IDX","isDemo":true},{"ticker":"WTON","name":"Wijaya Karya Beton","demoPrice":100,"market":"IDX","isDemo":true},{"ticker":"YULE","name":"Yulie Sekuritas Indonesia","demoPrice":120,"market":"IDX","isDemo":true}];
const CS_MODELS = [
  [1,'Scalping','Transaksi sangat singkat untuk pergerakan harga kecil.',1,'AKTIF'],
  [2,'Day Trading','Posisi dibuka dan ditutup pada hari yang sama.',2,'AKTIF'],
  [3,'Swing Trading','Memanfaatkan pergerakan harga beberapa hari hingga beberapa minggu.',3,'AKTIF'],
  [4,'Position Trading','Mengikuti tren dalam horizon yang lebih panjang.',4,'AKTIF'],
  [5,'Investasi Jangka Panjang (Buy & Hold)','Menyimpan saham untuk tujuan jangka panjang.',5,'AKTIF'],
  [6,'Lainnya','Model trading buatan pengguna.',6,'AKTIF']
];
const CS_SECURITIES = [
  ['Stockbit',0.15,0.25,'ESTIMASI'],['Bibit',0.15,0.25,'ESTIMASI'],['Ajaib',0.15,0.25,'ESTIMASI'],
  ['BCA Sekuritas',0.18,0.28,'ESTIMASI'],['IPOT',0.19,0.29,'ESTIMASI'],['MOST (Mandiri Sekuritas)',0.18,0.28,'ESTIMASI'],
  ['Mirae Asset',0.15,0.25,'ESTIMASI'],['BNI Sekuritas',0.17,0.27,'ESTIMASI'],['MNC Sekuritas',0.18,0.28,'ESTIMASI'],
  ['Sinarmas Sekuritas',0.15,0.25,'ESTIMASI'],['Phillip Sekuritas',0.18,0.28,'ESTIMASI'],['CGS International Sekuritas',0.18,0.28,'ESTIMASI'],
  ['Trimegah Sekuritas',0.18,0.28,'ESTIMASI'],['Maybank Sekuritas',0.18,0.28,'ESTIMASI'],['RHB Sekuritas',0.18,0.28,'ESTIMASI'],
  ['NH Korindo Sekuritas',0.18,0.28,'ESTIMASI'],['Kiwoom Sekuritas',0.18,0.28,'ESTIMASI'],['Korea Investment and Sekuritas Indonesia',0.18,0.28,'ESTIMASI'],
  ['Bahana Sekuritas',0.18,0.28,'ESTIMASI'],['Danareksa Sekuritas',0.18,0.28,'ESTIMASI'],['Samuel Sekuritas',0.18,0.28,'ESTIMASI'],
  ['Yuanta Sekuritas',0.18,0.28,'ESTIMASI'],['FAC Sekuritas',0.18,0.28,'ESTIMASI'],['Henan Putihrai Sekuritas',0.18,0.28,'ESTIMASI'],
  ['UBS Sekuritas',0.18,0.28,'ESTIMASI'],['Lainnya',0,0,'MANUAL']
];
const CS_TABLES = {
  AppState: ['AccountID','StateJSON','UpdatedAt'],
  TradingPlan: ['AccountID','PlanningID','Ticker','ModalAwal','ModelTrading','ModelTradingLainnya','TanggalDibuat','TanggalDiperbarui','Status','Catatan','PlanningIDAsal','PlanningStatus'],
  TradingPlanRows: ['AccountID','PlanningRowID','PlanningID','NoUrut','TanggalBuy','HargaBuy','LotBuy','NilaiBuy','FeeBuyPersen','FeeBuyNominal','PersenDariModal','AkumulasiLot','HargaRataRata','AkumulasiInvestasiTermasukFeeBuy','BuyTransactionID','TanggalSell','HargaSell','LotSell','NilaiSell','FeeSellPersen','FeeSellNominal','ProfitLossBruto','FeeBuyTeralokasi','ProfitLossBersih','PersenProfitLossBersih','SisaInvestasi','SisaLot','EvaluasiBuy','EvaluasiSell'],
  TradingSaya: ['AccountID','TradingSayaID','Ticker','ModalAwal','ModelTrading','ModelTradingLainnya','SekuritasID','NamaSekuritas','SekuritasLainnya','TanggalDibuat','TanggalDiperbarui','Status','StatusArsip','PlanningIDAsal','Catatan'],
  TradingSayaRows: ['AccountID','TradingSayaRowID','TradingSayaID','NoUrut','TanggalBuy','HargaBuy','LotBuy','NilaiBuy','FeeBuyPersen','FeeBuyNominal','PersenDariModal','AkumulasiLot','HargaRataRata','AkumulasiInvestasiTermasukFeeBuy','BuyTransactionID','TanggalSell','HargaSell','LotSell','NilaiSell','FeeSellPersen','FeeSellNominal','ProfitLossBruto','FeeBuyTeralokasi','ProfitLossBersih','PersenProfitLossBersih','SisaInvestasi','SisaLot','SellTransactionID','EvaluasiBuy','EvaluasiSell'],
  JurnalTrading: ['AccountID','TransactionID','TradingSayaID','TradingSayaRowID','Tanggal','Ticker','Sekuritas','ModelTrading','JenisTransaksi','Harga','Lot','NilaiTransaksi','CostBasisBruto','ProfitLossBruto','FeeBuyTeralokasi','FeeTransaksi','ProfitLossBersih','SisaLot','StatusTrading'],
  Dividen: ['AccountID','DividenID','Ticker','TanggalDividen','DividenBruto','PajakPotongan','DividenBersih','Catatan'],
  MasterSekuritas: ['AccountID','SekuritasID','NamaSekuritas','FeeBeliDefaultPersen','FeeJualDefaultPersen','StatusTarif','SumberTarifURL','TanggalVerifikasi','CatatanTarif','Status','Urutan'],
  MasterModelTrading: ['ModelTradingID','NamaModel','Deskripsi','Urutan','Status'],
  MasterEmiten: ['EmitenID','KodeEmiten','NamaEmiten','TickerGoogleFinance','HargaSaatIni','WaktuUpdate','DelayMenit','StatusHarga','StatusListing','Sektor','SumberData','Catatan','HargaDemoFallback'],
  TemplateImport: ['AccountID','TradingSayaID','Ticker','TanggalBuy','HargaBuy','LotBuy','TanggalSell','HargaSell','LotSell','Sekuritas','ModelTrading','FeeBuyPersen','FeeBuyNominal','FeeSellPersen','FeeSellNominal','EvaluasiBuy','EvaluasiSell']
};

/** One-time and repeat-safe installation: creates both DB spreadsheets and inserts demo data. */
function setupCatatSaham() {
  const dataBook = openOrCreateBook_(CS.DATA_ID, 'CatatSaham - Database Data');
  const accountBook = openOrCreateBook_(CS.ACCOUNT_ID, 'CatatSaham - Database Akun');
  Object.keys(CS_TABLES).forEach(name => {
    if (name === 'AppState') ensureSheet_(dataBook, name, CS_TABLES[name]);
    else ensureSheet_(dataBook, name, CS_TABLES[name]);
  });
  ensureSheet_(accountBook, 'Akun', ['AccountID','Username','PasswordHash','PasswordSalt','Role','Status','TanggalDibuat','TerakhirLogin','Catatan']);
  ensureSheet_(accountBook, 'Panduan', ['Topik','Keterangan']);
  ensureSheet_(dataBook, 'Panduan', ['Topik','Keterangan']);
  seedSharedMasters_(dataBook);
  seedAccounts_(accountBook);
  const admin = findAccountByUsername_(accountBook, CS.DEMO_ADMIN);
  if (admin) {
    const stateSheet = dataBook.getSheetByName('AppState');
    if (!findStateRow_(stateSheet, Number(admin.AccountID))) {
      const state = buildDemoState_();
      writeState_(dataBook, Number(admin.AccountID), state);
      seedPhysicalDemoData_(dataBook, Number(admin.AccountID));
    }
  }
  seedGuides_(dataBook, accountBook);
  const key = ensureApiKey_();
  const info = {
    dataSpreadsheetUrl: dataBook.getUrl(),
    accountSpreadsheetUrl: accountBook.getUrl(),
    webAppSetup: 'Deploy > New deployment > Web app; Execute as Me; Who has access: Anyone',
    cloudflareEnvironment: ['APPS_SCRIPT_URL = URL Web App yang berakhiran /exec','CATATSAHAM_API_KEY = nilai di bawah ini'],
    apiKey: key,
    demoLogin: { username: CS.DEMO_ADMIN, password: CS.DEMO_PASSWORD },
    additionalDemoAccount: { username: CS.DEMO_USER, password: CS.DEMO_USER_PASSWORD, note: 'akun aktif, data sendiri kosong; akun nonaktif dibuat sebagai contoh' }
  };
  console.log('CATATSAHAM_SETUP_RESULT\n' + JSON.stringify(info, null, 2));
  return info;
}

function doGet() {
  return json_({ ok: true, service: 'CatatSaham Apps Script API', message: 'Endpoint siap. Gunakan POST melalui CatatSaham Cloudflare Worker.' });
}
function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const expectedKey = CS_PROP.getProperty(CS.API_KEY) || '';
    if (!expectedKey || !payload.apiKey || payload.apiKey !== expectedKey) return json_({ ok:false, error:'API key tidak valid.' });
    const action = String(payload.action || '');
    if (action === 'health') return json_({ ok:true, service:'CatatSaham Apps Script API', time:new Date().toISOString() });
    if (action === 'login') return login_(payload);
    if (action === 'getState') {
      const session = requireSession_(payload.token);
      return json_({ ok:true, user:publicUser_(session), state:loadStateForAccount_(session.accountId) });
    }
    if (action === 'saveState') {
      const session = requireSession_(payload.token);
      if (!payload.state || typeof payload.state !== 'object') throw new Error('State aplikasi tidak ditemukan.');
      saveStateForAccount_(session.accountId, payload.state, payload.tables || {});
      return json_({ ok:true, savedAt:new Date().toISOString() });
    }
    if (action === 'changePassword') {
      const session = requireSession_(payload.token);
      return changePassword_(session, payload);
    }
    return json_({ ok:false, error:'Action tidak dikenal.' });
  } catch (err) {
    console.error(err && err.stack || err);
    return json_({ ok:false, error:String(err && err.message || err || 'Kesalahan server.') });
  }
}

function login_(payload) {
  const username = String(payload.username || '').trim().toLowerCase();
  const password = String(payload.password || '');
  if (!username || !password) throw new Error('Username dan password wajib diisi.');
  const book = openBookByProp_(CS.ACCOUNT_ID);
  const account = findAccountByUsername_(book, username);
  if (!account || account.Status !== 'AKTIF' || !verifyPassword_(password, account.PasswordSalt, account.PasswordHash)) throw new Error('Username/password salah atau akun tidak aktif.');
  const token = Utilities.getUuid().replace(/-/g,'') + Utilities.getUuid().replace(/-/g,'');
  const session = { accountId:Number(account.AccountID), username:String(account.Username), role:String(account.Role), createdAt:Date.now() };
  CacheService.getScriptCache().put('CS_SESSION_'+token, JSON.stringify(session), 21600);
  touchLastLogin_(book, Number(account.AccountID));
  return json_({ ok:true, token:token, user:publicUser_(session), state:loadStateForAccount_(session.accountId) });
}
function changePassword_(session, payload) {
  const currentPassword = String(payload.currentPassword || '');
  const newPassword = String(payload.newPassword || '');
  if (newPassword.length < 10) throw new Error('Password baru minimal 10 karakter.');
  const book = openBookByProp_(CS.ACCOUNT_ID);
  const account = findAccountByUsername_(book, session.username);
  if (!account || !verifyPassword_(currentPassword, account.PasswordSalt, account.PasswordHash)) throw new Error('Password saat ini tidak sesuai.');
  const salt = Utilities.getUuid()+Utilities.getUuid();
  const hash = hashPassword_(newPassword, salt);
  const sheet = book.getSheetByName('Akun');
  const row = Number(account._row);
  sheet.getRange(row,4).setValue(salt);
  sheet.getRange(row,3).setValue(hash);
  sheet.getRange(row,9).setValue('Password diperbarui oleh pemilik akun pada '+new Date().toISOString());
  return json_({ ok:true, message:'Password berhasil diperbarui.' });
}
function requireSession_(token) {
  if (!token) throw new Error('Sesi tidak ditemukan. Silakan login kembali.');
  const raw = CacheService.getScriptCache().get('CS_SESSION_'+String(token));
  if (!raw) throw new Error('Sesi berakhir. Silakan login kembali.');
  const session = JSON.parse(raw);
  if (!session.accountId || !session.username) throw new Error('Sesi tidak valid.');
  return session;
}
function publicUser_(session) { return { accountId:Number(session.accountId), username:String(session.username), role:String(session.role || 'USER') }; }

function loadStateForAccount_(accountId) {
  const book = openBookByProp_(CS.DATA_ID);
  const row = findStateRow_(book.getSheetByName('AppState'), Number(accountId));
  let state = row ? JSON.parse(row.StateJSON || '{}') : blankState_();
  if (!row && Number(accountId) === 1) state = buildDemoState_();
  state.version = 4;
  state.emitens = readStocks_(book);
  state.users = [];
  state.dividends = Array.isArray(state.dividends) ? state.dividends : [];
  state.securities = Array.isArray(state.securities) && state.securities.length ? state.securities : defaultSecurities_();
  return state;
}
function saveStateForAccount_(accountId, incoming, tables) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const book = openBookByProp_(CS.DATA_ID);
    const state = JSON.parse(JSON.stringify(incoming));
    delete state.emitens; delete state.users;
    state.version = 4;
    writeState_(book, Number(accountId), state);
    const accountTables = [
      ['TradingPlan','planMaster'],['TradingPlanRows','planRows'],['TradingSaya','tradingMaster'],
      ['TradingSayaRows','tradingRows'],['JurnalTrading','journalRows'],['Dividen','dividendRows'],
      ['MasterSekuritas','securityRows'],['TemplateImport','importRows']
    ];
    accountTables.forEach(pair => {
      const sheetName=pair[0], key=pair[1];
      // Missing tables are not interpreted as empty: this prevents older clients from clearing data by accident.
      if (!tables || !Object.prototype.hasOwnProperty.call(tables, key) || !Array.isArray(tables[key])) return;
      replaceAccountRows_(book, sheetName, Number(accountId), tables[key]);
    });
    // MasterEmiten and MasterModelTrading are intentionally reference tables and are never overwritten by user saves.
  } finally { lock.releaseLock(); }
}
function writeState_(book, accountId, state) {
  const sheet=book.getSheetByName('AppState');
  let row=findStateRow_(sheet, accountId);
  const encoded=JSON.stringify(state);
  if (row) sheet.getRange(Number(row._row),1,1,3).setValues([[accountId,encoded,new Date()]]);
  else sheet.appendRow([accountId,encoded,new Date()]);
}
function findStateRow_(sheet, accountId) {
  if (!sheet || sheet.getLastRow()<2) return null;
  const values=sheet.getRange(2,1,sheet.getLastRow()-1,3).getValues();
  for (let i=0;i<values.length;i++) if(Number(values[i][0])===Number(accountId)) return { _row:i+2, AccountID:values[i][0], StateJSON:values[i][1], UpdatedAt:values[i][2] };
  return null;
}
function replaceAccountRows_(book, sheetName, accountId, rowsWithoutAccountId) {
  const sheet=book.getSheetByName(sheetName); if(!sheet) throw new Error('Sheet tidak ditemukan: '+sheetName);
  const width=sheet.getLastColumn();
  const existing=sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,width).getValues():[];
  const retained=existing.filter(r=>Number(r[0])!==Number(accountId));
  const newRows=(rowsWithoutAccountId||[]).map(r=>[Number(accountId),...normalizeRow_(r,width-1)]);
  const all=retained.concat(newRows);
  if(sheet.getLastRow()>1) sheet.getRange(2,1,sheet.getLastRow()-1,width).clearContent();
  if(all.length) sheet.getRange(2,1,all.length,width).setValues(all);
}
function normalizeRow_(row, targetWidth) {
  const a=Array.isArray(row)?row.slice(0,targetWidth):[];
  while(a.length<targetWidth)a.push('');
  return a.map(v=>v===undefined||v===null?'':v);
}

function openOrCreateBook_(propertyName, title) {
  const id=CS_PROP.getProperty(propertyName);
  if(id){try{return SpreadsheetApp.openById(id);}catch(e){console.warn('Spreadsheet ID stored but not accessible; recreating '+title);}}
  const book=SpreadsheetApp.create(title);
  CS_PROP.setProperty(propertyName,book.getId());
  return book;
}
function openBookByProp_(propertyName) {
  const id=CS_PROP.getProperty(propertyName); if(!id) throw new Error('Database belum dibuat. Jalankan setupCatatSaham() terlebih dahulu.');
  return SpreadsheetApp.openById(id);
}
function ensureSheet_(book, name, headers) {
  let sheet=book.getSheetByName(name);
  if(!sheet) {
    const first=book.getSheets().length===1 && book.getSheets()[0].getName()==='Sheet1' ? book.getSheets()[0] : null;
    if(first){first.setName(name);sheet=first;} else sheet=book.insertSheet(name);
  }
  if(sheet.getLastRow()===0 || String(sheet.getRange(1,1).getValue())!==String(headers[0])) sheet.getRange(1,1,1,headers.length).setValues([headers]);
  if(sheet.getLastColumn()<headers.length) sheet.insertColumnsAfter(Math.max(1,sheet.getLastColumn()),headers.length-sheet.getLastColumn());
  sheet.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#14293d').setFontColor('#ffffff').setWrap(true);
  sheet.setFrozenRows(1);
  if(!sheet.getFilter() && sheet.getLastRow()>1){try{sheet.getRange(1,1,sheet.getLastRow(),headers.length).createFilter();}catch(e){}}
  sheet.setRowHeight(1,30);
  return sheet;
}
function seedSharedMasters_(book) {
  const securitiesHeaders=CS_TABLES.MasterSekuritas;
  const secSheet=ensureSheet_(book,'MasterSekuritas',securitiesHeaders);
  if(secSheet.getLastRow()<2) {
    const rows=CS_SECURITIES.map((s,i)=>[1,i+1,s[0],s[1],s[2],s[3],'','',s[3]==='MANUAL'?'Tarif diisi manual; verifikasi sesuai trade confirmation.':'Tarif awal indikatif; verifikasi ke broker.','AKTIF',i+1]);
    secSheet.getRange(2,1,rows.length,rows[0].length).setValues(rows);
  }
  const modelSheet=ensureSheet_(book,'MasterModelTrading',CS_TABLES.MasterModelTrading);
  if(modelSheet.getLastRow()<2) modelSheet.getRange(2,1,CS_MODELS.length,5).setValues(CS_MODELS);
  const stockSheet=ensureSheet_(book,'MasterEmiten',CS_TABLES.MasterEmiten);
  if(stockSheet.getLastRow()<2) {
    const sectors=['Energi','Keuangan','Barang Konsumen Primer','Barang Konsumen Non-Primer','Infrastruktur','Kesehatan','Industri','Properti','Teknologi','Transportasi'];
    const rows=CS_STOCKS.map((s,i)=>[i+1,s.ticker,s.name,'IDX:'+s.ticker,'', '', '', 'GOOGLEFINANCE / DEMO','PERLU_VERIFIKASI',sectors[i%sectors.length],'https://www.idx.co.id/id/perusahaan-tercatat/profil-perusahaan-tercatat','Harga GOOGLEFINANCE bila tersedia; fallback adalah data demo untuk pengujian.',Number(s.demoPrice)||'']);
    stockSheet.getRange(2,1,rows.length,rows[0].length).setValues(rows);
    // Formula prices are optional; the app falls back to clearly labelled synthetic sample prices when unavailable.
    const formulas=CS_STOCKS.map((s,i)=>['=IFERROR(GOOGLEFINANCE(D'+(i+2)+',"price"),"")']);
    stockSheet.getRange(2,5,formulas.length,1).setFormulas(formulas);
    stockSheet.getRange(2,5,formulas.length,1).setNumberFormat('#,##0.00');
    stockSheet.getRange(2,13,rows.length,1).setNumberFormat('#,##0.00');
  }
}
function seedAccounts_(book) {
  const sheet=ensureSheet_(book,'Akun',['AccountID','Username','PasswordHash','PasswordSalt','Role','Status','TanggalDibuat','TerakhirLogin','Catatan']);
  if(sheet.getLastRow()>=2) return;
  const rows=[];
  rows.push(makeAccountRow_(1,CS.DEMO_ADMIN,CS.DEMO_PASSWORD,'ADMIN','AKTIF','Akun awal; segera ganti password setelah login pertama.'));
  rows.push(makeAccountRow_(2,CS.DEMO_USER,CS.DEMO_USER_PASSWORD,'USER','AKTIF','Akun demo terpisah; data trading terisolasi.'));
  rows.push(makeAccountRow_(3,'trader02',CS.DEMO_USER_PASSWORD,'USER','NONAKTIF','Akun nonaktif contoh untuk pengujian status.'));
  sheet.getRange(2,1,rows.length,rows[0].length).setValues(rows);
}
function makeAccountRow_(id,username,password,role,status,note) {
  const salt=Utilities.getUuid()+Utilities.getUuid();
  return [id,username,hashPassword_(password,salt),salt,role,status,new Date(),'','Password disimpan dalam bentuk hash. '+note];
}
function findAccountByUsername_(book, username) {
  const sheet=book.getSheetByName('Akun'); if(!sheet||sheet.getLastRow()<2)return null;
  const rows=sheet.getRange(2,1,sheet.getLastRow()-1,9).getValues();
  for(let i=0;i<rows.length;i++)if(String(rows[i][1]).toLowerCase()===String(username).toLowerCase())return {AccountID:rows[i][0],Username:rows[i][1],PasswordHash:rows[i][2],PasswordSalt:rows[i][3],Role:rows[i][4],Status:rows[i][5],TanggalDibuat:rows[i][6],TerakhirLogin:rows[i][7],Catatan:rows[i][8],_row:i+2};
  return null;
}
function touchLastLogin_(book, accountId) {
  const s=book.getSheetByName('Akun'); if(s.getLastRow()<2)return;
  const ids=s.getRange(2,1,s.getLastRow()-1,1).getValues();
  for(let i=0;i<ids.length;i++)if(Number(ids[i][0])===Number(accountId)){s.getRange(i+2,8).setValue(new Date());return;}
}
function hashPassword_(password,salt) {
  const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(salt)+':'+String(password), Utilities.Charset.UTF_8);
  return Utilities.base64Encode(bytes);
}
function verifyPassword_(password,salt,hash) { return !!salt && !!hash && hashPassword_(password,salt)===String(hash); }
function ensureApiKey_() {
  let key=CS_PROP.getProperty(CS.API_KEY);
  if(!key){key=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');CS_PROP.setProperty(CS.API_KEY,key);}
  return key;
}
function readStocks_(book) {
  const sh=book.getSheetByName('MasterEmiten'); if(!sh||sh.getLastRow()<2)return [];
  const rows=sh.getRange(2,1,sh.getLastRow()-1,13).getValues();
  return rows.filter(r=>r[1]).map(r=>{
    const live=Number(r[4])||0, fallback=Number(r[12])||0;
    return {id:Number(r[0])||0,ticker:String(r[1]),name:String(r[2]),googleTicker:String(r[3]||('IDX:'+r[1])),demoPrice:live||fallback,priceStatus:live?'GOOGLEFINANCE':'DEMO',listingStatus:String(r[8]||'PERLU_VERIFIKASI'),sector:String(r[9]||''),sourceUrl:String(r[10]||''),isDemo:!live};
  });
}
function defaultSecurities_() { return CS_SECURITIES.map((s,i)=>({id:i+1,name:s[0],buyFeePct:s[1],sellFeePct:s[2],feeSourceStatus:s[3],sourceUrl:'',verifiedAt:'',feeNote:'Tarif awal indikatif; cocokkan dengan trade confirmation.',active:true})); }
function blankState_() { return {version:4,counters:{planningId:0,tradingSayaId:0,planningRowId:0,tradingSayaRowId:0,transactionId:0,dividendId:0},securities:defaultSecurities_(),tradingPlans:[],tradingSaya:[],dividends:[]}; }
function buildDemoState_() {
  const securities=defaultSecurities_();
  return {
    version:4,counters:{planningId:2,tradingSayaId:5,planningRowId:3,tradingSayaRowId:10,transactionId:12,userId:3,dividendId:2,emitenId:CS_STOCKS.length},securities:securities,
    tradingPlans:[
      {id:1,ticker:'AVIA',capital:10000000,model:'Swing Trading',modelOther:'',security:'',securityOther:'',notes:'Akumulasi bertahap pada area support.',archived:false,createdAt:'2026-10-04',updatedAt:'2026-10-12',rows:[{rowId:1,date:'2026-10-06',price:'353',lot:'30',sellDate:'',sell:'',sellLot:'',fee:'',buyTransactionId:null,sellTransactionId:null},{rowId:2,date:'2026-10-09',price:'350',lot:'20',sellDate:'',sell:'',sellLot:'',fee:'',buyTransactionId:null,sellTransactionId:null}]},
      {id:2,ticker:'ASII',capital:15000000,model:'Position Trading',modelOther:'',security:'',securityOther:'',notes:'Rencana bertahap untuk horizon menengah.',archived:false,createdAt:'2026-10-02',updatedAt:'2026-10-11',rows:[{rowId:3,date:'2026-10-03',price:'5050',lot:'15',sellDate:'',sell:'',sellLot:'',fee:'',buyTransactionId:null,sellTransactionId:null}]}
    ],
    tradingSaya:[
      {id:1,ticker:'BBCA',capital:10000000,model:'Swing Trading',modelOther:'',security:'Stockbit',securityOther:'',notes:'Contoh posisi parsial; satu lot sudah direalisasi.',archived:false,createdAt:'2026-09-22',updatedAt:'2026-10-10',rows:[{rowId:1,date:'2026-09-23',price:'9000',lot:'2',sellDate:'2026-09-26',sell:'9500',sellLot:'1',fee:'',buyTransactionId:1,sellTransactionId:2},{rowId:2,date:'2026-10-01',price:'8950',lot:'1',sellDate:'',sell:'',sellLot:'',fee:'',buyTransactionId:3,sellTransactionId:null}]},
      {id:2,ticker:'ANTM',capital:20000000,model:'Day Trading',modelOther:'',security:'Ajaib',securityOther:'',notes:'Contoh posisi selesai dengan dua tahap jual.',archived:false,createdAt:'2026-09-05',updatedAt:'2026-09-08',rows:[{rowId:3,date:'2026-09-05',price:'1400',lot:'100',sellDate:'',sell:'',sellLot:'',fee:'',buyTransactionId:4,sellTransactionId:null},{rowId:4,date:'',price:'',lot:'',sellDate:'2026-09-06',sell:'1500',sellLot:'50',fee:'',buyTransactionId:null,sellTransactionId:5},{rowId:5,date:'',price:'',lot:'',sellDate:'2026-09-08',sell:'1300',sellLot:'50',fee:'',buyTransactionId:null,sellTransactionId:6}]},
      {id:3,ticker:'TLKM',capital:12000000,model:'Scalping',modelOther:'',security:'BCA Sekuritas',securityOther:'',notes:'Contoh posisi parsial.',archived:false,createdAt:'2026-10-08',updatedAt:'2026-10-14',rows:[{rowId:6,date:'2026-10-09',price:'3000',lot:'5',sellDate:'2026-10-10',sell:'3150',sellLot:'2',fee:'',buyTransactionId:7,sellTransactionId:8}]},
      {id:4,ticker:'BBRI',capital:10000000,model:'Swing Trading',modelOther:'',security:'IPOT',securityOther:'',notes:'Contoh transaksi selesai.',archived:false,createdAt:'2026-09-10',updatedAt:'2026-09-12',rows:[{rowId:7,date:'2026-09-10',price:'4200',lot:'10',sellDate:'',sell:'',sellLot:'',fee:'',buyTransactionId:9,sellTransactionId:null},{rowId:8,date:'',price:'',lot:'',sellDate:'2026-09-12',sell:'4210',sellLot:'10',fee:'',buyTransactionId:null,sellTransactionId:10}]},
      {id:5,ticker:'ICBP',capital:15000000,model:'Position Trading',modelOther:'',security:'MOST (Mandiri Sekuritas)',securityOther:'',notes:'Contoh riwayat yang diarsipkan.',archived:true,createdAt:'2026-08-02',updatedAt:'2026-08-15',rows:[{rowId:9,date:'2026-08-03',price:'10800',lot:'3',sellDate:'',sell:'',sellLot:'',fee:'',buyTransactionId:11,sellTransactionId:null},{rowId:10,date:'',price:'',lot:'',sellDate:'2026-08-15',sell:'11200',sellLot:'3',fee:'',buyTransactionId:null,sellTransactionId:12}]}
    ],
    dividends:[{id:1,ticker:'BBCA',date:'2026-06-10',gross:25000,withholding:2500,net:22500,notes:'Contoh dividen tunai'},{id:2,ticker:'BBRI',date:'2026-08-20',gross:40000,withholding:4000,net:36000,notes:'Contoh pencatatan dividen'}]
  };
}
function seedPhysicalDemoData_(book, accountId) {
  // Populate the normalized sheets at setup time. The first successful app login refreshes these rows from the complete calculated state.
  const planRows=[
    [1,'AVIA',10000000,'Swing Trading','','2026-10-04','2026-10-12','RENCANA','Akumulasi bertahap pada area support.', '', 'RENCANA'],
    [2,'ASII',15000000,'Position Trading','','2026-10-02','2026-10-11','RENCANA','Rencana bertahap untuk horizon menengah.','','RENCANA']
  ];
  replaceAccountRows_(book,'TradingPlan',accountId,planRows);
  replaceAccountRows_(book,'TradingPlanRows',accountId,[
    [1,1,1,'2026-10-06',353,30,1059000,0.15,1589,10.59,30,353,1059000, '', '', '', '', '', 0,0,0,1589,0,0,0,0,'',''],
    [2,1,2,'2026-10-09',350,20,700000,0.15,1050,7,50,351.8,1752590,'','','','','',0,0,0,1050,0,0,0,0,'',''],
    [3,2,1,'2026-10-03',5050,15,7575000,0.15,11363,50.5,15,5050,7586363,'','','','','',0,0,0,11363,0,0,0,0,'','']
  ]);
  replaceAccountRows_(book,'TradingSaya',accountId,[
    [1,'BBCA',10000000,'Swing Trading','',1,'Stockbit','','2026-09-22','2026-10-10','AKTIF','AKTIF','', 'Contoh posisi parsial; satu lot sudah direalisasi.'],
    [2,'ANTM',20000000,'Day Trading','',3,'Ajaib','','2026-09-05','2026-09-08','SELESAI','AKTIF','', 'Contoh posisi selesai dengan dua tahap jual.'],
    [3,'TLKM',12000000,'Scalping','',4,'BCA Sekuritas','','2026-10-08','2026-10-14','AKTIF','AKTIF','', 'Contoh posisi parsial.'],
    [4,'BBRI',10000000,'Swing Trading','',5,'IPOT','','2026-09-10','2026-09-12','SELESAI','AKTIF','', 'Contoh transaksi selesai.'],
    [5,'ICBP',15000000,'Position Trading','',6,'MOST (Mandiri Sekuritas)','','2026-08-02','2026-08-15','SELESAI','ARSIP','', 'Contoh riwayat yang diarsipkan.']
  ]);
  replaceAccountRows_(book,'TradingSayaRows',accountId,[
    [1,1,1,'2026-09-23',9000,2,1800000,0.15,2700,18,2,9000,1802700,1,'2026-09-26',9500,1,950000,0.25,2375,50000,1350,47650,2.64,902700,1,2,'',''],
    [2,1,2,'2026-10-01',8950,1,895000,0.15,1343,8.95,2,8983.33,2691043,3,'','','','',0.25,0,0,0,0,0,2691043,2,'','',''],
    [3,2,1,'2026-09-05',1400,100,14000000,0.15,21000,70,100,1400,14021000,4,'','', '', '',0.25,0,0,0,0,0,14021000,100,'','',''],
    [4,2,2,'', '', '', '',0.15,0,0,100,1400,14021000,'','2026-09-06',1500,50,7500000,0.25,18750,500000,10500,470750,2.0,7010500,50,5,'',''],
    [5,2,3,'', '', '', '',0.15,0,0,50,1400,7010500,'','2026-09-08',1300,50,6500000,0.25,16250,-500000,10500,-526750,-7.5,0,0,6,'','']
  ]);
  replaceAccountRows_(book,'JurnalTrading',accountId,[
    [1,1,1,'2026-09-23','BBCA','Stockbit','Swing Trading','BUY',9000,2,1800000,'','','',2700,'',2,'AKTIF'],
    [1,2,1,'2026-09-26','BBCA','Stockbit','Swing Trading','SELL',9500,1,950000,900000,50000,1350,2375,47650,1,'AKTIF'],
    [1,3,2,'2026-10-01','BBCA','Stockbit','Swing Trading','BUY',8950,1,895000,'','','',1343,'',2,'AKTIF'],
    [1,4,3,'2026-09-05','ANTM','Ajaib','Day Trading','BUY',1400,100,14000000,'','','',21000,'',100,'SELESAI'],
    [1,5,4,'2026-09-06','ANTM','Ajaib','Day Trading','SELL',1500,50,7500000,7000000,500000,10500,18750,470750,50,'SELESAI'],
    [1,6,5,'2026-09-08','ANTM','Ajaib','Day Trading','SELL',1300,50,6500000,7000000,-500000,10500,16250,-526750,0,'SELESAI']
  ]);
  replaceAccountRows_(book,'Dividen',accountId,[[1,'BBCA','2026-06-10',25000,2500,22500,'Contoh dividen tunai'],[2,'BBRI','2026-08-20',40000,4000,36000,'Contoh pencatatan dividen']]);
  replaceAccountRows_(book,'MasterSekuritas',accountId,CS_SECURITIES.map((s,i)=>[i+1,s[0],s[1],s[2],s[3],'','','Tarif awal indikatif; verifikasi ke broker.','AKTIF',i+1]));
  replaceAccountRows_(book,'TemplateImport',accountId,[]);
}
function seedGuides_(dataBook, accountBook) {
  const data=ensureSheet_(dataBook,'Panduan',['Topik','Keterangan']);
  if(data.getLastRow()<2)data.getRange(2,1,7,2).setValues([
    ['Tujuan','Database transaksi dan jurnal trading CatatSaham.'],['AppState','Snapshot state per akun; baris per AccountID.'],['TradingPlan','Rencana simulasi sebelum transaksi aktual.'],['TradingSaya','Catatan transaksi aktual; terisolasi per akun.'],['MasterEmiten','Daftar demo subset saham BEI; bukan daftar lengkap terverifikasi.'],['HargaSaatIni','Formula GOOGLEFINANCE bila tersedia; fallback berada pada HargaDemoFallback.'],['Data awal','Data pada baris transaksi awal adalah data DEMO untuk uji coba.']
  ]);
  const account=ensureSheet_(accountBook,'Panduan',['Topik','Keterangan']);
  if(account.getLastRow()<2)account.getRange(2,1,6,2).setValues([
    ['Akun','Username disimpan sebagai identitas; AccountID numerik.'],['PasswordHash','Password tidak disimpan dalam bentuk teks biasa.'],['PasswordSalt','Salt unik untuk setiap akun.'],['Login demo','demo_admin / CatatSaham@2026; segera ubah password.'],['Tambahkan akun','Tambahkan melalui Apps Script atau prosedur admin yang disediakan pada versi lanjutan; jangan menimpa kolom hash manual.'],['Status','Hanya akun dengan Status AKTIF yang dapat login.']
  ]);
}
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
