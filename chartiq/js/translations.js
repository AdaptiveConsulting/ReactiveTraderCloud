// Copyright 2014-2016 by ChartIQ, Inc.
//
// Requiring chartiq.js with Webpack or RequireJS will require this file
// automatically if it is present in the same folder.
//
// Note: since minifying this file would destroy the CIQ.I18N.hereDoc code comment,
// it is best to bundle this file separately. If using UglifyJS, you can
// specify this filename in the except array to exclude it from compression.

(function (definition) {
    "use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition(require("./chartiq"));
	} else if (typeof define === "function" && define.amd) {
		define(["chartiq"], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global,global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for translations.js.");
	}

})(function(_exports){
	var CIQ=_exports.CIQ;

	/**
	 * This maps country codes to the actual name of the language *in that language*. This can be used
	 * to drive UI, such as a language picker.
	 * @type {Object}
	 */
	CIQ.I18N.languages={
		"en":"English",
		"ar":"عربى",
		"fr":"Français",
		"de":"Deutsche",
		"hu":"Magyar",
		"it":"Italiano",
		"pt":"Português",
		"ru":"русский",
		"es":"Español",
		"zh":"中文",
		"ja":"日本語"
	};

	CIQ.I18N.csv=CIQ.I18N.hereDoc(function(){/*!en,ar,fr,de,hu,it,pt,ru,es,zh,ja
-DI,-DI,-DI,-DI,-DI,-DI,-DI,-DI,-DI,下降方向线,-DI
-VI,-VI,-VI,-VI,-VI,-VI,-VI,-VI,-VI,负成交量指标,-VI
(Scroll for more options),(انتقل لمزيدٍ من الخيارات),(Faites défiler pour plus d'options),(Für weitere Optionen scrollen),(További lehetőségeket a legördülő listában talál),(Scroll for more options),(Desloque para mais opções),(Прокрутить для выбора других вариантов),(Desplazar para más opciones),（滚动查看更多选项）,（スクロールして他のオプションを表示）
(UTC-01:00) Azores,(UTC-01: 00) أزوريس,(UTC-01: 00) Açores,(UTC-01:00) Azores,(UTC-01:00) Azori-szigetek,(UTC-01:00) Azzorre,(UTC-01:00) Açores,(UTC-01:00) Азорские острова,(UTC-01:00) Azores,（国际协调时间-01:00）亚速尔群岛,(UTC-01:00) アゾレス諸島
(UTC-01:00) Cape Verde Islands,(UTC-01: 00) جزر الرأس الأخضر,(UTC-01: 00) Le Cap-Vert,(UTC-01:00) Kap Verde Islands,(UTC-01:00) Zöld-foki szigetek,(UTC-01:00) Isole di Capo Verde,(UTC-01:00) Ilhas de Cabo Verde,(UTC-01:00) Кабо-Верде,(UTC-01:00) Islas de Cabo Verde,（国际协调时间-01:00）佛得角群岛,(UTC-01:00) カポヴェルデ諸島
(UTC-02:00) Mid-Atlantic,(UTC-02: 00) الأطلسي الأوسط,(UTC-02: 00) Heure du  Mid Atlantique,(UTC-02:00) Mid-Atlantic,(UTC-02:00) Közép-atlanti,(UTC-02:00) ora del medio Atlantico,(UTC-02:00) Médio-Atlântico,(UTC-02:00) Центральноатлантическое время,(UTC-02:00) Atlántico medio,（国际协调时间-02:00）大西洋中部,(UTC-02:00) 中部大西洋
(UTC-03:00) Buenos Aires,(UTC-03: 00) بوينس آيرس,(UTC-03: 00) Buenos Aires,(UTC-03:00) Buenos Aires,(UTC-03:00) Buenos Aires,(UTC-03:00) Buenos Aires,(UTC-03:00) Buenos Aires,(UTC-03:00) Буэнос-Айрес,(UTC-03:00) Buenos Aires,（国际协调时间-03:00）布宜诺斯艾利斯,(UTC-03:00) ブエノスアイレス
(UTC-03:00) Montevideo,(UTC-03: 00) مونتيفيديو,(UTC-03: 00) Montevideo,(UTC-03:00) Montevideo,(UTC-03:00) Montevideo,(UTC-03:00) Montevideo,(UTC-03:00) Montevidéu,(UTC-03:00) Монтевидео,(UTC-03:00) Montevideo,（国际协调时间-03:00）蒙得维的亚,(UTC-03:00) モンテビデオ
(UTC-03:00) Punta Arenas,(UTC-03: 00) بونتا أريناس,(UTC-03: 00) Punta Arenas,(UTC-03:00) Punta Arenas,(UTC-03:00) Punta Arenas,(UTC-03:00) Punta Arenas,(UTC-03:00) Punta Arenas,(UTC-03:00) Пунта-Аренас,(UTC-03:00) Punta Arenas,（国际协调时间-03:00）蓬塔阿雷纳斯,(UTC-03:00) プンタ・アレーナス
(UTC-03:00) Sao Paulo,(UTC-03: 00) ساو باولو,(UTC-03: 00) San Paolo,(UTC-03:00) Sao Paulo,(UTC-03:00) Sao Paulo,(UTC-03:00) San Paolo,(UTC-03:00) São Paulo,(UTC-03:00) Сан-Паулу,(UTC-03:00) Sao Paulo,（国际协调时间-03:00）圣保罗,(UTC-03:00) サンパウロ
(UTC-03:30) Newfoundland and Labrador,(UTC-03: 30) نيوفاوندلاند ولابرادور,(UTC-03: 30) Terre-Neuve-et-Labrador,(UTC-03:30) Neufundland und Labrador,(UTC-03:30) Új-Foundland és Labrador,(UTC-03:30) Terranova e Labrador,(UTC-03:30) Newfoundland e Labrador,(UTC-03:30) Ньюфаундленд и Лабрадор,(UTC-03:30) Península de Terranova y Labrador,（国际协调时间-03:30）纽芬兰和拉布拉多,(UTC-03:30) ニューファウンドランドとラブラドール
(UTC-04:00) Asuncion,(UTC-04: 00) أسونسيون,(UTC-04: 00) Asuncion,(UTC-04:00) Asuncion,(UTC-04:00) Asuncion,(UTC-04:00) Asuncion,(UTC-04:00) Assunção,(UTC-04:00) Асунсьон,(UTC-04:00) Asunción,（国际协调时间-04:00）亚松森,(UTC-04:00) アスンシオン
(UTC-04:00) Atlantic Time (Canada),(UTC-04: 00) توقيت الأطلسي (كندا),(UTC-04: 00) Heure de l'Atlantique (Canada),(UTC-04:00) Atlantic Time (Kanada),(UTC-04:00) Atlanti idő (Kanada),(UTC-04:00) ora dell'Atlantico (Canada),(UTC-04:00) Hora do Atlântico (Canadá),(UTC-04:00) Атлантическое время (Канада),(UTC-04:00) Horario atlántico (Canadá),（国际协调时间-04:00）大西洋时间（加拿大）,(UTC-04:00) 大西洋標準時（カナダ）
(UTC-04:00) Caracas,(UTC-04: 00) كراكاس,(UTC-04: 00) Caracas,(UTC-04:00) Caracas,(UTC-04:00) Caracas,(UTC-04:00) Caracas,(UTC-04:00) Caracas,(UTC-04:00) Каракас,(UTC-04:00) Caracas,（国际协调时间-04:00）加拉加斯,(UTC-04:00) カラカス
"(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",(UTC-04: 00) جورج تاون، لاباز، ماناوس، سان خوان,"(UTC-04: 00) Georgetown, La Paz, Manaus, San Juan","(UTC-04:00) Georgetown, La Paz, Manaus, San Juan","(UTC-04:00) Georgetown, La Paz, Manaus, San Juan","(UTC-04:00) Georgetown, La Paz, Manaus, San Juan","(UTC-04:00) Georgetown, La Paz, Manaus, San Juan","(UTC-04:00) Джорджтаун, Ла-Пас, Манаус, Сан-Хуан","(UTC-04:00) Georgetown, La Paz, Manaos, San Juan",（国际协调时间-04:00）乔治城、拉巴斯、马努斯、圣胡安,(UTC-04:00) ジョージタウン、ラパス、マナウス、サンフアン
(UTC-04:00) Santiago,(UTC-04: 00) سانتياغو,(UTC-04: 00) Santiago,(UTC-04:00) Santiago,(UTC-04:00) Santiago,(UTC-04:00) Santiago,(UTC-04:00) Santiago,(UTC-04:00) Сантьяго,(UTC-04:00) Santiago,（国际协调时间-04:00）圣地亚哥,(UTC-04:00) サンチアゴ
"(UTC-05:00) Bogota, Lima, Quito, Rio Branco",(UTC-05: 00) بوغوتا، ليما، كيتو، ريو برانكو,"(UTC-05: 00) Bogota, Lima, Quito, Rio Branco","(UTC-05:00) Bogota, Lima, Quito, Rio Branco","(UTC-05:00) Bogota, Lima, Quito, Rio Branco","(UTC-05:00) Bogotà, Lima, Quito, Rio Branco","(UTC-05:00) Bogotá, Lima, Quito, Rio Branco","(UTC-05:00) Богота, Лима, Кито, Рио-Бланко","(UTC-05:00) Bogotá, Lima, Quito, Rio Branco",（国际协调时间-05:00）波哥大、利马、基多、里约布兰科,(UTC-05:00) ボゴタ、リマ、キート、リオ・ブランコ
(UTC-05:00) Eastern Time (US and Canada),(UTC-05: 00) التوقيت الشرقي (الولايات المتحدة وكندا),(UTC-05:00) L'Heure de l'Est (Stati Uniti e Canada),(UTC-05:00) Eastern Time (USA und Kanada),(UTC-05:00) Keleti parti idő (USA és Kanada),(UTC-05:00) ora della costa orientae (Stati Uniti e Canada),(UTC-05:00) Hora de Leste (EUA e Canadá),(UTC-05:00) Восточное время (США и Канада),(UTC-05:00) Horario del este (EE.UU. Y Canadá)Eastern Time (US and Canada),（国际协调时间-05:00）东部时间（美国和加拿大）,(UTC-05:00) 東部標準時（アメリカおよびカナダ）
(UTC-05:00) Indiana (East),(UTC-05: 00) إإنديانا (شرق),(UTC-05: 00) Indiana (Est),(UTC-05:00) Indiana (East),(UTC-05:00) Indiana (Kelet),(UTC-05:00) Indiana (orientale),(UTC-05:00) Indiana (Leste),(UTC-05:00) Индиана,(UTC-05:00) Indiana (Este),（国际协调时间-05:00）印第安纳（东部）,(UTC-05:00) インディアナ（東）
(UTC-06:00) Central America,(UTC-06: 00) أمريكا الوسطى,(UTC-06: 00) Amérique Centrale,(UTC-06:00) Zentralamerika,(UTC-06:00) Közép-Amerika,(UTC-06:00) America centrale,(UTC-06:00) América Central,(UTC-06:00) Центральная Америка,(UTC-06:00) América central,（国际协调时间-06:00）中美洲,(UTC-06:00) 中央アメリカ
(UTC-06:00) Central Time (US and Canada),(UTC-06: 00) التوقيت المركزي (الولايات المتحدة وكندا),(UTC-06: 00) Central (États-Unis et Canada),(UTC-06:00) Central Time (USA und Kanda),(UTC-06:00) Középidő (USA és Kanada),(UTC-06:00) ora centrale (Stati Uniti e Canada),(UTC-06:00) Hora Central (EUA e Canadá),(UTC-06:00) Центральное время (США и Канада),(UTC-06:00) Horario central (EE.UU. Y Canadá),（国际协调时间-06:00）中央标准时间（美国和加拿大）,(UTC-06:00) 中部標準時（アメリカおよびカナダ）
"(UTC-06:00) Guadalajara, Mexico City, Monterrey",(UTC-06: 00) غوادالاخارا، مكسيكو سيتي، مونتيري,"(UTC-06: 00) Guadalajara, Mexico, Monterrey","(UTC-06:00) Guadalajara, Mexiko Stadt, Monterrey","(UTC-06:00) Guadalajara, Mexikóváros, Monterrey","(UTC-06:00) Guadalajara, Città del Messico, Monterrey","(UTC-06:00) Guadalajara, Cidade do México, Monterrey","(UTC-06:00) Гуадалахара, Мехико, Монтеррей","(UTC-06:00) Guadalajara, Ciudad de México, Monterrey",（国际协调时间-06:00）瓜达拉哈拉、墨西哥城、蒙特雷,(UTC-06:00) グアダラハラ、メキシコシティー、モンテレイ
(UTC-06:00) Saskatchewan,(UTC-06: 00) ساسكاتشيوان,(UTC-06: 00) Saskatchewan,(UTC-06:00) Saskatchewan,(UTC-06:00) Saskatchewan,(UTC-06:00) Saskatchewan,(UTC-06:00) Saskatchewan,(UTC-06:00) Саскачеван,(UTC-06:00) Saskatchewan,（国际协调时间-06:00）萨斯喀彻温,(UTC-06:00) サスカチュワン州
(UTC-07:00) Arizona,(UTC-07: 00) أريزونا,(UTC-07: 00) Arizona,(UTC-07:00) Arizona,(UTC-07:00) Arizona,(UTC-07:00) Arizona,(UTC-07:00) Arizona,(UTC-07:00) Аризона,(UTC-07:00) Arizona,（国际协调时间-07:00）亚利桑那,(UTC-07:00) アリゾナ
"(UTC-07:00) Chihuahua, Mazatlan",(UTC-07: 00) تشيهواهوا، مازاتلان,"(UTC-07: 00) Chihuahua, Mazatlan","(UTC-07:00) Chihuahua, Mazatlan","(UTC-07:00) Chihuahua, Mazatlan","(UTC-07:00) Chihuahua, Mazatlan","(UTC-07:00) Chihuahua, Mazatlan","(UTC-07:00) Чиуауа, Масатлан","(UTC-07:00) Chihuahua, Mazatlán",（国际协调时间-07:00）奇瓦瓦、马萨特兰,"(UTC-07:00) チワワ, マサトラン"
(UTC-07:00) Mountain Time (US and Canada),(UTC-07: 00) التوقيت الجبلي (الولايات المتحدة وكندا),(UTC-07: 00) L'heure des Rocheuses (États-Unis et Canada),(UTC-07:00) Mountain Time (USA und Kanada),(UTC-07:00) Helyvidéki idő (USA és Kanada),(UTC-07:00) ora delle Montage Rocciose (Stati Uniti e Canada),(UTC-07:00) Hora de Mountain (EUA e Canadá),(UTC-07:00) Зимнее время (США и Канада),(UTC-07:00) Horario montañés (EE.UU. Y Canadá),（国际协调时间-07:00）山地标准时间（美国和加拿大）,(UTC-07:00) 山地標準時（アメリカおよびカナダ）
(UTC-08:00) Pacific Time (US and Canada),(UTC-08: 00) توقيت المحيط الهادي (الولايات المتحدة وكندا),(UTC-08: 00) Heure normale du Pacifique (Etats-Unis et Canada),(UTC-08:00) Pazifik Zeit (USA und Kanada),(UTC-08:00) Csendes-óceáni idő (USA és Kanada),(UTC-08:00) ora del Pacifico (Stati Uniti e Canada),(UTC-08:00) Horário do Pacífico (EUA e Canadá),(UTC-08:00) Тихоокеанское время (США и Канада),(UTC-08:00) Hora del pacífico (EE.UU. Y Canadá),（国际协调时间-08:00）太平洋时间（美国和加拿大）,(UTC-08:00) 太平洋標準時（アメリカおよびカナダ）
(UTC-08:00) Tijuana,(UTC-08: 00) تيخوانا,(UTC-08: 00) Tijuana,(UTC-08:00) Tijuana,(UTC-08:00) Tijuana,(UTC-08:00) Tijuana,(UTC-08:00) Tijuana,(UTC-08:00) Тихуана,(UTC-08:00) Tijuana,（国际协调时间-08:00）提华纳,(UTC-08:00) ティファナ
(UTC-09:00) Alaska,(UTC-09: 00) ألاسكا,(UTC-09: 00) Alaska,(UTC-09:00) Alaska,(UTC-09:00) Alaszka,(UTC-09:00) Alaska,(UTC-09:00) Alaska,(UTC-09:00) Аляска,(UTC-09:00) Alaska,（国际协调时间-09:00）阿拉斯加,(UTC-09:00) アラスカ
(UTC-10:00) Hawaii,(UTC-10: 00) هاواي,(UTC-10: 00) Hawaii,(UTC-10:00) Hawaii,(UTC-10:00) Hawaii,(UTC-10:00) Hawaii,(UTC-10:00) Hawaii,(UTC-10:00) Гавайи,(UTC-10:00) Hawái,（国际协调时间-10:00）夏威夷,(UTC-10:00) ハワイ
"(UTC-11:00) American Samoa, Midway Island",(UTC-11: 00) ساموا الأمريكية، جزيرة ميدواي,"(UTC-11: 00) Samoa américaines, l'île de Midway","(UTC-11:00) Amerikanisch-Samoa, Midway Inseln","(UTC-11:00) Amerikai Szamoa, Midway-sziget","(UTC-11:00) Samoa americane, Isola di Midway","(UTC-11:00) Samoa Americana, Ilha Midway","(UTC-11:00) Американское Самоа, острова Мидуэй","(UTC-11:00) Samoa americana, Islas Midway",（国际协调时间-11:00）美属萨摩亚、中途岛,"(UTC-11:00) アメリカ領サモア, ミッドウェー諸島"
(UTC) Casablanca,(UTC) الدار البيضاء,(UTC) Casablanca,(UTC) Casablanca,(UTC) Casablanca,(UTC) Casablanca,(UTC) Casablanca,(UTC) Касабланка,(UTC) Casablanca,（国际协调时间）卡萨布兰卡,(UTC) カサブランカ
(UTC) Dublin,(UTC) دوبلين,(UTC) Dublin,(UTC) Dublin,(UTC) Dublin,(UTC) Dublino,(UTC) Dublin,(UTC) Дублин,(UTC) Dublín,（国际协调时间）都柏林,(UTC) ダブリン
"(UTC) Lisbon, London",(UTC) ليزبون، لندن,"(UTC) Lisbonne, Londres","(UTC) Lissabon, London","(UTC) Lisszabon, London","(UTC) Lisbona, Londra","(UTC) Lisboa, Londres","(UTC) Лиссабон, Лондон","(UTC) Lisboa, Londres",（国际协调时间）里斯本、伦敦,(UTC) リスボン、ロンドン
"(UTC) Greenwich Mean Time, Reykjavik",(UTC) توقيت غرينتش، ريكيافيك,"(UTC) GMT, Reykjavik","(UTC) Greenwich Mean Time, Reykjavik","(UTC) Greenwich-i középidő, Reykjavík","(UTC) ora di Greenwich, Reykjavik","(UTC) Hora média de Greenwich, Reykjavik","(UTC) Гринвич, Рейкьявик","(UTC) Huso horario principal de Greenwich, Reikiavik",（国际协调时间）格林威治标准时间、雷克雅未克,(UTC) グリニッジ標準時、レイキャビク
"(UTC+01:00) Algiers, Tunis",(UTC + 01: 00) الجزائر، تونس,"(GMT + 01: 00) Alger, Tunis","(UTC+01:00) Algerien, Tunesien","(UTC+01:00) Algír, Tunisz","(UTC+01:00) Algeri, Tunisi","(UTC + 01:00) Argel, Tunis","(UTC+01:00) Алжир, Тунис","(UTC+01:00) Argel, Túnez",（国际协调时间+01:00）阿尔及尔、突尼斯,(UTC+01:00) アルジェ、チュニス
"(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",(UTC + 01: 00) أمستردام، برلين، برن، روما، ستوكهولم، فيينا,"(GMT + 01: 00) Amsterdam, Berlin, Berne, Rome, Stockholm, Vienne","(UTC+01:00) Amsterdam, Berlin, Bern, Rom, Stockholm, Wien","(UTC+01:00) Amszterdam, Berlin, Bern, Róma, Stockholm, Bécs","(UTC+01:00) Amsterdam, Berlino, Berna, Roma, Stoccolma, Vienna","(UTC + 01:00) Amsterdão, Berlim, Berna, Roma, Estocolmo, Viena","(UTC+01:00) Амстердам, Берлин, Берн, Рим, Стокгольм, Вена","(UTC+01:00) Ámsterdam, Berlín, Berna, Roma, Estocolmo, Viena",（国际协调时间+01:00）阿姆斯特丹、柏林、伯尔尼、罗马、斯德哥尔摩、维也纳,(UTC+01:00) アムステルダム、ベルリン、ベルン、ローマ、ストックホルム、ウィーン
"(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",(UTC + 01: 00) بلغراد، براتيسلافا، بودابست، ليوبليانا، براغ,"(GMT + 01: 00) Belgrade, Bratislava, Budapest, Ljubljana, Prague","(UTC+01:00) Belgrad, Bratislava, Budapest, Ljubljana, Prag","(UTC+01:00) Belgrád, Pozsony, Budapest, Ljubljana, Prága","(UTC+01:00) Belgrado, Bratislava, Budapest, Lubiana, Praga","(UTC + 01:00) Belgrado, Bratislava, Budapeste, Ljubljana, Praga","(UTC+01:00) Белград, Братислава, Будапешт, Любляна, Прага","(UTC+01:00) Belgrado, Bratislava, Budapest, e, Bratislava, Budapest, Liubliana, Praga",（国际协调时间+01:00）贝尔格莱德、伯拉第斯拉瓦、布达佩斯、卢布尔雅那、布拉格,(UTC+01:00) ベルグラード、ブラチスラバ、ブダペスト、リュブリャナ、プラハ
"(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",(UTC + 01: 00) بروكسل، كوبنهاغن، مدريد، باريس,"(GMT + 01: 00) Bruxelles, Copenhague, Madrid, Paris","(UTC+01:00) Brüssel, Kopenhagen, Madrid, Paris","(UTC+01:00) Brüsszel, Koppenhága, Madrid, Párizs","(UTC+01:00) Bruxelles, Copenhagen, Madrid, Parigi","(UTC + 01:00) Bruxelas, Copenhaga, Madrid, Paris","(UTC+01:00) Брюссель, Копенгаген, Мадрид, Париж","(UTC+01:00) Bruselas, Copenhague, Madrid, París",（国际协调时间+01:00）布鲁塞尔、哥本哈根、马德里、巴黎,(UTC+01:00) ブリュッセル、コペンハーゲン、マドリード、パリ
"(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",(UTC + 01: 00) سراييفو، سكوبيي، وارسو، زاغرب,"(GMT + 01: 00) Sarajevo Skopje Varsovie, Zagreb","(UTC+01:00) Sarajevo, Skopje, Warschau, Zagreb","(UTC+01:00) Szarajevó, Skopje, Varsó, Zágráb","(UTC+01:00) Sarajevo, Skopje, Varsavia, Zagabria","(UTC + 01:00) Sarajevo, Skopje, Varsóvia, Zagreb","(UTC+01:00) Сараево, Скопье, Варшава, Загреб","(UTC+01:00) Sarajevo, Skopie, Varsovia, Zagreb",（国际协调时间+01:00）萨拉热窝、斯科普里、华沙、萨格勒布,(UTC+01:00) サラエボ、スコピエ、ワルシャワ、ザグレブ
"(UTC+02:00) Athens, Bucharest",(UTC + 02: 00) أثينا، بوخارست,"(GMT + 02: 00) Athènes, Bucarest","(UTC+02:00) Athen, Bukarest","(UTC+02:00) Athén, Bukarest","(UTC+02:00) Atene, Bucharest","(UTC + 02:00) Atenas, Bucareste","(UTC+02:00) Афины, Бухарест","(UTC+02:00) Atenas, Bucarest",（国际协调时间+02:00）雅典、布加勒斯特,(UTC+02:00) アテネ、ブカレスト
(UTC+02:00) Cairo,(UTC + 02: 00) القاهرة,(GMT + 02: 00) Le Caire,(UTC+02:00) Kairo,(UTC+02:00) Kairó,(UTC+02:00) Il Cairo,(UTC + 02:00) Kaliningrado,(UTC+02:00) Каир,(UTC+02:00 ) El Cairo,（国际协调时间+02:00）开罗,(UTC+02:00) カイロ
(UTC+02:00) Cyprus,(UTC + 02: 00) قبرص,(GMT + 02: 00) Chypre,(UTC+02:00) Zypern,(UTC+02:00) Ciprus,(UTC+02:00) Cipro,(UTC + 02:00) Chipre,(UTC+02:00) Кипр,(UTC+02:00) Chipre,（国际协调时间+02:00）塞浦路斯,(UTC+02:00) キプロス
"(UTC+02:00) Harare, Johannesburg",(UTC + 02: 00) هراري، جوهانسبرغ,"(GMT + 02: 00) Harare, Johannesburg","(UTC+02:00) Harare, Johannesburg","(UTC+02:00) Harare, Johannesburg","(UTC+02:00) Harare, Johannesburg","(UTC + 02:00) Harare, Joanesburgo","(UTC+02:00) Хараре, Йоханнесбург","(UTC+02:00) Harare, Johannesburgo",（国际协调时间+02:00）哈拉雷、约翰尼斯堡,(UTC+02:00) ハラーレ、ヨハネスブルグ
"(UTC+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius",(UTC + 02: 00) هلسنكي، كييف، ريغا، صوفيا، تالين، فيلنيوس,"(GMT + 02: 00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius","(UTC+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius","(UTC+02:00) Helsinki, Kijev, Riga, Szófia, Tallinn, Vilnius","(UTC+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius","(UTC + 02:00) Helsínquia, Kiev, Riga, Sofia, Tallinn, Vilnius","(UTC+02:00) Хельсинки, Киев, Рига, София, Таллин, Вильнюс","(UTC+02:00) Helsinki, Kiev, Riga, Sofia, Tallin, Vilnius",（国际协调时间+02:00）赫尔辛基、基辅、里加、索非亚、塔林、维尔纽斯,(UTC+02:00) ヘルシンキ、キエフ、リガ、ソフィア、タリン、ビリニュス
(UTC+02:00) Jerusalem,(UTC + 02: 00) القدس,(GMT + 02: 00) Jérusalem,(UTC+02:00) Jerusalem,(UTC+02:00) Jeruzsálem,(UTC+02:00) Gerusalemme,(UTC+02:00) Jerusalém,(UTC+02:00) Иерусалим,(UTC+02:00) Jerusalén,（国际协调时间+02:00）耶路撒冷,(UTC+02:00) エルサレム
(UTC+02:00) Kaliningrad,(UTC + 02: 00) كالينينغراد,(GMT + 02: 00) Kaliningrad,(UTC+02:00) Kaliningrad,(UTC+02:00) Kalinyingrád,(UTC+02:00) Kaliningrad,(UTC + 02:00) Kaliningrado,(UTC+02:00) Калининград,(UTC+02:00) Kaliningrado,（国际协调时间+02:00）加里宁格勒,(UTC+02:00) カリーニングラード
"(UTC+03:00) Baghdad, Kuwait, Qatar, Riyadh",(UTC + 03: 00) بغداد، الكويت، قطر، الرياض,"(GMT + 03: 00) Bagdad, Koweït, Qatar, Riyadh","(UTC+03:00) Bagdad, Kuwait, Katar, Riyadh","(UTC+03:00) Bagdad, Kuvait, Katar, Rijád","(UTC+03:00) Baghdad, Kuwait, Qatar, Riyad","(UTC+03:00) Baghdad, Kuwait, Qatar, Riyadh","(UTC+03:00) Багдад, Кувейт, Катар, Эр-Рияд","(UTC+03:00) Bagdad, Kuwait, Qatar, Riyadh",（国际协调时间+03:00）巴格达、科威特、卡塔尔、利雅得,(UTC+03:00) バグダッド、クウェート、カタール、リヤド
(UTC+03:00) Istanbul,(UTC + 03: 00) اسطنبول,(GMT + 03: 00) Istanbul,(UTC+03:00) Istanbul,(UTC+03:00) Isztambul,(UTC+03:00) Istanbul,(UTC + 03:00) Istambul,(UTC+03:00) Стамбул,(UTC+03:00) Estambul,（国际协调时间+03:00）伊斯坦布尔,(UTC+03:00) イスタンブール
"(UTC+03:00) Minsk, Moscow, Kirov, Volgograd",(UTC + 03: 00) مينسك، موسكو، كيروف، فولغوغراد,"(GMT + 03: 00) Minsk Moscou, Kirov, Volgograd","(UTC+03:00) Minsk, Moskau, Kirov, Volgograd","(UTC+03:00) Minszk, Moszkva, Kirov, Volgográd","(UTC+03:00) Minsk, Mosca, Kirov, Volgograd","(UTC + 03:00) Minsk, Moscovo, Kirov, Volgogrado","(UTC+03:00) Минск, Москва, Киров, Волгоград","(UTC+03:00) Minsk, Moscú, Kírov, Volgogrado",（国际协调时间+03:00）明斯克、莫斯科、基洛夫、伏尔加格勒,(UTC+03:00) ミンスク、モスクワ、キーロフ、ボルゴグラード
(UTC+03:00) Nairobi,(UTC + 03: 00) نيروبي,(GMT + 03: 00) Nairobi,(UTC+03:00) Nairobi,(UTC+03:00) Nairobi,(UTC+03:00) Nairobi,(UTC+03:00) Nairobi,(UTC+03:00) Найроби,(UTC+03:00) Nairobi,（国际协调时间+03:00）内罗毕,(UTC+03:00) ナイロビ
(UTC+03:00) Simferopol,(UTC + 03: 00) سيمفيروبول,(GMT + 03: 00) Simferopol,(UTC+03:00) Simferopol,(UTC+03:00) Szimferopol,(UTC+03:00) Sinferopoli,(UTC+03:00) Simferopol,(UTC+03:00) Симферополь,(UTC+03:00) Simferópol,（国际协调时间+03:00）辛菲罗波尔,(UTC+03:00) シンフェロポリ
(UTC+03:30) Tehran,(UTC + 03: 30) طهران,(GMT + 03: 30) Téhéran,(UTC+03:30) Tehran,(UTC+03:30) Teherán,(UTC+03:30) Teheran,(UTC + 03:30) Teerão,(UTC+03:30) Тегеран,(UTC+03:30) Teherán,（国际协调时间+03:00）德黑兰,(UTC+03:30) テヘラン
"(UTC+04:00) Astrakhan, Samara, Saratov, Ulyanovsk",(UTC + 04: 00) أستراخان، سمارة، ساراتوف، أوليانوفسك,"(GMT + 04: 00) Astrakhan, Samara, Saratov, Oulianovsk","(UTC+04:00) Astrakhan, Samara, Saratov, Ulyanovsk","(UTC+04:00) Asztrahán, Szamara, Szaratov, Uljanovszk","(UTC+04:00) Astrakhan, Samara, Saratov, Ulyanovsk","(UTC+04:00) Astrakhan, Samara, Saratov, Ulyanovsk","(UTC+04:00) Астрахань, Самара, Саратов, Ульяновск","(UTC+04:00) Astracán, Samara, Sarátov, Uliánovsk",（国际协调时间+04:00）阿斯特拉罕、萨马拉、萨拉托夫、乌里扬诺夫斯克,(UTC+04:00) アストラカン、サマラ、サラトフ、ウリヤノフスク
(UTC+04:00) Baku,(UTC + 04: 00) باكو,(GMT + 04: 00) Baku,(UTC+04:00) Baku,(UTC+04:00) Baku,(UTC+04:00) Baku,(UTC + 04:00) Baku,(UTC+04:00) Баку,(UTC+04:00) Bakú,（国际协调时间+04:00）巴库,(UTC+04:00) バクー
"(UTC+04:00) Dubai, Muscat",(UTC + 04: 00) دبي، مسقط,"(GMT + 04: 00) Dubaï, Mascate","(UTC+04:00) Dubai, Muskat","(UTC+04:00) Dubaj, Maszkat","(UTC+04:00) Dubai, Mascate","(UTC + 04:00) Dubai, Muscat","(UTC+04:00) Дубай, Маскат","(UTC+04:00) Dubái, Muscat",（国际协调时间+04:00）迪拜、马斯喀特,(UTC+04:00) ドバイ、マスカット
(UTC+04:30) Kabul,(UTC + 04: 30) كابول,(GMT + 04: 30) Kaboul,(UTC+04:30) Kabul,(UTC+04:30) Kabul,(UTC+04:30) Kabul,(UTC+04:30) Kabul,(UTC+04:30) Кабул,(UTC+04:30) Kabul,（国际协调时间+04:30）喀布尔,(UTC+04:30) カブール
"(UTC+05:00) Karachi, Tashkent",(UTC + 05: 00) كراتشي، طشقند,"(GMT + 05: 00) Karachi, Tachkent","(UTC+05:00) Karachi, Tashkent","(UTC+05:00) Karacsi, Taskent","(UTC+05:00) Karachi, Tashkent","(UTC+05:00) Karachi, Tashkent","(UTC+05:00) Карачи, Ташкент","(UTC+05:00) Karachi, Taskent",（国际协调时间+05:00）卡拉奇、塔什干,(UTC+05:00) カラチ、タシュケント
(UTC+05:00) Yekaterinburg,(UTC + 05: 00) يكاترينبورغ,(GMT + 05: 00) Ekaterinburg,(UTC+05:00) Yekaterinburg,(UTC+05:00) Jekatyerinburg,(UTC+05:00) Yekaterinburg,(UTC+05:00) Yekaterinburg,(UTC+05:00) Екатеринбург,(UTC+05:00) Ekaterimburgo,（国际协调时间+05:00）叶卡捷琳堡,(UTC+05:00) エカテリンブルグ
"(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",(UTC + 05: 30) تشيناي، كولكاتا، مومباي، نيودلهي,"(GMT + 05: 30) Chennai, Kolkata, Mumbai, New Delhi","(UTC+05:30) Chennai, Kolkata, Mumbai, Neu-Dehli","(UTC+05:30) Csennai, Kalkutta, Mumbai, Új-Delhi","(UTC+05:30) Chennai, Calcutta, Bombay, Nuova Delhi","(UTC + 05:30) Chennai, Calcutá, Mumbai, Nova Deli","(UTC+05:30) Ченнай, Калькутта, Мумбаи, Нью-Дели","(UTC+05:30) Chennai, Kolkata, Bombay, Nueva Deli",（国际协调时间+05:30）金奈、加尔各答、孟买、新德里,(UTC+05:30) チェンマイ、コルカタ、ムンバイ、ニューデリー
(UTC+05:45) Kathmandu,(UTC + 05: 45) كاتماندو,(GMT + 05: 45) Katmandou,(UTC+05:45) Kathmandu,(UTC+05:45) Katmandu,(UTC+05:45) Kathmandu,(UTC+05:45) Kathmandu,(UTC+05:45) Катманду,(UTC+05:45) Katmandú,（国际协调时间+05:45）加德满都,(UTC+05:45) カトマンドゥ
(UTC+06:00) Almaty,(UTC + 06: 00) ألماتي,(GMT + 06: 00) Almaty,(UTC+06:00) Almaty,(UTC+06:00) Almati,(UTC+06:00) Almaty,(UTC+06:00) Almaty,(UTC+06:00) Алма-Аты,(UTC+06:00) Almaty,（国际协调时间+06:00）阿拉木图,(UTC+06:00) アルマトイ
"(UTC+06:00) Astana, Dhaka",(UTC + 06: 00) أستانا، داكا,"(UTC+06:00) Astana, Dacca","(UTC+06:00) Astana, Dhaka","(UTC+06:00) Asztana, Dakka","(UTC+06:00) Astana, Dacca","(UTC+06:00) Astana, Dhaka","(UTC+06:00) Астана, Дакка","(UTC+06:00) Astana, Daca",（国际协调时间+06:00）阿斯塔纳、达卡,(UTC+06:00) アスタナ、ダッカ
(UTC+06:00) Omsk,(UTC + 06: 00) أومسك,(GMT + 06: 00) Omsk,(UTC+06:00) Omsk,(UTC+06:00) Omszk,(UTC+06:00) Omsk,(UTC+06:00) Omsk,(UTC+06:00) Омск,(UTC+06:00) Omsk,（国际协调时间+06:00）鄂木斯克,(UTC+06:00) オムスク
(UTC+06:30) Yangon,(UTC + 06: 30) يانغون,(UTC+06:30) Yangon,(UTC+06:30) Yangon,(UTC+06:30) Jangon,(UTC+06:30) Yangon,(UTC+06:30) Yangon,(UTC+06:30) Янгон (Рангун),(UTC+06:30) Yangón,（国际协调时间+06:30）仰光,(UTC+06:30) ヤンゴン
"(UTC+07:00) Bangkok, Jakarta, Vietnam",(UTC + 07: 00) بانكوك، جاكرتا، فيتنام,"(UTC+07:00) Bangkok, Jakarta, Vietnam","(UTC+07:00) Bangkok, Jakarta, Vietnam","(UTC+07:00) Bangkok, Dzsakarta, Vietnam","(UTC+07:00) Bangkok, Jakarta, Vietnam","(UTC+07:00) Bangkok, Jacarta, Vietname","(UTC+07:00) Бангкок, Джакарта, Вьетнам","(UTC+07:00) Bangkok, Yakarta, Vietnam",（国际协调时间+07:00）曼谷、雅加达、越南,(UTC+07:00) バンコク、ジャカルタ、ベトナム
"(UTC+07:00) Barnaul, Novosibirsk, Tomsk",(UTC + 07: 00) بارنول، نوفوسيبيرسك، تومسك,"(UTC+07:00) Barnaoul, Novossibirsk, Tomsk","(UTC+07:00) Barnaul, Novosibirsk, Tomsk","(UTC+07:00) Barnaul, Novoszibirszk, Tomszk","(UTC+07:00) Barnaul, Novosibirsk, Tomsk","(UTC+07:00) Barnaul, Novosibirsk, Tomsk","(UTC+07:00) Барнаул, Новосибирск, Томск","(UTC+07:00) Barnaul, Novosibirsk, Tomsk",（国际协调时间+07:00）巴尔瑙尔、新西伯利亚、托木斯克,(UTC+07:00) バルナウル、ノヴォシビルスク、トムスク
(UTC+07:00) Hovd,(UTC + 07: 00) هوفد,(UTC+07:00)Khovd,(UTC+07:00) Hovd,(UTC+07:00) Hovd,(UTC+07:00) Hovd,(UTC+07:00) Hovd,(UTC+07:00) Ховд,(UTC+07:00) Hovd,（国际协调时间+07:00）科布多,(UTC+07:00) ホブド
(UTC+07:00) Krasnoyarsk,(UTC + 07: 00) كراسنويارسك,(UTC+07:00) Krasnoïarsk,(UTC+07:00) Krasnoyarsk,(UTC+07:00) Krasznojarszk,(UTC+07:00) Krasnoyarsk,(UTC+07:00) Krasnoyarsk,(UTC+07:00) Красноярск,(UTC+07:00) Krasnoiarsk,（国际协调时间+07:00）克拉斯诺亚尔斯克,(UTC+07:00) クラスノヤルスク
(UTC+07:00) Novokuznetsk,(UTC + 07: 00) نوفوكوزنيتسك,(UTC+07:00) Novokouznetsk,(UTC+07:00) Novokuznetsk,(UTC+07:00) Novokuznyetszk,(UTC+07:00) Novokuznetsk,(UTC+07:00) Novokuznetsk,(UTC+07:00) Новокузнецк,(UTC+07:00) Novokuznetsk,（国际协调时间+07:00）新库兹涅茨克,(UTC+07:00) ノヴォクズネツク
"(UTC+08:00) Beijing, Chongqing, Hong Kong SAR",(UTC + 08: 00) بكين، تشونغتشينغ، هونغ كونغ ,"(UTC+08:00) Pékin, Chongqing, Région administrative spéciale de Hong Kong","(UTC+08:00) Beijing, Chongqing, Hong Kong SAR","(UTC+08:00) Peking, Csungking, Hongkong SAR","(UTC+08:00) Pechino, Chongqing, Regione Amministrativa Speciale di Hong Kong ","(UTC+08:00) Beijing, Chongqing, Hong Kong SAR","(UTC+08:00) Пекин, Чунцин, Гонконг","(UTC+08:00) Beijing, Chongqing, Hong Kong SAR",（国际协调时间+08:00）北京、重庆、香港特别行政区,(UTC+08:00) 北京、重慶、香港特別自治区
"(UTC+08:00) Brunei, Kuala Lumpur, Singapore",(UTC + 08: 00) بروناي، كوالالمبور، سنغافورة,"(UTC+08:00) Brunei, Kuala Lumpur, Singapour","(UTC+08:00) Brunei, Kuala Lumpur, Singapur","(UTC+08:00) Brunei, Kuala Lumpur, Szingapúr","(UTC+08:00) Brunei, Kuala Lumpur, Singapore","(UTC+08:00) Brunei, Kuala Lumpur, Singapura","(UTC+08:00) Бруней, Куала-Лумпур, Сингапур","(UTC+08:00) Brunei, Kuala Lumpur, Singapur",（国际协调时间+08:00）文莱、吉隆坡、新加坡,(UTC+08:00) ブルネイ、クアラルンプール、シンガポール
"(UTC+08:00) Choibalsan, Ulaanbaatar",(UTC + 08: 00) تشويبالسان، أولانباتار,"(UTC+08:00) Choybalsan, Oulan Bator","(UTC+08:00) Choibalsan, Ulaanbaatar","(UTC+08:00) Csojbalszan, Ulánbátor","(UTC+08:00) Choibalsan, Ulan Bator","(UTC+08:00) Choibalsan, Ulaanbaatar","(UTC+08:00) Чойбалсан, Улан-Батор","(UTC+08:00) Choibalsan, Ulan-Bator",（国际协调时间+08:00）乔巴山、乌兰巴托,(UTC+08:00) チョイバルサン、ウランバートル
(UTC+08:00) Irkutsk,(UTC + 08: 00) إيركوتسك,(UTC+08:00) Irkoutsk,(UTC+08:00) Irkutsk,(UTC+08:00) Irkutszk,(UTC+08:00) Irkutsk,(UTC+08:00) Irkutsk,(UTC+08:00) Иркутск,(UTC+08:00) Irkutsk,（国际协调时间+08:00）伊尔库茨克,(UTC+08:00) イルクーツク
"(UTC+08:00) Manila, Taipei",(UTC + 08: 00) مانيلا، تايبيه,"(UTC+08:00) Manille, Taipei","(UTC+08:00) Manilla, Taipei","(UTC+08:00) Manila, Taipei","(UTC+08:00) Manila, Taipei","(UTC+08:00) Manila, Taipei","(UTC+08:00) Манила, Тайбэй","(UTC+08:00) Manila, Taipéi",（国际协调时间+08:00）马尼拉、台北,(UTC+08:00) マニラ、台北
(UTC+08:00) Perth,(UTC + 08: 00) بيرث,(UTC+08:00) Perth,(UTC+08:00) Perth,(UTC+08:00) Perth,(UTC+08:00) Perth,(UTC+08:00) Perth,(UTC+08:00) Перт,(UTC+08:00) Perth,（国际协调时间+08:00）珀斯,(UTC+08:00) パース
(UTC+08:45) Eucla,(UTC + 08: 45) يوكلا,(UTC+08:45) Eucla,(UTC+08:45) Eucla,(UTC+08:45) Eucla,(UTC+08:45) Eucla,(UTC+08:45) Eucla,(UTC+08:45) Евкла,(UTC+08:45) Eucla,（国际协调时间+08:45）尤克拉,(UTC+08:45) ユークラ
"(UTC+09:00) Chita, Khandyga, Yakutsk",(UTC + 09: 00) تشيتا، خانديجا، ياكوتسك,"(UTC+09:00) Tchita, Khandyga, Iakoutsk","(UTC+09:00) Chita, Khandyga, Yakutsk","(UTC+09:00) Csita, Khandyga, Jakutszk","(UTC+09:00) Čita, Khandyga, Yakutsk","(UTC + 09:00) Chita, Khandyga, Yakutsk","(UTC+09:00) Чита, Хандыга, Якутск","(UTC+09:00) Chita, Chandia, Yakutsk",（国际协调时间+09:00）赤塔市、汉德加、雅库茨克,(UTC+09:00) チタ、ハンドゥイガ、ヤクーツク
"(UTC+09:00) Osaka, Sapporo, Tokyo",(UTC + 09: 00) أوساكا، سابورو، طوكيو,"(UTC+09:00) Osaka, Sapporo, Tokyo","(UTC+09:00) Osaka, Sapporo, Tokio","(UTC+09:00) Oszaka, Szapporo, Tokió","(UTC+09:00) Osaka, Sapporo, Tokyo","(UTC + 09:00) Osaka, Sapporo, Tóquio","(UTC+09:00) Осака, Саппоро, Токио","(UTC+09:00) Osaka, Sapporo, Tokio",（国际协调时间+09:00）大阪、札幌、东京,(UTC+09:00) 大阪、札幌、東京
(UTC+09:00) Pyongyang,(UTC + 09: 00) بيونغ يانغ,(UTC+09:00) Pyongyang,(UTC+09:00) Pyongyang,(UTC+09:00) Phenjan,(UTC+09:00) Pyongyang,(UTC+09:00) Pyongyang,(UTC+09:00) Пхеньян,(UTC+09:00) Pyongyang,（国际协调时间+09:00）平壤,(UTC+09:00) ピョンヤン
(UTC+09:00) Seoul,(UTC + 09: 00) سيول,(UTC+09:00) Séoul,(UTC+09:00) Seoul,(UTC+09:00) Szöul,(UTC+09:00) Seul,(UTC + 09:00) Seul,(UTC+09:00) Сеул,(UTC+09:00) Seúl,（国际协调时间+09:00）汉城,(UTC+09:00) ソウル
(UTC+09:30) Adelaide,(UTC + 09: 30) أديلايد,(UTC+09:30) Adélaïde,(UTC+09:30) Adelaide,(UTC+09:30) Adelaide,(UTC+09:30) Adelaide,(UTC + 09:30) Adelaide,(UTC+09:30) Аделаида,(UTC+09:30) Adelaida,（国际协调时间+09:30）阿德莱德,(UTC+09:30) アデレード
(UTC+09:30) Darwin,(UTC + 09: 30) داروين,(UTC+09:30) Darwin,(UTC+09:30) Darwin,(UTC+09:30) Darwin,(UTC+09:30) Darwin,(UTC + 09:30) Darwin,(UTC+09:30) Дарвин,(UTC+09:30) Darwin,（国际协调时间+09:30）达尔文,(UTC+09:30) ダーウィン
(UTC+10:00) Brisbane,(UTC + 10: 00) بريسبان,(UTC+10:00) Brisbane,(UTC+10:00) Brisbane,(UTC+10:00) Brisbane,(UTC+10:00) Brisbane,(UTC + 10:00) Brisbane,(UTC+10:00) Брисбен,(UTC+10:00) Brisbane,（国际协调时间+10:00）布里斯班,(UTC+10:00) ブリスベン
"(UTC+10:00) Canberra, Melbourne, Sydney",(UTC + 10: 00) كانبيرا، ملبورن، سيدني,"(UTC+10:00) Canberra, Melbourne, Sydney","(UTC+10:00) Canberra, Melbourne, Sydney","(UTC+10:00) Canberra, Melbourne, Sydney","(UTC+10:00) Canberra, Melbourne, Sydney","(UTC + 10:00) Canberra, Melbourne, Sydney","(UTC+10:00) Канберра, Мельбурн, Сидней","(UTC+10:00) Canberra, Melbourne, Sídney",（国际协调时间+10:00）堪培拉、墨尔本、悉尼,(UTC+10:00) キャンベラ、メルボルン、シドニー
"(UTC+10:00) Guam, Port Moresby",(UTC + 10: 00) غوام، بورت مورسبي,"(UTC+10:00) Guam, Port Moresby","(UTC+10:00) Guam, Port Moresby","(UTC+10:00) Guam, Port Moresby","(UTC+10:00) Guam, Port Moresby","(UTC + 10:00) Guam, Port Moresby","(UTC+10:00) Гуам, Порт-Морсби","(UTC+10:00) Guam, Puerto Moresby",（国际协调时间+10:00）关岛、莫尔兹比港,(UTC+10:00) グアム、ポートモレスビー
"(UTC+10:00) Ust-Nera, Vladivostok",(UTC + 10: 00) أوست-نيرا، فلاديفوستوك,"(UTC+10:00) Oust-Nera, Vladivostok","(UTC+10:00) Ust-Nera, Vladivostok","(UTC+10:00) Ust-Nera, Vlagyivosztok","(UTC+10:00) Ust-Nera, Vladivostok","(UTC + 10:00) Ust-Nera, Vladivostok","(UTC+10:00) Усть-Нера, Владивосток","(UTC+10:00) Ust-Nera, Vladivostok",（国际协调时间+10:00）乌斯季涅拉、海参崴,(UTC+10:00) ウスチ＝ネラ、ウラジオストク
(UTC+11:00) Magadan,(UTC + 11: 00) ماغدان,(UTC+11:00) Magadan,(UTC+11:00) Magadan,(UTC+11:00) Magadan,(UTC+11:00) Magadan,(UTC + 11:00) Magadan,(UTC+11:00) Магадан,(UTC+11:00) Magadan,（国际协调时间+11:00）马加丹,(UTC+11:00) マガダン
"(UTC+11:00) Noumea, Solomon Islands",(UTC + 11: 00) نوميا، جزر سليمان,"(UTC+11:00) Nouméa, Îles Salomon","(UTC+11:00) Noumea, Solomon Islands","(UTC+11:00) Noumea, Salamon-szigetek","(UTC+11:00) Noumea, Isole Salomone","(UTC + 11:00) NOUMEA, Ilhas Salomão","(UTC+11:00) Нумеа, Соломоновы острова","(UTC+11:00) Numea, Islas Salomón",（国际协调时间+11:00）努美阿、所罗门群岛,(UTC+11:00) ヌメア、ソロモン諸島
"(UTC+11:00) Sakhalin, Srednekolymsk",(UTC + 11: 00) ساخالين، سريدنيكوليمسك,"(UTC+11:00) Sakhaline, Srednekolymsk","(UTC+11:00) Sakhalin, Srednekolymsk","(UTC+11:00) Szahalin, Szrednyekolimszk","(UTC+11:00) Sakhalin, Srednekolymsk","(UTC + 11:00) Sakhalin, Srednekolymsk","(UTC+11:00) Сахалин, Среднеколымск","(UTC+11:00) Sakhalin, Srednekolymsk",（国际协调时间+11:00）库页岛、中科雷姆斯克,(UTC+11:00) サハリン、スレドネコリムスク
"(UTC+12:00) Anadyr, Kamchatka",(UTC + 12: 00) أنادير، كامشاتكا,"(UTC+12:00) Anadyr, Kamtchatka","(UTC+12:00) Anadyr, Kamchatka","(UTC+12:00) Anadir, Kamcsatka","(UTC+12:00) Anadyr, Kamčatka","(UTC + 12:00) Anadyr, Kamchatka","(UTC+12:00) Анадырь, Камчатка","(UTC+12:00) Anadir, Kamchatka",（国际协调时间+12:00）阿纳德尔、堪察加,(UTC+12:00) アナディリ、カムチャツカ
"(UTC+12:00) Auckland, Wellington",(UTC + 12: 00) أوكلاند، ولينغتون,"(UTC+12:00) Auckland, Wellington","(UTC+12:00) Auckland, Wellington","(UTC+12:00) Auckland, Wellington","(UTC+12:00) Auckland, Wellington","(UTC + 12:00) Auckland, Wellington","(UTC+12:00) Окленд, Веллингтон","(UTC+12:00) Auckland, Wellington",（国际协调时间+12:00）奥克兰、惠灵顿,(UTC+12:00) オークランド、ウェリントン
(UTC+12:45) Chatham,(UTC + 12: 45) شاثام,(UTC+12:45) Chatham,(UTC+12:45) Chatham,(UTC+12:45) Chatham,(UTC+12:45) Chatham,(UTC + 12:45) Chatham,(UTC+12:45) Чатем,(UTC+12:45) Chatham,（国际协调时间+12:45）查塔姆,(UTC+12:45) チャタム
(UTC+13:00) Samoa,(UTC + 13: 00) ساموا,(UTC+13:00) Samoa,(UTC+13:00) Samoa,(UTC+13:00) Szamoa,(UTC+13:00) Samoa,(UTC + 13:00) Samoa,(UTC+13:00) Самоа,(UTC+13:00) Samoa,（国际协调时间+13:00）萨摩亚,(UTC+13:00) サモア
(UTC+13:00) Tonga,(UTC + 13: 00) تونغا,(UTC+13:00) Tonga,(UTC+13:00) Tonga,(UTC+13:00) Tonga,(UTC+13:00) Tonga,(UTC + 13:00) Tonga,(UTC+13:00) Тонга,(UTC+13:00) Tonga,（国际协调时间+13:00）汤加,(UTC+13:00) トンガ
(UTC+14:00) Kiritimati,(UTC + 14: 00) كيريتيماتي,(UTC+14:00) Île Christmas (Kiribati),(UTC+14:00) Kiritimati,(UTC+14:00) Kiritimati,(UTC+14:00) Kiritimati,(UTC + 14:00) Kiritimati,(UTC+14:00) Киримати,(UTC+14:00) Kiritimati,（国际协调时间+14:00）圣诞岛,(UTC+14:00) キリスィマスィ
%b,%b,%b,%b,%b,%b,%b,%b,%b,%b,%b
%D,%D,%D,%D,%D,%D,%D,%D,%D,%D,%D
%D Moving Average Type,نوع المتوسط المتحرك %D,Type de moyenne mobile en % D,%D Art des gleitenden Mittelwerts,%D mozgóátlag típus,%D Tipologia media mobile,%D tipo de média móvel,Тип скользящего среднего %D,Tipo de media móvil %D,%D移动平均线类型,%D移動平均タイプ
%D Periods,فترات %D,%D Périodes,%d Zeiträume,%D időszakok,%D Periodi,%D períodos,Периоды %D,Períodos %D,%D周期,%D期間
%K,%K,%K,%K,%K,%K,%K,%K,%K,%K,%K
%K Double Smoothing Periods,فترات التنعيم المزدوجة %K,Périodes doubles de lissage en % K,%K Doppelte Glättungszeiträume,%K dupla kiegyenlítő időszakok,%K Periodi Double Smoothing,%K períodos de suavização dupla,Периоды двойного сглаживания %K,Períodos de uniformidad doble %K,%K双重平滑周期,%Kダブルスムージング期間
%K Periods,فترات %K,%K Périodes,%K Zeiträume,%K Időszakok,%K Periodi,%K Períodos,Периоды %K,Períodos %K,%K周期,%K期間
%K Smoothing Periods,فترات التنعيم %K,Périodes de lissage en % K,%K Glättungszeiträume,%K kiegyenlítő időszakok,%K periodi di lisciatura,%K períodos de suavização,Периоды сглаживания %K,Períodos de uniformidad %K,%K平滑周期,%Kスムージング期間
+DI,+DI,+DI,+DI,+DI,+DI,+DI,+DI,+DI,上升方向线,+DI
+VI,+VI,+VI,+VI,+VI,+VI,+VI,+VI,+VI,正成交量指标,+VI
1 D,1ي,1 J,1T,1 N,1 G,1 Dia,1 Д,1 D,1 天,1日
1 Hour,1 ساعة,1 Heures,1 Stunde,1 óra,1 H,1 Hora,1 час,1 Hora,1 小时,1時間
1 Min,1د,1 Min,1 Min,1 perc,1 Min,1 Min,1 Мин,1 Min,1 分钟,1分
1 Mo,1ش,1 Mois,1 MN,1 Hó,1 M,1 Mês,1 Мес,1 Mes,1 个月,1月
1 Standard Deviation (1σ),1 الانحراف المعياري (1σ),1 Écart-type (1σ),1 Standard-Abweichung (1σ),1 normál eltérés (1σ),1 deviazione standard (1σ),1 Desvio-padrão (1σ),Среднеквадратическое отклонение 1 (1σ),1 desviación estándar (1σ),1 标准偏差 (1σ),1標準偏差（1σ）
1 W,أ1,1 Sem,1 W,1 Hé,1 S,1 Semana,1 Н,1 S,1 周,1週
10 Min,10د,10 Min,10 Min,10 perc,10 Min,10 Min,10 мин,10 Min,10 分钟,10分
10m,10د,10m,10m,10p,10m,10m,10m,10m,10分钟,10分
13px,13px,13px,13px,13px,13px,13px,13px,13px,13像素,13px
15 Min,15د,15 Min,15 Min,15 perc,15 Min,15 Min,15 мин,15 Min,15 分钟,15分
15m,15د,15m,150m,15p,15m,15m,15m,15m,15分钟,15分
1D,1يوم,1J,1T,1N,1G,1D,1д,1D,1天,1日
1H,1ساعة,1H,1S,1óra,1H,1H,1час,1H,1小时,1時間
1m,1د,1m,1m,1p,1m,1m,1m,1m,1分钟,1分
1M,1شهر,1M,1M,1hó,1M,1M,1мес,1M,1个月,1ヶ月
1W,أ1,1S,1W,1Hé,1S,1S,1Н,1S,1周,1週
1Y,1عام,1A,1J,1é,1A,1A,1г,1A,1年,1年
2 Standard Deviation (1σ),2 الانحراف المعياري (1σ),2 Écart-type (1σ),2 Standard-Abweichungen (1σ),2  normál eltérés (1σ),2 deviazione standard (1σ),2 Desvios-padrão (1σ),Среднеквадратическое отклонение 2 (1σ),2 desviaciones estándar (1σ),2 标准偏差 (1σ),2標準偏差（1σ）
2 Standard Deviation (2σ),2 الانحراف المعياري (1σ),2 Écart-type (2σ),2 Standard-Abweichungen (1σ),2  normál eltérés (2σ),2 deviazione standard (2σ),2 Desvios-padrão (2σ),Среднеквадратическое отклонение 2 (2σ),2 desviaciones estándar (2σ),2 标准偏差 (2σ),2標準偏差（2σ）
3 Standard Deviation (1σ),3 الانحراف المعياري (1σ),3 Écart-type (1σ),3 Standard-Abweichungen (1σ),3  normál eltérés (1σ),3 deviazione standard (1σ),3 Desvios-padrão (1σ),Среднеквадратическое отклонение 3 (1σ),3 desviaciones estándar (1σ),3 标准偏差 (1σ),3標準偏差（1σ）
3 Standard Deviation (3σ),3 الانحراف المعياري (1σ),3 Écart-type (3σ),3 Standard-Abweichungen (3σ),3  normál eltérés (3σ),3 deviazione standard (3σ),3 Desvios-padrão (3σ),Среднеквадратическое отклонение 3 (3σ),3 desviaciones estándar (3σ),3 标准偏差 (3σ),3標準偏差（3σ）
30 Min,30د,30 Min,30 Min,30 Perc,30 Min,30 Min,30 мин,30 Min,30 分钟,30分
30m,30د,30m,30m,30p,30m,30m,30m,30m,30分钟,30分
3M,3أشهر,3M,3M,3hó,3M,3M,3мес,3M,3个月,3ヶ月
4 Hour,4 ساعة,4 Heures,4 Stunden,4 óra,4 H,4 Horas,4 часа,4 Horas,4 小时,4時間
4H,4ساعة,4H,4S,4óra,4H,4H,4часа,4H,4小时,4時間
5 Min,5د,5 Min,5 Min,5 perc,5 Min,5 Min,5 Мин,5 Min,5 分钟,5分
5D,5أيام,5J,5T,5N,5gg,5D,5д,5D,5天,5日
5m,5د,5m,5m,5p,5m,5m,5m,5m,5分钟,5分
5Y,5أعوام,5A,5Jahre,5é,5A,5A,5лет,5A,5年,5年
6M,6أشهر,6M,6M,6 hó,6 M,6M,6мес,6M,6个月,6ヶ月
Abstract,مجرد,Résumé,Abstrakt,Absztrakt,Riassunto,Abstrato,Сводка,Abstracto,摘要,要約
Abstract,الملخص,Résumé,Kurzdarstellung,Kivonat,Riassunto,Abstrato,Абстрактн.,Abstracto,摘要,要約
Acc Swing,مؤشر التأرجح التراكمي,Acc Swing,Acc Oszilation,Felhalm Swing,Acc Swing,Oscilação Acc,Кумулятивный индекс колебаний,Oscilación Acc.,积累摆动指标,集積スイング
Accumulation/Distribution,مؤشر التوزيع المتراكم,Distribution/Accumulation,Accumulation Distribution,Accumulation Distribution,Accumulation Distribution,Distribuição acumulativa de,Индикатор накопления/распределения,Distribución de acumulación,威廉多空力度线,集積/離散
Accumulative Swing Index,مؤشر التأرجح التراكمي,Indice Accumulative Swing,ASI,Felhalmozódó Swing Index,Indice Accumulative Swing,Índice de oscilação acumulativo,Кумулятивный индекс колебаний,Índice de oscilación acumulativo,积累摆动指标,アキューミュレーション・スイング指数
Add,إضافة,Ajouter,Hinzufügen,Hozzáadás,Somma,Adicionar,Добавить,Añadir,添加,追加
ADD,أضف,AJOUTER,HINZUFÜGEN,ADD,Aggiungi,ADD,добавить,ADD,添加,ADD
Add Stop Loss,أضف وقف الخسارة,Ajouter Stop Loss,Stop Loss hinzufügen,Stop loss hozzáadása,Aggiungi Stop Loss,Adicionar parar perda,Добавить стоп-лосс,Añadir límite de pérdidas,增加止损,ストップロスを追加
Add Take Profit,الحصول على الربح,Ajouter faire des bénéfices,Take Profit hinzufügen,Profitfelvétel hozzáadása,Aggiungi Take Profit,Adicionar recolher lucros,Добавить тейк-профит,Añadir límite de ganancias,增加止盈,テイクプロフィットを追加
ADX,ADX,ADX,ADX,ADX,ADX,ADX,ADX,ADX,趋向平均值,ADX
ADX/DMS,ADX/DMS,ADX/DMS,ADX/DMS,ADX/DMS,ADX/DMS,ADX/DMS,ADX/DMS,ADX/DMS,自动数据交换系统/数据库管理系统,ADX/DMS
ALL,الكل,TOUT,ALLE,ÖSSZES,TUTTI,TUDO,ВСЕ,TODO,全部,全て
All-Time High Lookback Period,مراجعة كل أوقات الفترة الماضية,Période de rétrospection élevée tout le temps,Allzeithoch Beobachtungszeitraum,Mindenkori magas számú visszatekintési időszak,Periodo con lookback più alto di tutti i tempi,Período de Lookback mais alto de sempre,Период ретроспективного анализа абсолютных максимумов,Periodo retrospectivo alto general,随时高回顾期间,過去最高値遡及（ルックバック）期間
Alligator,مؤشر التمساح,Alligator,Alligator,Alligátor,Alligator,Aligátor,Аллигатор,Alligator,鳄鱼指标,アリゲーター
Annotation,تعليق توضيحي,Annotation,Anmerkung,Magyarázat,Annotazione,Anotação,Примечание,Anotación,注释,注釈
Arc,قوس,Arc,Bogen,Ív,Arco,Arco,Дуга,Arco,弧形,アーク
Aroon,مؤشر أرون,Aroon,Aroon,Aroon,Aroon,Aroon,Арун,Aroon,阿隆指标,アルーン
Aroon Down,مؤشر أرون الهابط,Aroon Down,Aroon Down,Aroon lefelé,Aroon Down,Aroon para baixo,Арун (вниз),Aroon abajo,阿隆指标下降,アルーン・ダウン
Aroon Osc,مذبذب أرون,Aroon Osc,Aroon Osz,Aroon oszc.,Oscillatore Aroon,Aroon osc,Осциллятор Арун,Osc. Aroon,阿隆震荡指标,アルーン・オシレーター
Aroon Oscillator,مذبذب أرون,Oscillateur d'Aroon,Aroon Oscillator,Aroon oszcillátor,Oscillatore Aroon,Oscilador Aroon,Осциллятор Арун,Oscilador Aroon,阿隆摆动指标,アルーン・オシレーター
Aroon Up,مؤشر أرون الصاعد,Aroon Up,Aroon Up,Aroon felfelé,Aroon Up,Aroon para cima,Арун (вверх),Aroon arriba,阿隆指标上升,アルーン・アップ
Arrow,السهم,Flèche,Pfeil,Nyíl,Freccia,Seta,Стрелка,Flecha,箭头,矢印
ATH Lookback Period,فترة ATH حلقية,Période lookback ATH,ATH Lookback Periode,ATH visszatekintési időszak,Periodo di lookback ATH,Período de Lookback ATH,Период ATH,Perido retrospectivo ATH,ATH 回顾周期,ATH後退期間
ATR,ATR,ATR,ATR,ATR,ATR,ATR,ATR,ATR (Media de rango verdadero),平均真实波幅,ATR
ATR Bands,حدود متوسط المدى الحقيقي,Bandes GMR,ATR Bänder,ATR szalagok,Bande ATR,Marcas ATR,Полосы ATR,Bandas ATR,ATR带,アベレージ・トゥルー・レンジ・バンド
ATR Bands Bottom,أسفل حدود متوسط المدى الحقيقي,Bandes GMR Bas,ATR Bänder Unten,ATR szalagok alsó pontja,Bande ATR bottom,Fundo bandas ATR,Нижняя граница полос ATR,Bandas ATR inferiores,ATR带底部,アベレージ・トゥルー・レンジ・バンド・ボトム
ATR Bands Channel,حدود متوسط المدى الحقيقي,Bandes GMR Canal,ATR Bänder Channel,ATR szalagok Channel,Bande ATR Channel,Canal bandas ATR,Канал полос ATR,Canal de bandas ATR,斯塔克带顶部值,アベレージ・トゥルー・レンジ・バンド・チャネル
ATR Bands Top,أعلى حدود متوسط المدى الحقيقي,Bandes GMR Haut,ATR Bänder Oben,ATR szalagok csúcsa,Bande ATR top,Topo bandas ATR,Верхняя граница полос ATR,Bandas ATR superiores,ATR带顶部,アベレージ・トゥルー・レンジ・バンド・トップ
ATR Trailing Stop,التوقف المتحرك لمتوسط المدى الحقيقي,Arrêt des négociations GMR,ATR Trailing-Stop,ATR Trailing Stop (ATR csúszó stop megbízás),ATR Trailing Stop,Paragem móvel ATR,Скользящий стоп ATR,Orden de arrastre de pérdidas ATR,ATR追踪止损,アベレージ・トゥルー・レンジ・トレーリング・ストップ
ATR Trailing Stops,التوقفات المتحركة لمتوسط المدى الحقيقي,Arrêts des négociations GMR,ATR Trailing-Stops,ATR Trailing Stops (ATR csúszó stop megbízások),ATR Trailing Stop,Limites móveis ATR,Скользящие стопы ATR,Órdenes de arrastre de pérdidas ATR,ATR追踪止损,アベレージ・トゥルー・レンジ・トレーリング・ストップ
Auto Select,اختيار تلقائي,Sélection automatique,Automatische Wahl,Automatikus kiválasztás,Selezione automatica,Auto Seleccionar,Автоматическое выделение,Seleccione automáticamente,自动选择,自動選択
Average,المتوسط,Moyenne,Durchschnitt,Átlag,Media,Média,Среднее,Medio,平均,平均
Average Line,خط المتوسط,Ligne de la moyenne,Durchschnittslinie,Átlagvonal,Linea della media,Linha Média,Средняя линия,Línea media,平均线,平均線
Average True Range,متوسط المدى الحقيقي,Gamme moyenne réelle,Average True Range (ATR),Average True Range (átlagos igaz tartomány),Average True Range,Intervalo real médio,Средний истинный диапазон (ATR),Rango medio verdadero (ATR),平均真实范围,アベレージ・トゥルー・レンジ
Average Type,نوع المتوسط,Type de moyenne,Durchschnittstyp,Átlag típusa,Tipo di media,Tipo Médio,Тип среднего,Tipo medio,平均型,平均タイプ
Awesome,رائع,Génial,Fantastisch,Remek,Fantastico,Excelente,Великолепно,Fantástico,不错指标,オーサム
Awesome Oscillator,المتذبذب الرائع,Oscillateur impressionnant,Awesome Oscillator,Awesome oszcillátor,Oscillatore Awesome,Awesome Oscillator,Волшебный осциллятор,Oscilador asombroso,AO震荡指标,オーサム・オシレーター
Axis Label,تسمية المحور,Libellé de l'axe,Achsenbeschriftung,Tengelycímke,Nome dell'asse,Rótulo do eixo,Обозначение оси,Etiqueta de eje,轴标签,軸ラベル
Axis Label:,اسم المحور:,Étiquette de l'Axe:,Achsenbeschriftung,Tengelycímke:,Etichetta dell'asse:,Etiqueta Axis:,Обозначение оси:,Etiqueta de eje:,坐标轴标签：,軸ラベル：
Axis Text,بيان المحاور,Titres des axes,Achsentext,Tengely szövege,Testo Asse,Texto eixo,Название оси,Texto del eje,轴标题,軸ラベル
Axis Text,نص المحور,Texte axe,Achsenbeschriftung,Tengely szövege,Testo asse,Texto de Eixo,Тест оси,Texto de eje,轴文本,中心線のテキスト
B,سميك,B,F,F,B,B,Ж,N,粗体,太字
Background,الخلفية,Fond,Hintergrund,Háttér,Sfondo,Plano de Fundo,Фон,Fondo,背景,背景
Background Color,لون الخلفية,Couleur du fond,Hintergrundfarbe,Háttérszín,Colore dello sfondo,Cor de fundo,Фоновый цвет,Color de fondo,背景颜色,背景カラー
Balance of Power,توازن القوى,Équilibre des forces,Kräfteverhältnis,Erőegyensúly,Equilibrio di potenza,Equilíbrio de Poder,Баланс мощности,Equilibrio de poder,力量的均衡,力のバランス
Bandwidth,عرض نطاق,Bandes passantes,Bandbreite,Szalagszélesség,Ampiezza della banda,Largura de banda,Ширина полосы,Ancho de banda,带宽,幅
Bar,الأعمدة,Barre,Balken,Sáv,Barra,Barras,Бар,Barra,直线,棒
Bars,أعمدة,Barres,Balken,Barok,Barre,Barras,Полосы,Barras,柱,バー
Bars Color,لون الأشرطة,Couleur des barres,Farbige Balken,Sávszínek,Colore delle barre,Cor das barras,Цвет столбцов,Color de las barras,柱线颜色,バーカラー
Base Line,الخط الأساسي,Référence,Basislinie,Alapvonal,Linea di base,Linha de base,Базовая линия,Línea base,基础线,基礎ライン
Base Line Period,فترة الخط الأساسي,Phase de référence,Basislinie Zeitraum,Alapvonal időszak,Periodi della linea di base,Período de linha de base,Период усреднения базовой линии,Período de línea base,基础线周期,基礎ライン期間
Baseline,خط الأساس,Ligne de base,Baseline,Alapvonal,Linea di base,Linha de base,Основная линия,Referencia,基线,ベースライン
Baseline Delta,التغيير من خط الأساس,Changement de ligne de base,Veränderung vom Ausgangswert,Változás a kiindulási értékhez képest,Variazione al basale,Mudança da linha de base,изменение по сравнению с исходным,Cambio de línea de base,从基线的变化,ベースラインからの変化
BATS BZX real-time.,.في الوقت الحقيقي BATS BZX,BATS BZX en temps réel.,BATS BZX Echtzeit .,BATS BZX valós időben.,BATS BZX in tempo reale.,BATS BZX em tempo real.,BATS BZX в режиме реального времени.,BATS BZX en tiempo real.,BATS BZX实时性。,BATSはリアルタイムBZX。
Bearish,هبوطي,À la baisse,Bärisch,Medve,Al ribasso,Bearish,Медвежий,Bajista,看跌,弱気
Beta,تجريبي,Bêta,Beta,Beta,Beta,Beta,Бета-версия,Beta,测试,Beta
Beta Callouts Candle Border,حدود شمعة Beta Callouts,Marge de la bougie Beta Callouts,Beta Beschriftungen der Kerzengrenze,Béta ábrafeliratok gyertyaszegély,Margine della candela Beta di Callout,Fronteira de Textos Explicativos Vela Beta,Границы свечи,Borde de vela de referencia Beta,Beta 标注蜡烛边框,ベータコールアウトロウソク足ボーダー
Black,أسود,Noir,Schwarz,Fekete,Nero,Preto,Черная,Negro,黑色,黒
Boll %b,بولنجر %b,Boll %b,Boll %b,Boll %b,Boll %b,Boll %b,%b Боллинджера,Boll %b,布林线%b,ボリンジャー %b
Boll BW,عرض نطاق بولنجر,Bandes passantes de Bollinger,Boll BB,Boll sz.sz.,Boll BW,Boll BW,Ширина полосы Боллинджера,Ancho de banda Boll,布林带宽度,ボリンジャーバンド幅
Bollinger %b,بولنجر %b,Bollinger %b,Bollinger %b,Bollinger %b,Bollinger %b,Bollinger %b,%b Боллинджера,Bollinger %b,布林%b,ボリンジャー %b
Bollinger Bands,حدود بولنجر,Bandes de Bollinger,Bollinger-Bänder,Bollinger szalagok,Bande di Bollinger,Marcas Bollinger,Полоса Боллинджера,Bandas de Bollinger,布林线,ボリンジャーバンド
Bollinger Bands Bottom,أسفل حدود بولنجر,Bandes de Bollinger Bas,Bollinger Bänder Unten,Bollinger szaagok alsó pont,Bande di Bollinger Bottom,Bandas Bollinger fundo,Полосы Боллинджера (нижний уровень),Bandas de Bollinger inferiores,布林线底部,ボリンジャーバンド・ボトム
Bollinger Bands Median,متوسط حدود بولنجر,Bandes de Bollinger Médian,Bollinger Bänder Mitte,Bollinger szalagok közép,Bande di Bollinger Median,Bandas Bollinger média,Полосы Боллинджера (медианный уровень),Bandas de Bollinger medias,布林线中位,ボリンジャーバンド中央値
Bollinger Bands Top,أعلى حدود بولنجر,Bandes de Bollinger Haut,Bollinger Bänder Oben,Bollinger szalagok csúcs,Bande di Bollinger Top,Bandas Bollinger topo,Полосы Боллинджера (верхний уровень),Bandas de Bollinger superiores,布林线顶部,ボリンジャーバンド・トップ
Bollinger Bandwidth,مؤشر عرض حدود بولنجر,Bande passante de Bollinger,Bollinger Bandbreite,Bollinger szalagszélesség,Ampiezza Banda di Bollinger,Largura de banda Bollinger,Ширина полосы Боллинджера,Ancho de banda de Bollinger,布林带宽,ボリンジャーバンド幅
Border,الحدود,Ligne frontière,Rand,Szegély,Margine,Limite,Контур,Borde,边框,境界
Bulge Threshold,عتبة الارتفاع المفاجئ,Seuil de renflement,Anschwellen des Grenzwerts,Kiugró határérték,Bulge Threshold,Limite da saliência,Порог повышения,Umbral de abultamiento,突出部门槛,バルジ閾値
Bullish,صعودي,À la hausse,Bullisch,Bika,Al rialzo,Bullish,Бычий,Alcista,看涨,強気
Buy Stops,أوامر توقف الشراء,Arrêts des achats,Kauf-Stopps,Stopok vétele,Ordini stop di acquisto (Buy Stops),Comprar paragem,Стопы на покупку,Paradas de compra,止损买单,買い逆指値
by Xignite.,Xignite بواسطة,par Xignite.,von Xignite.,által Xignite.,per Xignite.,por Xignite., по Xignite., por Xignite.,由Xignite。,Xigniteによる。
Callout,طلب,Référence,Angabe,Kihívás,Fumetto,Período de disponibilidade,Сноска,Llamada,卖出,コールアウト
Callouts,وسائل الشرح,Callout,Beschriftungen,Ábrafeliratok,Callout,Convocações,Позиции,Llamadas,图例,コールアウト
cancel,إلغاء,Annuler,abbrechen,mégse,annulla,cancelamento,отмена,cancelar,取消,キャンセル
Candle,الشموع,Bougie,Kerze,Gyertya,Candela,Vela,Свеча,Vela,蜡烛,ローソク足
Candle Border,حد الشمعة,Marge de la bougie,Kerzenumrandung,Gyertyaszegély,Margine della candela,Borda da Vela,Контур свечи,Borde la vela,烛边缘,ロウソク足の縁
Candle Borders,حدود الشمعة,Encadrements de bougies,Kerzen-Ränder,Gyertyaszegélyek,Bordi grafico a candela,Rebordos em forma de velas,Границы свечи,Bordes de vela,蜡烛国界,キャンドルボーダー
Candle Color,لون الشمعة,Couleur de la bougie,Kerzenfarbe,Gyertya színe,Colore della candela,Cor da Vela,Цвет свечи,Color de la vela ,烛色,ロウソク足の色
Candle Color,لون الشمعة,Couleur bougie,Kerzenfarbe,Gyertya színe,Colore della candela,Cor de Vela,Цвет свечи,Color de la vela,蜡烛颜色,ロウソク足の色
Candle Wick,فتيل الشمعة,Mèche de la bougie,Kerzendocht,Gyertyakanóc,Stoppino della candela,Pavio de Vela,Тень свеч,Mecha de la vela,蜡烛烛心,ロウソク足の本体
Candles,شموع,Bougies,Kerzen,Gyertyák,Candele,Velas,Свечи,Velas,蜡烛,ローソク足
Center Of Gravity,مؤشر مركز الجاذبية,Centre de gravité,Schwerpunkt-Indikator,Center Of Gravity,Center Of Gravity,Centro de gravidade,Центр тяжести,Centro de gravedad,重心指标,重心
Chaikin MF,مؤشر سيولة تشايكن,Flux monétaire de Chaikin,Chaikin MF,Chaikin MF,Chaikin MF,MF Chaikin,Денежный поток Чайкина,MF de Chaikin,佳庆现金流量指标,チャイキン・マネーフロー
Chaikin Money Flow,مؤشر سيولة تشايكن,Flux monétaire de Chaikin,Chaikin Money Flow,Chaikin pénzáramlás,Chaikin Money Flow,Fluxo monetário Chaikin,Денежный поток Чайкина,Flujo de dinero Chaikin,佳庆现金流指标,チャイキン・マネー・フロー
Chaikin Vol,مؤشر التقلب تشايكن,Volatilité de Chaikin,Chaikin Vol,Chaikin Vol,Chaikin Vol,Vol Chaikin,Волатильность Чайкина,Vol. de Chaikin,佳庆成交量指标,チャイキン・ボラティリティ
Chaikin Volatility,مؤشر التقلب تشايكن,Volatilité de Chaikin,Chaikin Volatility,Chaikin volatilitás,Volatilità di Chaikin,Volatilidade Chaikin,Волатильность Чайкина,Volatilidad Chaikin,佳庆波动指标,チャイキン・ボラティリティ
Chande Fcst,تنبؤ شاندي,Progression de Chande,Chande Prog,Chande Előrejelz,Chande Fcst,Previsão Chande,Предсказующий осциллятор Чанде,Prev. Chande,钱德预测指标,シャンデ予想
Chande Forecast Oscillator,مذبذب تنبؤ شاندي,Indicateur de prévision de Chande,Chande Forecast Oszillator,Chande előrejelzési oszcillátor,Oscillatore Chande Forecast,Oscilador de previsão Chande,Предсказующий осциллятор Чанде,Oscilador de previsión Chande,钱德预测摆动指标,シャンデ予想オシレーター
Chande Momentum Oscillator,مذبذب زخم شاندي,Oscillateur de dynamique de Chande,Chande Momentum Oszillator,Chande momentum oszcillátor,Oscillatore Chande Momentum,Oscilador de momentum Chande,Моментум-осциллятор Чанде,Oscilador de momento Chande,钱德动量摆动指标,シャンデ・モメンタム・オシレーター
Chande Mtm,زخم شاندي,Dynamique de Chande,Chande Dyn,Chande Mtm,Chande Mtm,Mtm Chande,Моментум-осциллятор Чанде,Momento Chande,钱德动量指标,シャンデ・モメンタム
Change Timezone,تغيير المنطقة الزمنية,Modifier la plage horaire,Zeitzone ändern,Időzóna módosítása,Cambia fuso orario,Alterar fuso horário,Изменить часовой пояс,Cambiar zona horaria,更改时区,タイムゾーンの変更
Channel,قناة,Canal,Kanal,Channel,Canale,Canal,Канал,Canal,通道,チャネル
Channel Fill,تعبئة القناة,Canal de Fill,Channel Fill,Channel feltöltés,Channel Fill,Preenchimento de canal,Заполнение канала,Llenado del canal,通道填充,チャネル・フィル
Chart,الرسم البياني,Graphique,Darstellung,Diagram,Grafico,Gráfico,График,Gráfica,图表,チャート
Chart Preferences,تفضيلات الرسم البياني,Préférences des graphiques,Charteinstellungen,Grafikon-beállítások,Preferenze dei grafici,Gráfico de Preferências,Настройки графика,Preferencias del gráfico,图表选择,チャート設定
Chart Scale,مقياس الرسم البياني,Échelle du graphique,Darstellungsskala,Diagram beosztás,Scala Grafico,Escala do gráfico,Шкала графика,Escala de la gráfica,图表尺度,チャート目盛
Chart Shared Successfully!,تم مشاركة الرسم البياني بنجاح!,Tableau partagé avec succès !,Chart wurde erfolgreich geteilt!,A chartot sikeresen megosztotta!,Grafico condiviso con successo!,Gráfico partilhado com sucesso!,График успешно опубликован!,¡Gráfica compartida correctamente!,成功分享图表！,チャートの共有が完了しました！
Chart Style,أسلوب الرسم البياني,Style de graphique,Darstellungsstil,Diagram stílusa,Stile grafico,Estilo do gráfico,Тип графика,Estilo de gráfica,图表类型,チャート形式
Chart Type,نوع الرسم البياني,Type de graphique,Diagrammtyp,Diagram típus,Tipo di grafico,Tipo de gráfico,Тип графика,Tipo de gráfico,图表类型,グラフの種類
Check,شيك,Vérifier,Häkchen,Ellenőrzés,Segno di spunta,Verificação,Галочка,Comprobar,勾,チェック
Choose language,اختر اللغة,Choisissez votre langue,Sprache wählen,Válasszon nyelvet,Scegli la lingua,Escolha o idioma,Выбор языка,Elegir idioma,选择语言,言語を選択する
Choose Timezone,اختر منطقة زمنية,Choisir la plage horaire,Zeitzone wählen,Időzóna kiválasztása,Scegli Fuso orario,Escolher o fuso horário,Выбор врем. пояса,Elegir zona horaria,选择时区,タイムゾーンの選択
Choppiness Index,مؤشر الاضطراب,Indice Choppiness,Choppiness-Index,Változó irányokat mutató (Choppiness) index,Indice choppiness,Índice de ondas,Индекс зыбучести,Índice de fluctuación de tendencias,翻滚度指数,チョピネス・インデックス
Clear,مسح,Régler,Löschen,Törlés,Cancella,Limpar,Очистить,Borrar,清除,消去
Clear All,مسح الكل,Suprimez tout,Alle löschen,Összes törlése,Cancella tutto,Limpar Todos,Очистить все,Eliminar todo,全部清除,全てをクリアする
Clear Drawings,مسح الرسومات,Effacer les dessins,Deutliche Zeichnungen,Ábrák törlése,Cancella Disegni,Limpar desenhos,Удалить изображения,Eliminar los dibujos,清空图示,描画をクリア
Close,إغلاق,Fermer,Schließen,Bezárás,Chiudi,Fecho,Закрыть,Cerrar,关闭,閉じる
close,إغلاق,Ferme,schließen,bezárás,Chiudi,fechar,закрыть,cerrar,关闭,閉じる
Color,اللون,Couleur,Farbe,Szín,Colore,Cor,Цвет,Color,颜色,カラー
Colored Bar,الأعمدة الملونة,Barre en couleur,Farbiger Balken,Színes sáv,Barra colorata,Barra colorida,Цветной бар,Barra de color,彩条,カラー棒
Colored Line,الخطوط الملونة,Ligne en couleur,Farbiger Linie,Színes vonal,Linea colorata,Linha colorida,цветной линия,Línea de color,色线,色付きのライン
COMMODITIES,السلع,MATIÈRES PREMIÈRES,ROHSTOFFE,ÁRUCIKKEK,MATERIE PRIME,PRODUTOS,ТОВАРЫ,MATERIAS PRIMAS,商品,商品
Commodity Channel Index,مؤشر قناة السلع,Indice du canal des matières premières,Commodity Channel Index,Commodity Channel Index,Indice Commodity Channel,Índice de canal das mercadorias,Индекс товарного канала,Índice de canal de materias primas,顺势通道指标,コモディティ・チャネル指数
Compare,مقارنة,Comparer,Vergleichen,Összehasonlítás,Confronta,Comparar,Сравнить,Comparar,比较,比較
Comparison Symbol,رمز المقارنة,Comparaison des symboles,Vergleichssymbol,Összehasonlító szimbólum,Simbolo di confronto,Símbolo de comparação,Символ сравнения,Símbolo de comparación,比较代码,比較記号
Composite,مركب,Composé,Zusammensetzung,Összetett,Composito,Composto,Составной,Mixto,综合,総合
Composite RSI,مؤشر القوة النسبية المُرّكب,Composé RSI,Zusammengesetzter RSI-Indikator,Összetett Rrlatív erősség index (RSI),RSI composito,RSI composto,Составной индекс относительной силы (RSI),RSI mixto,综合RSI（相对强弱指标）,総合RSI
Continuous,متصل,Continu,Durchgehend,Állandó,Continuo,Contínuo,Непрерывный,Continuo,连续线,連続的
Conversion Line,خط التحويل,Transformation des valeurs,Konversionslinie,Konverziós vonal,Linea di conversione,Linha de conversão,Конверсионная линия,Línea de conversión,对话线,変換ライン
Conversion Line Period,فترة خط التحويل,Phase de transformation des valeurs,Konversionslinie Zeitraum,Konverziós vonal időszak,Periodo della linea di conversione,Período de conversão de linha,Период усреднения конверсионной линии,Período de línea de conversión,对话线周期,変換ライン期間
Coppock,كوبوك,Coppock,Coppock,Coppock,Coppock,Coppock,Коппок,Coppock,估波指标,コポック
Coppock Curve,منحنى كوبوك,Courbe de Coppock,Coppock-Indikator,Coppock görbe,Coppock Curve,Curva de Coppock,Кривая Коппока,Curva de Coppock,估波曲线,コポック指標
Correl,الارتباط,Correl,Correl,Korrelál,Correlazione,Correl,Корреляция,Correl.,相关,相関係数
Correlation,ترابط,Corrélation,Korrelation,Korreláció,Correlazione,Correlação,Корреляция,Correlación,相关,相関関係
Correlation Coefficient,معامل الارتباط,Coefficient de corrélation,Korrelationskoeffizient,Korrelációs együttható,Coefficiente di correlazione,Coeficiente de Correlação,Коэффициент корреляции,Coeficiente de correlación,相关系数,相関係数
Courier,Courier,Courrier,Courier,Courier,Courier,Correio,Courier,Courier,Courier 字体,Courier
Create,إنشاء,Créer,Erstellen,Létrehozás,Crea,Criação,Создать,Crear,创建,新規作成
Create a New Custom Theme,إنشاء نسق جديد,Créer un nouveau modèle personnalisé,Neues individuelles Layout erstellen,Új egyedi téma létrehozása,Crea Nuovo Tema Personalizzato,Criar novo tema personalizado,Создать новую пользовательскую тему,Crear un nuevo tema personalizado,创建新的自定义主题,カスタムテーマの新規作成
Create Custom Theme,إنشاء مظهر مخصص,Créez un thème personnalisé,Benutzerdefinierte Vorlage erstellen,Új egyedi téma készítése,Crea tema personalizzato,Criar Tema Personalizado,Пользовательская тема,Crear tema personalizado,创建自定义主题,カスタムテーマを作成する
Create Image,إنشاء صورة,Créez une image,Bild erstellen,Kép készítése,Crea immagine,Criar Imagem,Создать изображение,Crear imagen,创建图像,画像を作成する
Cross,الصليب,Croix,Kreuz,Kereszt,Croce,Cruz,Крест,Cruz,叉,クロス
Crosshair,التقاطع,Crosshair,Fadenkreuz,Célkereszt,Mirino,Mira,Перекрестие,Punto de mira,十字光标,十字線
Crosshairs,علامات,Croix,Fadenkreuze,Célkeresztek,Mirini,Mira,Перекрестья,Cruz visor,十字线,十字
Crossline,خط التقاطع,Crossline,Kreuzlinie,Keresztvonal,Crossline,Linha Cruzada,Линия пересечения,Línea de cruce ,单行标题,十字線
CURRENCIES,العملات,DEVISES,DEVISEN,DEVIZÁK,VALUTE,MOEDAS,ВАЛЮТЫ,DIVISAS,货币,通貨
Current Studies,الدراسات الحالية,Études en cours,Aktuelle Studien,Jelenlegi mutatók,Studi in corso,Estudos Actuais,Текущая аналитика,Estudios actuales,当前研究,現在のスタディー
Current Symbols,الرموز الحالية,Symboles actuels,Aktuelle Symbole,Aktuális szimbólumok,Simboli correnti,Símbolos atuais,Используемые символы,Símbolos actuales,当前符号,現在の記号
Current TimeZone is,الفترة الزمنية الحالية,Le fuseau horaire actuel est,Ihre aktuelle Zeitzone ist,A jelenlegi időzóna,Il fuso orario attuale è,Fuso Horário Actual é,Текущий часовой пояс:,El huso horario actual es,当前的时区是,現在のタイムゾーンは
Custom Themes,أنساق مخصصة,Modèles personnalisés,Individuelle Layouts,Egyedi témák,Personalizza temi,Temas personalizados,Пользовательские темы,Temas personalizados,自定义主题,カスタムテーマ
Cycle 1,الدورة 1,Cycle 1,Zyklus 1,1. ciklus,Ciclo 1,Ciclo 1,Цикл 1,Ciclo 1,周期1,サイクル1
Cycle 2,الدورة 2,Cycle 2,Zyklus 2,2. ciklus,Ciclo 2,Ciclo 2,Цикл 2,Ciclo 2,周期2,サイクル2
Cycle 3,الدورة 3,Cycle 3,Zyklus 3,3. ciklus,Ciclo 3,Ciclo 3,Цикл 3,Ciclo 3,周期3,サイクル3
D,ي,J,T,N,g,Dia,Д,D,日,日
daily,اليومي,quotidien,täglich,napi,giornaliero,diário,ежедневный,diario,日常,デイリー
Darvas,دارفاس,Darvas,Darvas,Darvas,Darvas,Darvas,Дарвас,Darvas,达瓦斯,ダーバス
Darvas Box,صندوق دارفاس,Boîte Darvas,Darvas-Box,Darvas doboz,Scatole di Darvas,Caixa Darvas,Область Дарваса,Caja de Darvas,股票箱理论,ダーバス・ボックス
Data delayed 15 min.,.جميع البيانات متأخرة 15 دقيقة,Données retardées 15 min.,Daten verzögert 15 min.,Adat késleltetve 15 perc.,Dati ritardato 15 min.,Dados atrasado 15 min.,Данные с задержкой 15 мин.,Datos retrasó 15 minutos.,数据延迟15分钟。,データは15分遅れ。
Data is randomized.,.البيانات غير العشوائية,Les données sont randomisées.,Daten randomisiert.,Az adatok véletlen.,I dati è randomizzato.,Dados é aleatório.,Данные рандомизированных.,De datos es aleatorizado.,数据是随机的。,データがランダム化されます。
Data is real-time.,.البيانات هو الوقت الحقيقي,Les données sont en temps réel.,Die Daten werden in Echtzeit.,Az adatok valós időben.,I dati sono in tempo reale.,Os dados estão em tempo real.,Данные в режиме реального времени.,Los datos es en tiempo real.,数据是实时的。,データはリアルタイムです。
Date Dividers,فواصل التاريخ,Séparateurs de date,Datumsverteiler,Dátumválasztók,Divisori della data,Divisores de Data,Разделители дат,Divisores de fecha,日期分隔线,日付分割
Date/Time,التاريخ/الوقت,Date /Heure,Datum/Uhrzeit,Dátum/időpont,Data/Ora,Data/Hora,Дата/время,Fecha/Hora,日期/时间,日付/時間
Date/Time:,التاريخ/الوقت:,Date/Heure,Datum/Uhrzeit:,Dátum/időpont:,Data/Ora,Data/Hora:,Дата/время:,Fecha/Hora:,日期/时间,日付／時間：
Day,نهاري,Jour,Tag,Nappal,Giorno,Dia,День,Claro,白天,日中
Days Per Year,يوم في السنة,Jours par an,Tage pro Jahr,Év per napok,giorni l'anno,Dias por ano,Дней в году,Días por año,每年天数,年間あたり日数
Decreasing Bar,شريط الهبوط,Barre descendante,Abnehmender Balken,Csökkenő sáv,Barra decrescente,Diminuindo a barra,Столбец падения,Barra decreciente,减少柱线,減少バー
Default,افتراضي,Par défaut,Standard ,Alapértelmezett,Default,Pré-definido,По умолчанию,Por defecto,默认,初期設定
Default Themes,الأنساق الافتراضية,Thèmes par défaut,Standardlayouts,Alapértelmezett témák,Temi di default,Temas padrão,Исходные темы,Temas predeterminados,默认主题,既定のテーマ
Delete,مسح,Supprimer,Löschen,Törlés,Elimina,Apagar,Удалить,Eliminar,删除,削除
Delete Study,حذف الدراسة,Effacez l'étude,Studien löschen,Mutató törlése,Cancella lo studio,Eliminar Estudo,Удалить аналитику,Eliminar estudio,删除研究,スタディーを削除する
Demo data.,.البيانات تجريبي,Les données de démonstration.,Demo-Daten.,Demo adatokat.,Dati demo.,Dados de demonstração.,Демо-данные.,Datos de demostración.,示范数据。,デモデータ。
Detrended,بدون اتجاه,Qui élimine la tendance,Trendbereinigt,Detrended (Tendencia nélküli),Detrended,Destendenciada,Бестрендовая,Sin tendencia,非趋势指标,デトレンディッド
Detrended Price Oscillator,مذبذب السعر بدون اتجاه,Oscillateur de prix éliminant la tendance,Detrended Price Oszillator,Detrended Price Oscillator (Tendencia nélküli ár oszcillátor),Oscillatore Detrended Price,Oscilador de preço destendenciada,Осциллятор бестрендовой цены,Oscilador de precio sin tendencia,非趋势价格摆动指标,デトレンディッド・プライス・オシレーター
Directional,اتجاهي,Directionnel,Ausgerichtet,Irányított,Direzionale,Direcional,Направленный,Direccional,方向,ディレクショナル
Disparity Index,مؤشر التفاوت,Indice de disparité,Disparitäts-Index,Diszparitási index,Indice disparità,Índice de disparidade,Индекс диспаритета,Índice de disparidad,差异指数,ディスパリティ・インデックス
Display,عرض,Afficher,Anzeige,Megmutat,Visualizza,Visualizar,Отображение,Visualizar,显示,表示
Display 1 Standard Deviation (1σ),عرض 1 الانحراف المعياري (1σ),Afficher 1 Écart-type (1σ),1 Standard-Abweichung (1σ) anzeigen,1. normál eltérést mutat (1σ),Mostra 1 deviazione standard (1σ),Exibir 1 Desvio-padrão (1σ),Отображать среднеквадратическое отклонение 1 (1σ),Mostrar desviación estándar 1(1σ),显示 1 标准偏差  (1σ),1標準偏差（1σ）を表示する
Display 2 Standard Deviation (2σ),عرض 2 الانحراف المعياري (2σ),Afficher 2 Écart-type (2σ),2 Standard-Abweichungen (1σ) anzeigen,2. normál eltérést mutat (2σ),Mostra 2 deviazione standard (2σ),Exibir 2 Desvios-padrão (1σ),Отображать среднеквадратическое отклонение 2 (2σ),Mostrar desviación estándar 2 (2σ),显示 2 标准偏差  (2σ),2標準偏差（2σ）を表示する
Display 3 Standard Deviation (3σ),عرض 3 الانحراف المعياري (3σ),Afficher 3 Écart-type (3σ),3 Standard-Abweichungen (1σ) anzeigen,3. normál eltérést mutat (3σ),Mostra 3 deviazione standard (3σ),Exibir 3 Desvios-padrão (1σ),Отображать среднеквадратическое отклонение 3 (3σ),Mostrar desviación estándar 3 (3σ),显示 3 标准偏差  (3σ),3標準偏差（3σ）を表示する
Display Average,عرض المتوسط,Afficher moyenne,Durchschnitt anzeigen,Átlagot mutat,Mostra media,Exibir a Média,Отображать среднее,Mostrar media,显示平均值,平均を表示する
Distance(%),مسافة (%),Distance (%),Distanz(%),Távolság (%),Distanza (%),Distância(%),Расстояние (%),Distancia(%),差距（%）,距離(%)
Divergence,الانحراف,Divergence,Abweichung,Divergencia,Divergenza,Divergência,Дивергенция,Divergencia,背离,ダイバージェンス
Don't see your study below? Type in your search here.,ألا ترى دراستك أدناه؟ اطبع البحث الخاص بك هنا.,Vous e voyez pas votre étude ci-dessous ? Tapez votre recherche ici.,Können Sie die unten angeführte Studie nicht sehen? Geben Sie hier Ihre Suche ein.,Nem látja a felmérését lent? Ide írja a keresett elemet.,Non trovi qui sotto lo studio che ti interessa? Digita qui per cercare.,Não encontra o seu estudo em baixo? Escreva a sua pesquisa aqui.,Не видите результатов своего анализа ниже? Впишите предмет Вашего поиска сюда.,¿No ve sus estudio más abajo? Introduzca aquí su término de búsqueda.,下方未看到您的研究？在此键入您的搜索。,調査結果が以下に見当たりませんか？こちらに検索ワードを入力してください。
Donchian Channel,قناة دونكان,Canal de Donchian,Donchian Channel,Donchian Channel,Donchian Channel,Canal Donchian,Канал Дончиана,Canal Donchian,唐奇安通道,ドンチャン・チャネル
Donchian High,دونكان مرتفع,Donchian Élevé,Donchian hoch,Donchian felső,Donchian High,Alto de Donchian,Канал Дончиана (высокий уровень),Donchian alto,唐奇安高点,ドンチャン高値
Donchian Low,دونكان منخفض,Donchian Faible,Donchian niedr.,Donchian alsó,Donchian Low,Baixo Donchian,Канал Дончиана (низкий уровень),Donchian bajo,唐奇安低点,ドンチャン安値
Donchian Median,دونكان متوسط,Donchian Médian,Donchian mittel,Donchian közép,Donchian Median,Médio Donchian,Канал Дончиана (медианный уровень),Donchian medio,唐奇安中位,ドンチャン中央値
Donchian Width,عرض دونكان,Valeur de Donchian,Donchian Width,Donchian szélesség,Ampiezza di Donchian,Largura Donchian,Ширина канала Дончиана,Amplitud Donchian,唐奇安宽度指标,ドンチャン幅
Done,تم,Terminé,Fertig,Kész,Fatto,Feito,Готово,Hecho,完成,完了
Doodle,شكل حر,Forme libre,Freiform,Szabad alakzat,Formato libero,Forma livre,Произвольной формы,Forma libre,自由形式,フリーフォーム
Double Exponential,الآسي المضاعف,Double Exponentiel,Doppelt exponentiell,Double Exponential,Doppio Esponenziale,Duplicar Exponencial,Двойная экспоненциальная,Exponencial doble,双指数,二重指数
Double Smoothing Period,فترات التنعيم المزدوجة %K,Période double de lissage,Doppelter Glättungszeitraum,Dupla kiegyenlítő időszak,Doppio periodi di lisciatura,Período de suavização dupla,Период двойного сглаживания,Período de uniformidad doble,双平滑期间,2重平滑期間
Down Volume,حجم هابط,Volume baissé,Weniger Volume,Lefelé haladó volumen,Down Volume,Descer volume,объем понижения,Volumen abajo,下降成交量,ダウン取引高
Downtrend,إتجاه منخفض,Tendance à la baisse,Abwärtstrend,Lefelé haladó trend,Downtrend,Tendência de baixar,Нисходящий тренд,Tendencia a la baja,下降趋势,下降トレンド
Draw,رسم,Dessinez,Zeichnen,Ábra,Disegna,Desenhar,Рисование,Dibujar,图画,描画
Ease of Movement,مؤشر سهولة الحركة,Facilité du mouvement,Ease of Movement,Mozgás könnyűsége,Ease of Movement,Facilidade de movimento,Легкость движения,Facilidad de movimiento,简易波动指标,動きやすさ
Edit,تعديل,Modifier,Bearbeiten,Szerkesztés,Modifica,Editar,Редактировать,Editar,编辑,編集
Edit Settings...,تحرير الإعدادات...,Modifiez les paramètres ...,Einstellungen bearbeiten,Beállítások szerkesztése...,Modifica le impostazioni…,Editar Configurações...,Изменить настройки…,Editar configuración…,编辑设置,設定を編集する…
EF,EF,EF,EF,EF,EF,EF,EF,EF,EF,EF
EF Trigger,محرك عامل تصفية الأحداث,EF Trigger,EF Auslöser,EF Trigger (EF küszöbérték),EF Trigger,EF Trigger,Триггер EF,Activador EF,EF触发器,EFトリガー
Ehler Fisher,إيلر فيشر,Ehler Fisher,Ehler Fisher,Ehler Fisher,Ehler Fisher,Ehler Fisher,Преобразование Фишера по Элерсу (EF),Ehler Fisher,埃勒斯费舍尔变换,エーラース・フィッシャー
Ehler Fisher Transform,مؤشر تحويل إيلر فيشر,Ehler Fisher Transform,Ehler Fisher Transform,Ehler Fisher Transform,Ehler Fisher Transform,Transformação Ehler Fisher,Преобразование Фишера,Transformación Ehler Fisher,埃勒斯费舍尔变换转化,エーラース・フィッシャー・トランスフォーム
Elder Bear Power,مؤشر القوة الهابطة الأكبر,Marge baissière Elder,Elder Bear Power,Elder medvereje,Elder Power ribassista,Potência Elder Bear,Сила медведей по Элдеру,Fuerza alcista (vendedor) de Elder,爱耳德空头力量指标,エルダー・ベア・パワー
Elder Bull Power,مؤشر القوة الصاعدة الأكبر,Marge haussière Elder,Elder Bull Power,Elder bikaereje,Elder Power rialzista,Potência Elder Bull,Сила быков по Элдеру,Fuerza bajista (comprador) de Elder,爱耳德多头力量指标,エルダー・ブル・パワー
Elder Force,مؤشر القوة الأكبر,Elder Force,Elder Force,Elder-erő,Elder Force,Força Elder,Индекс силы Элдера,Fuerza de Elder,爱耳德强力指标,エルダー・フォース
Elder Force Index,مؤشر القوة الأكبر,Indice Elder Force,Elder Force Index,Elder Force Index,Indice Elder Force,Índice de força Elder,Индекс силы Элдера,Índice de fuerza de Elder,爱耳德强力指数指标,エルダー・フォース指数
Elder Impulse System,نظام الدفاع الأكبر,Système Impulse Elder,Elder Impulse System,Elder impulzus rendszer,Sistema impulsi di Elder,Sistema de impulso ancião,Импульсная система Элдера,Sistema de impulso de Elder,较长的脉冲系统,エルダー・インパルス・システム
Elder Ray Index,مؤشر الشعاع الأكبر,Elder Ray,Elder Ray,Elder Ray,Elder Ray,Raio Elder,Луч Элдера,Rayo de Elder,爱耳德射线指标,エルダー線
Ellipse,قطع ناقص,Ellipse,Ellipse,Ellipszis,Ellisse,Elipse,Эллипс,Elipse,椭圆,楕円
ema,ema,ema,ema,ema,ema,ema,экспоненциальная скользящая средняя,ema,ema,指数平滑移動平均線
End of day data.,.البيانات من نهاية اليوم,Les données de la fin de la journée.,Daten von dem Ende des Tages.,Az adatok a nap végén.,I dati della fine della giornata.,Os dados a partir do final do dia.,Данные полученные в конце рабочего дня.,Los datos de la final del día.,从一天结束的数据。,一日の終わりからのデータ。
Enter box size and hit “Enter”,""ادخل حجم المربع واضغط على "إدخال",Entrez la taille du cadre et appuyez sur « Entrer »,Boxgröße eingeben und „Eingabetaste“ drücken,"Adja meg a négyzet méretét, majd Enter","Immetti la dimensione del riquadro e premi "Inserisci"","Introduzir tamanho da caixa e pressionar "Enter"",Введите размер окна и нажмите Enter,"Introduzca el tamaño de la casilla y pulse "Entrar"",输入方框尺寸并点击“回车”,ボックスサイズを入力して「入力する」を押す
Enter name of view:,ادخل اسم العرض:,Entrez le nom de la vue,Name der Vorlage eingeben:,Adja meg a nézet nevét:,Inserisci il nome della visualizzazione,Introduzir nome da visualização:,Введите название панели:,Introducir el nombre de la vista:,输入视图名称：,ビューの名前を入力する
Enter reversal and hit “Enter”,""ادخل انعكاس واضغط على "إدخال",Insérez l'inversion et appuyez sur « Entrer »,Stornierung eingeben und „Eingabetaste“ drücken,"Adja meg a visszatérést, majd Enter","Immetti l'inversione e premi "Inserisci"","Introduzir reverso e pressionar "Enter"",Введите точку разворота и нажмите Enter,"Introduzca retroceso y pulse "Entrar"",输入逆转并点击“回车”,反転を入力して「入力する」を押す
Enter Symbol,أدخل رمزًا,Saisir un symbole,Symbol eingeben,Szimbólum beírása,Inserisci simbolo,Introduza símbolo,Ввести символ,Introducir símbolo,输入符号,記号を入力
Enter value and hit “Enter”,""ادخل القيمة واضغط على "إدخال","Entrez la valeur et appuyez sur "Entrer"",Wert eingeben und „Eingabetaste“ drücken,"Adja meg az értéket, majd Enter","Immetti il valore e premi "Inserisci"","Introduzir valor e pressionar "Enter"",Введите значение и нажмите Enter,"Introduzca el valor y pulse "Entrar"Enter value and hit “Enter”",输入数值并点击“回车”,値を入力して「入力する」を押す
Events,أحداث,Événement,Ereignisse,Események,Eventi,Eventos,События,Eventos,事件,イベント
Exit Field,حقل الخروج,Sortir du champ,Ausstiegsfeld,Kilépő mező,Campo di uscita,Sair do campo,Выйти из поля,Campo de salida,退出领域,出口フィールド
Exponential,الآسي,Exponentiel,Exponentiell,Exponential,Esponenziale,Exponencial,Экспоненциальная,Exponencial,指数,指数
Extended Hours,الساعات الممتدة,Heures prolongées,Erweiterte Zeiten,Bővített órák,Orario prolungato,Horário Alargado,Расширенные часы,Horas prolongadas,延长时间,延長時間
Fade,متلاشي,Fictif,Schwächer,Fakó,Fade,Esbatimento,Угасание,Difuminado,衰退,フェード
Fake,مزيف,Faux,Falsch,Hamis,Fake,Falso,Фальсификация,Falso,伪装,フェイク
Fan,معجب,Fan,Fächer-Chart,Legyező,Ventola,Ventilador,Веер,Seguidor,扇形,ファン
Fast,سريع,Rapide,Schnell,Gyors,Fast,Rápido,Быстрый,Rápido,快速,速い
Fast MA Period,فترة المتوسط المتحرك السريع,Période rapide de la moyenne mobile,Schnelle MA-Periode,Gyors mozgóátlagú időszak,Periodo di media mobile veloce,Período MA rápido,Период быстрой скользящей средней,Período de media móvil rápida,快速移动平均线周期,速いMA期間
Fib Arc,أقواس فيبوناتشي,Arc Fib,Fib Arc,Fib ív,Arco Fib,Fib Arc,Дуга Фибоначчи,Fib Arc,Fib 弧形图,フィボナッチアーク
Fib Fan,مراوح فيبوناتشي,Éventail Fib,Fib Fan,Fib legyező,Ventaglio Fib,Fib Fan,Веер Фибоначчи,Fib Fan,Fib 扇形图,フィボナッチファン
Fib Time Zone,منطقة فيبوناتشي الزمنية,Intervalle de temps Fib,Fib Zeitzonen,Fib időzóna,Zona temporale Fib,Fuso Horário de Fib,Часовой пояс Фибоначчи,Fib de huso horario,Fib 时区,フィボナッチタイムゾーン
Fibonacci,فيبوناتشي,Fibonacci,Fibonacci,Fibonacci,Fibonacci,Fibonacci,Фибоначчи,Fibonacci,斐波那契数列,フィボナッチ
fibonacci,فيبوناتشي,Fibonacci,Fibonacci,fibonacci,Fibonacci,fibonacci,фибоначчи,fibonacci,斐波纳契,フィボナッチ
Field,المجال,Champ,Feld,Terület,Campo,Campo,Поле,Campo,域,分野
field,حقل,domaine,Feld,mező,Campo,campo,поле,campo,领域,フィールド
Fill,التعبئة,Fill,Füllung,Kitöltés,Riempimento,Preencher,Заполнение,Rellenar,填入,フィル
Focus Arrow,سهم التركيز,Flèche de mise en évidence,Fokus-Pfeil,Fókusznyíl,Freccia su bersaglio,Seta de foco,Сходящаяся стрелка,Flecha de foco,焦点箭头,注目矢印
Forecast,التنبؤ,Prévision,Prognose,Előrejelzés,Forecast,Previsão,Прогноз,Previsión,预测,予想
FOREX,فوركس,FOREX,DEVISEN,FOREX,FOREX,FOREX,ФОРЕКС,FOREX,外汇,FX
Formula courtesy,صيغة بفضل,Formule grâce à,Formel dank,Formula köszönhetően,Formula grazie a,Fórmula graças à,Формула благодаря,Fórmula gracias a,公式感谢,式のおかげで
Fractal Channel,قناة كسيرية,Fractal Canal,Fraktal Channel,Fractal Channel,Fractal Channel,Canal fraccionado,Канал фракталов,Canal fractal,分形通道,フラクタル・チャネル
Fractal Chaos,فوضة كسيرية,Chaos fractal,Fraktal Chaos,Fractal Chaos,Fractal Chaos,Caos fraccionado,Фрактал/хаос,Caos fractal,分形混沌,フラクタル・カオス
Fractal Chaos Bands,مؤشر حدود الفوضى الكسيرية,Valeurs chaos fractal,Fractal Chaos Bänder,Fractal Chaos szalagok,Bande Fractal Chaos,Bandas de caos fraccionadas,Полосы фрактала и хаоса,Bandas de caos fractales,分形混沌带,フラクタル・カオス・バンド
Fractal Chaos Oscillator,مذبذب الفوضى الكسيرية,Oscillateur chaos fractal,Fractal Chaos Oszillator,Fractal Chaos oszcillátor,Oscillatore Fractal Chaos,Oscilador de caos fraccionado,Осциллятор фракталов и хаоса,Oscilador de caos fractal,分形混沌摆动指标,フラクタル・カオス・オシレーター
Fractal High,كسيرية مرتفعة,Fractal Élevé,Fraktal hoch,Fractal magas,Fractal High,Alto fraccionado,Фрактал (высокий),Fractal alto,分形最高点,フラクタル高値
Fractal Low,كسيرية منخفضة,Fractal Faible,Fraktal niedrig,Fractal alacsony,Fractal Low,Baixo fraccionado,Фрактал (низкий),Fractal bajo,分形最低点,フラクタル安値
FUNDS,الأموال,FONDS,FONDS,ALAPOK,FONDI,FUNDOS,ФОНДЫ,FONDOS,基金,資金
FUTURES,العقود المستقبلية,FUTURE,FUTURES,FUTURES,FUTURE,FUTUROS,ФЬЮЧЕРСЫ,FUTUROS,期货,先物
FX,الفوركس,DEVISES,FX,FX,VALUTE,FX,ФОРЕКС,FX,外汇,FX
Gain,ربح,Profit ,Gewinn,Növekmény,Guadagno,Ganho,Прибыль,Ganancia,利润,利益
Gann Fan,مراوح جان,Éventail Gann,Gann Fan,Gann legyező,Ventaglio Gann,Gann Fan,Веер Ганна,Gann Fan,江恩角度线,ギャンファン
Garamond,Garamond,Garamond,Garamond,Garamond,Garamond,Garamond,Garamond,Garamond,Garamond 字体,Garamond
Gartley,غارتلي,Gartley,Gartley,Gartley,Gartley,Gartley,Гартли,Gartley,Gartley形态,ガートレイ
Gator,التمساح الأمريكي,Gator,Gator,Gator,Gator,Gator,Гатор,Gator,鳄鱼,ワニ
Gator Oscillator,مذبذب التمساح,Oscillateur de Gator,Gator Oszillator,Gator oszcillátor,Oscillatore Gator,Oscilador Gator,Осциллятор Гатор,Oscilador Gator,鳄鱼震荡指标,ゲーター・オシレーター
Generating Image,إنشاء صورة,Génération d'image,Bild generieren,Generating Image,Generazione Immagine,Criando Imagem,Идет создание изображения…,Generar imagen,生成图像,画像生成中
Ghost,شبح,Fantôme,Ghost,Szellem,Ghost,Fantasmas,Гост,Fantasma,幽灵,ゴースト
Ghost Boxes,صناديق الشبح,Boîtes à fantôme,Ghost-Boxes,Szellemdobozok,Ghost Box,Caixas fantasma,Области Госта,Cajas fantasma,幽灵盒,ゴースト・ボックス
Gopala,جوبال كريشنان,Gopala,Gopala,Gopala,Gopala,Gopala,Гопала,Gopala,高帕拉克里施南,ゴーパーラ
Gopalakrishnan Range Index,مؤشر نطاق جوبال كريشنان,Indice d'intervalle Gopalakrishnan,Gopalakrishnan Range Index,Gopalakrishnan tartományindex,Indice Gopalakrishnan Range,Índice de intervalo Gopalakrishnan,Индекс диапазона Гопалакришнана,Índice de rango Gopalakrishnan,高帕拉克里施南范围指标,ゴパラクリシュナン・レンジ指数
Gradient,المنحدر,Pente,Steigung,Gradiens,Gradiente,Gradiente,Градиент,Gradiente,斜率,グラデーション
Green,أخضر,Vert,Grün,Zöld,verde,Verde,Зеленый,Verde,绿色,グリーン
Grid Lines,خطوط الشبكة,Lignes de quadrillage,Gitterlinien,Rácsvonalak,Griglia,Linhas grelha,Линии сетки,Líneas de cuadrícula,网格线,グリッド線
H,س,H,Std,Ó,h,Hora,Ч,H,时,時間
harmonic,توافقي,harmonique,harmonisch,harmonikus,armonico,harmónica,гармонич.,armónico,谐波,ハーモニック
Heart,القلب,Cœur,Herz,Szív,Cuore,Coração,Сердечко,Corazón,心形,ハート
Heaviest Rate of Change Period,أثقل فترة لنسبة التغير,Taux le plus lourd de période de transition,Höchster Kurs des Änderungszeitraums,Az időszak amikor a legsúlyosabb a változás mértéke,Periodo con il tasso di variazione più pesante,Período de maior taxa de troca,Период тяжелейшей нормы изменений,Tasa más elevada de periodo de cambio,变化率最大期间,変動期間の最高レート
Heaviest SMA Period,أثقل فترة إس إم أيه,Taux le plus lourd de période de moyenne mobile simple,Höchster Kurs während des einfachen gleitenden Durchschnittszeitraums,Legsúlyosabb SMA-időszak,Periodo con SMA più pesante,Período maior de SMA,Период тяжелейшей простой скользящей средней,Periodo de SMA más elevado,最大SMA期间,最高SMA期間
Heavy Rate of Change Period,أثقل فترة لنسبة التغير,Taux lourd de période de transition,Hoher Kurs des Änderungszeitraums,Az időszak amikor súlyos a változás mértéke,Periodo con tasso di variazione pesante,Período de grande taxa de troca,Период тяжелой нормы изменений,Tasa elevada de periodo de cambio,变化率大期间,変動期間の高レート
Heavy SMA Period,أثقل فترة إس إم أيه,Période de moyenne mobile simple lourd,Hoher Kurs während des einfachen gleitenden Durchschnittszeitraums,Súlyos SMA-időszak,Periodo con SMA pesante,Período maior de SMA,Период тяжелой простой скользящей средней,Periodo de SMA elevado,大SMA期间,高SMA期間
Heikin Ashi,Heikin Ashi,Heikin Ashi,Heikin Ashi,Heikin Ashi,Heikin Ashi,Heikin Ashi,Хайкен Аши,Heikin Ashi,平均柱形,平均足
Heikin-Ashi,Heikin-Ashi ( شموع الهيكن اشي),Heikin-Ashi,Heikin-Ashi,Heikin-Ashi,Heikin-Ashi,Heikin-Ashi,Heikin-Ashi,Heikin-Ashi,平均酒吧,平均足
Helvetica,Helvetica,Helvetica,Helvetica,Helvetica,Helvetica,Helvetica,Helvetica,Helvética,Helvetica 字体,Helvetica
HHV/LLV Lookback,HHV/LLV مراجعة,HHV/LLV rétroviseur,HHV/LLV LookBack,HHV/LLV visszatekintés,Loookback HHV/LLV,HHV/LLV Lookback,Ретроспективный обзор HHV/LLV,HHV/LLV en retrospección,HHV/LLV回顾,HHV/LLV ルックバック
High,قمة,Maximum,Hoch,Maximum,Massimo,Alto,Максимум,Al alza,高,High
High Low,مرتفع منخفض,Élevé Faible,Hoch-Niedrig,Magas Alacsony,High Low,Máx. min.,Высокий/низкий,Alto Bajo,最高的最低价,ハイ・ロー
High Low Bands,مؤشر الحدود المرتفعة المنخفضة,Valeurs élevées et faibles,Hoch-Niedrig-Bänder,Felső alsó szalagok,Bande High Low,Bandas máx. min.,Высокие/низкие полосы,Bandas alto bajo,最高价最低价带,ハイ・ロー・バンド
High Low Bottom,مرتفع منخفض سفلي,Élevé Faible Bas,Hoch-Niedrig Unten,Magas Alacsony Alsó pont,High Low bottom,Máx. min. inferior,Высокий/низкий/минимальный,Alto Bajo inferior,最高的最低价底部,ハイ・ロー・ボトム
High Low Median,مرتفع منخفض متوسط,Élevé Faible Médian,Hoch-Niedrig Mitte,Magas Alacsony Közép,High Low median,Máx. Min. Mediano,Высокий/низкий/медианный,Alto Bajo medio,最高的最低价中位,ハイ・ロー中央値
High Low Top,مرتفع منخفض علوي,Élevé Faible Haut,Hoch-Niedrig Oben,Magas Alacsony Csúcs,High Low top,Máx. Min. Superior,Высокий/низкий/максимальный,Alto Bajo superior,最高的最低价顶部,ハイ・ロー・トップ
High Minus Low,مؤشر قياس معدل ارتفاع السلبية,Élevé Négatif Faible,Hoch-Minus-Niedrig,Magas mínusz alacsony,High Minus Low,Máx. menos min.,Высокий минус низкий,Alto menos Bajo,最高价减最低价,ハイ・マイナス・ロー
High Period,الفترة العليا,Période élevée,Hoher Zeitraum,Magas időszak,Periodo High,Período alto,Высокий период,Período alto,高位期间,高値期間
High-Low,مرتفع منخفض,Élevé Faible,Hoch-Niedrig,Magas-alacsony,High-Low,Máx. - min.,Высокий-низкий,Alto-Bajo,最高价-最低价,ハイ・ロー
high/low,قمة/قاع,plus haut/plus bas,Hoch/Tief,max/min,massimo/minimo,alta/baixa,максимум/минимум,alza/baja,高/低,ハイ／ロー
Highest High Value,مؤشر أعلى قيمة,Valeur élevée plus élevée,Höchster hoher Wert,Legmagasabb felső érték,Valore Highest Highe,Maior valor alto,Максимальное/высокое значение,Valor alto más alto,最高最高价,最高値
HighLow,مرتفع منخفض,Élevé Faible,HochNiedrig,FelsőAlsó,HighLow,MáxMin,Высокий/низкий,Alto/Bajo,最高价最低价,高低
Hist Vol,مؤشر التقلب التاريخي,Volatilité historique,Hist. Vol.,Történ Vol,Hist Vol,Volume histórico,Статистика волатильности,Vol. histórico,历史波动,過去の取引高
Histogram,الهيستوجرام,Histogramme,Histogramm ,Hisztogram,Istogramma,Histograma,Гистограмма,Histograma (Diagrama de barras),直方图,ヒストグラム
Historical Volatility,مؤشر التقلب التاريخي,Volatilité historique,Historische Volatilität,Történelmi volatilitás,Volatilità storica,Volatilidade histórica,Статистика волатильности,Volatilidad histórica,历史波动,ヒストリカル・ボラティリティ
Hollow Candle,الشموع المفرغة,Bougie creuse,Hohl Kerze,Üreges gyertya,Candela Vuote,Vela vazia,Полая свеча,Vela hueca,空心蜡烛,陽線ローソク足
Horizontal,أفقي,Horizontal,Horizontal,Vízszintes,Orizzontale,Horizontal,Горизонт.,Horizontal,水平,水平
Hull,الهيكل,coque,Hülle,Hull,Hull,Casco,Халл,Casco,Hull,Hull
I,مائل,I,K,D,I,I,К,C,斜体,イタリック体
Ichimoku Clouds,غيمة الإيتشيموكو,Ichimoku Clouds,Ichimoku-Charts,Ichimoku felhők,Ichimoku Clouds,Nuvens Ichimoku,Облака Ишимоку,Nubes de Ichimoku,一目均衡表,一目均衡表
Increasing Bar,شريط الصعود,Barre montante,Zunehmender Balken,Növekvő sáv,Barra crescente,Aumentando a barra,Столбец роста,Barra creciente,增加柱线,増加バー
Index,المؤشر,Indice,Index,Index,Indice,Índice,Индекс,Índice,指数,指数
INDEXES,المؤشرات,INDICES,INDIZES,INDEXEK,INDICI,ÍNDICES,ИНДЕКСЫ,ÍNDICES,指数,指数
INDICES,المؤشرات,INDICES,INDIZES,INDEXEK,INDICI,ÍNDICES,ИНДЕКСЫ,ÍNDICES,指数,指数
Info,معلومات,Info,Info,Infó,Info,Info,Информация,Información,信息,情報
Intercept,الاعتراض,Ordonnée,Unterbrechung,Metszet,Intercept,Intersetar,Отрезок,Intercepción,截距,インターセプト
Interval,فاصل زمني,Intervalle,Intervall,Intervallum,Intervallo,Intervalo,Интервал,Intervalo,间隔,間隔
Intraday Momentum Index,مؤشر الزخم الداخلي اليومي,Indice de dynamique intrajournalier,Intraday Momentum Index,Intraday (napon belüli) momentum index,Indice Intraday Momentum,Índice de momentum intradiário,Индикатор внутридневного импульса,Índice de momento intradía,日内动量指标,イントラデイ・モメンタム指数
Intraday Mtm,الزخم الداخلي اليومي,Dynamique intrajournalière,Intraday Dyn,Intraday Mtm,Intraday Mtm,Mtm intradiário,Внутридневной импульс,Momento intradía,日内动量,イントラデイ・モメンタム
Jaw,الفك,Mâchoire,Jaw,Jaw (Állkapocs),Jaw,Queixo,Синяя линия (челюсти аллигатора),Mandíbula,颌,アゴ
Jaw Offset,تعويض فك التمساح,Compensation mâchoire,Jaw Ausgleich,Jaw Offset (Állkapocs leállás),Compensazione Jaw,Offset queixo,Смещение синей линии,Compensación de mandíbula,颌抵消,ワニのアゴオフセット
Jaw Period,فترة فك التمساح,Période mâchoire,Jaw Zeitraum,Jaw Period (Állkapocs időszak),Periodo Jaw,Período queixo,Период усреднения синей линии,Período de mandíbula,颌周期,ワニのアゴ
Kagi,Kagi ( كاجي),Kagi,Kagi,Kagi,Kagi,Kagi,Kagi,Kagi,卡吉,ケーギ
Keltner,كيلتنر,Keltner,Keltner,Keltner,Keltner,Keltner,Канал Кельтнера,Keltner,肯特纳通道,ケルトナー
Keltner Bottom,كيلتنر سفلي,Keltner Bas,Keltner Unten,Keltner alsó pont,Keltner Bottom,Fundo Keltner,Канал Кельтнера (нижний уровень),Keltner inferior,肯特纳底部,ケルトナー・ボトム
Keltner Channel,مؤشر قناة كيلتنر,Canal de Keltner,Keltner Channel,Keltner Channel,Keltner Channel,Canal Keltner,Канал Кельтнера,Canal de Keltner,肯特纳通道,ケルトナー・チャネル
Keltner Median,كيلتنر متوسط,Keltner Médian,Keltner Mitte,Keltner közép,Keltner Median,Média Keltner,Канал Кельтнера (медианный уровень),Keltner medio,肯特纳中位,ケルトナー中央値
Keltner Top,كيلتنر علوي,Keltner Haut,Keltner Oben,Keltner csúcs,Keltner Top,Topo Keltner,Канал Кельтнера (верхний уровень),Keltner superior,肯特纳顶部,ケルトナー・トップ
Klinger,كلنجر,Klinger,Klinger,Klinger,Klinger,Klinger,Клингер,Klinger,克林格指标,クリンガー
Klinger Volume Oscillator,مذبذب حجم كلنجر,Oscillateur de volume de Klinger,Klinger Volume Oszillator,Klinger volumen oszcillátor,Oscillatore Klinger Volume,Oscilador de volume Klinger,Объемный осциллятор Клингера,Oscilador de volumen de Klinger,克林格成交量摆动指标,クリンガー取引高オシレーター
KlingerSignal,إشارات تداول كلنجر,Signal Klinger,KlingerSignal,KlingerJelzés,Segnale Klinger,KlingerSignal,Сигнал Клингера,Señal Klinger,克林格信号,クリンガーシグナル
KST,KST,KST,KST,KST,KST,KST,KST,KST,完全肯定指标,KST
KSTSignal,KST إشارة,Signal KST,KSTSignal,KST-jelzés,Segnale KST,KSTSignal,KSTSignal,Señal KST,KST信号,KSTSignal
Lagging Span,دورة أسوأ أداء,Échelonnée et retardée,Lagging Span,Lagging Span (Lemaradó táv),Lagging Span,Intervalo de liderança,Период отставания,Tramo rezagado,滞后扩展,ラギングスパン
Lagging Span Period,فترة دورة أسوأ أداء,Phase retardée et échelonnée,Lagging Span Zeitraum,Lagging Span Period (Lemaradó táv időszak),Periodo Lagging Span,Período de duração de lag,Период отставания,Período de tramo rezagado,滞后扩展周期,ラギングスパン期間
Leading Span A,الدورة أ الرائدة,Principale et échelonnée A,Leading Span A,Leading Span A (Vezető A táv),Leading Span A,Intervalo de liderança A,Период опережения A,Tramo A destacado,领先扩展A,リーディングスパンA
Leading Span B,الدورة ب الرائدة,Principale et échelonnée B,Leading Span B,Lading Span B (Vezető B táv),Leading Span B,Intervalo de liderança B,Период опережения B,Tramo B destacado,领先扩展B,リーディングスパンB
Leading Span B Period,فترة الدورة ب الرائدة,Phase principale et échelonnée B,Leading Span B Zeitraum,Leading Span B Period (Vezető B táv időszak),Periodo Leading Span B,Intervalo de liderança período B,Период опережения B,Período tramo B destacado,领先扩展B周期,リーディングスパンB期間
Level Offset,مستوى التوازن,Décalage de niveau,Niveau-Ausgleich,Szintek kiegyenlítése,Offset livello,Nivelar Offset,Смещение уровня,Desviación de nivel,位移,オフセット水準
Levels,مستويات,Niveaux,Niveaus,Szintek,Livelli,Níveis,Уровни,Niveles,水平,水準
Light Rate of Change Period,أخف فترة لنسبة التغير,Taux léger de période de transition,Niedriger Kurs während des Änderungszeitraums,Időszak amikor enyhe a változás mértéke,Periodo con tasso di variazione leggero,Período de baixa taxa de troca,Период легкой нормы изменений,Tasa baja de periodo de cambio,变化率小期间,変動期間の低レート
Light SMA Period,أخف فترة إس إم أيه,Période de moyenne mobile simple léger,Niedriger Kurs während des einfachen gleitenden Durchschnittszeitraums,Enyhe SMA-időszak,Periodo con SMA leggera,Período SMA baixo,Период легкой простой скользящей средней,Periodo de SMA bajo,小SMA期间,低SMA期間
Lightest Rate of Change Period,أخف فترة لنسبة التغير,Taux le plus léger de période de transition,Niedrigster Kurs des Änderungszeitraums,Az időszak amikor a legenyhébb a változás mértéke,Periodo con il tasso di variazione più leggero,Período de menor taxa de troca,Период легчайшей нормы изменений,Tasa más baja de periodo de cambio,变化率最小期间,変動期間の最低レート
Lightest SMA Period,أخف فترة إس إم أيه,Période de moyenne mobile simple la plus légère,Niedrigster Kurs während des einfachen gleitenden Durchschnittszeitraums,Legenyhébb SMA-időszak,Periodo con la SMA più leggera,Período SMA mais leve,Период легчайшей простой скользящей средней,Periodo de SMA más bajo,最小SMA期间,最低SMA期間
"Like all ChartIQ markers, the object itself is managed by the chart, so when you scroll the chart the object moves with you. It is also destroyed automatically for you when the symbol is changed.",كما هو الحال مع جميع علامات ChartIQ، يتم إدارة العنصر نفسه بواسطة الرسم البياني، لذلك عند تمرير الرسم البياني سيتحرك العنصر معك. كما سيتم حذف العنصر تلقائيا من المخطط عند تغيير الرمز.,"Comme tous les marqueurs ChartIQ, l'objet lui-même est géré par le graphique, donc lorsque vous faites défiler le graphique, l'objet se déplace avec vous. Il est également détruit automatiquement pour vous lorsque le symbole a changé.","Wie alle ChartIQ-Marker wird das Objekt selbst vom Chart verwaltet. Wenn Sie also im Chart scrollen, bewegt sich das Objekt mit Ihnen. Es wird auch automatisch für Sie zerstört, wenn das Symbol geändert wird.","Like all ChartIQ markers, the object itself is managed by the chart, so when you scroll the chart the object moves with you. It is also destroyed automatically for you when the symbol is changed.","Come tutti gli indicatori di ChartIQ, anche gli oggetti sono gestiti dal grafico, così quando lo fai scorrere, anche gli oggetti si muoveranno. Gli oggetti vengono automaticamente cancellati quando il simbolo cambia.","Como todos os comerciantes ChartIQ, o próprio objecto é gerido pelo gráfico e, como tal, quando você faz deslizar o gráfico, o objecto move-se consigo. Ele é também destruído, automaticamente, para si, quando o símbolo é alterado.","Как и в случае с остальными метками ChartIQ, объект привязан к графику; таким образом, при прокрутке графика он перемещается вместе с ним. Объект автоматически удаляется при смене инструмента.","Como todos los marcadores ChartIQ, el objeto se gestiona por el gráfico, por tanto cuando se desplaza por el gráfico, el objeto se mueve con usted. Se destruye automáticamente cuando se cambia el símbolo.",与所有ChartIQ标记一样，此对象本身由图表管理，所以当您滚动图表时，此对象会跟着一起移动。当符号发生变化时，它也会自动消失。,すべてのChartIQマーカー同様に、オブジェクト自体はチャートによって管理されるため、チャートをスクロールするとオブジェクトも一緒に動きます。シンボルを変更すると自動的に破棄されます。
Limit Move Value,قيمة تغير الحد,Valeur limite du mouvement,Limit Move Value,Mozgóértékhatár,Limit Move Value,Valor limite de movimento,Значение сдвига лимита,Valor del límite de movimiento,限制运行值,限定移動値
Lin Fcst,التنبؤ الخطي,Progression linéaire,Lin Prog,Lin előrejelz,Lin Fcst,Previsão de linha,Линейный прогноз,Prev. lineal,线性预测,線形予想
Lin Incpt,الاعتراض الخطي,Ordonnée linéaire,Lin Unterbr,Lin metsz,Lin Incpt,Lin Incpt,Секущая,Intercepción lin.,线性截距,線形インターセプト
Lin R2,مؤشر الانحدار معامل مربع التحديد (R2),R2 linéaire,Lin R2,Lin R2,Lin R2,Lin R2,Линейный R2,Lin R2,线性相关R2,線形R2
Line,الخطوط,Ligne,Linie,Vonal,Linea,Linha,Линия,Línea,曲线,線
Line Break,كسر خط,Saut de ligne,Leitungsbruch,Sortörés,Interruzione di riga,Quebra de linha,Разрыв строки,Salto de línea,线路中断,改行
Line/Bar Chart,الرسم البياني الخطي/البارات,Graphique en ligne/ bandes,Linien- und Barchart,Vonal-/oszlopdiagram,Grafico a linee/barre,Gráfico de Linha/Barra,Линейный или барный график,Gráfico de líneas/barra,线形/柱形图,ライン／バーチャート
Linear Reg Forecast,مؤشر تنبؤ الانحدار الخطي,Progression linéaire de l'indice Reg,Lineare Regression Prognose,Lineáris regresszió előrejelzés,Previsione nella regressione lineare,Previsão reg linear,Прогноз линейной регрессии,Previsión de reg. lineal,线性回归预测,線形回帰予想
Linear Reg Intercept,مؤشر اعتراض الانحدار الخطي,Ordonnée linéaire de l'indice Reg,Lineare Reg Unterbrechung,Lineáris regresszió metszet,Linear Reg Intercept,Interceção reg linear,Отрезок линейной регрессии,Interceptar reg. lineal,线性回归截距,線形回帰インターセプト
Linear Reg R2,مربع معامل تحديد (R2) الانحدار الخطي,Reg R2 linéaire,Lineare Reg R2,Lineáris regresszió R2,Linear Reg R2,reg linear R2,R2 линейной регрессии,Reg. lineal R2,线性回归相关系数R2,線形回帰R2
Linear Reg Slope,منحدر الانحدار الخطي,Pente linéaire de l'indice Reg,Lineare Reg Steigung,Lineáris regresszió lejtő,Linear Reg Slope,Inclinação reg linear,Наклон линейной регрессии,Pendiente de reg. lineal,线性回归斜率,線形回帰傾き
Lips,الشفتان,Lèvres,Lips,Lips (Ajkak),Lips,Lábios,Зеленая линия (губы аллигатора),Labios,唇,唇
Lips Offset,تعويض شفاة التمساح,Compensation lèvres,Lips Ausgleich,Lips Offset (Ajkak leállás),Compensazione Lips,Offset lábios,Смещение зеленый линии,Compensación de labios,唇抵消,ワニの唇オフセット
Lips Period,فترة شفاة التمساح,Période lèvres,Lips Zeitraum,Lips Period (Ajkak időszak),Periodo Lips,Período lábios,Период усреднения зеленой линии,Período de labios,唇周期,ワニの唇
Locale,الموقع,Locale,lokalisieren,Hely,Locale,Localidade,Локаль,Local,语境,位置特定する
Log Scale,المقياس اللوغارتمي,Logarithmique,Log-Skala,Logaritmikus beosztás,Scala Log,Logarítmica,Лог. шкала,Logaritmo,对数尺度,対数目盛
Long Cycle,دورة طويلة,Cycle long,Kauf Zyklus,Hosszú ciklus,Ciclo Lungo,Ciclo longo,Длинный цикл,Ciclo largo,长周期,長期サイクル
Long RoC,معدل التغيرات الطويل,RDC à long terme,Kauf RoC,Hosszú RoC,RoC lungo,RoC longo,Долговременная скорость изменения,RoC largo,做多变化率,長期変化率
Loss,خسارة,Perte,Verlust,Veszteség,Perdita,Perda,Убыток,Pérdida,损失,損失
Low,قاع,Minimum,Tief,Minimum,Minimo,Baixo,Минимум,A la baja,低,Low
Low Period,الفترة المنخفضة,Période creuse,Niedr. Zeitraum,Alacsony időszak,Periodo Low,Período baixo,Низкий период,Período bajo,低位期间,安値期間
Lowest Low Value,مؤشر أدنى قيمة,Valeur faible plus faible,Niedrigster niedriger Wert,Legalacsonyabb alsó érték,Lowest Low Value,Valor mais baixo dos baixos,Минимальное/низкое значение,Valor bajo más bajo,最低最低价,最安値
LR Slope,منحدر الانحدار الخطي,Pente linéaire de l'indice Reg,LR Steigung,LR lejtő,LR Slope,Declive LR,Наклон линейной регрессии,Pendiente LR,线斜率,線形回帰傾き
M,ش,M,MN,Hó,m,MINUTO,М,M,月,月
M Flow,السيولة,Flux monétaire,M Fluss,Pénzáramlás,Flusso M,Fluxo M,Денежный поток,Flujo M,现金流,マネーフロー
MA,MA,Moyenne mobile,MA,MA,Media mobile,MA,MA,MA,移动平均数,MA
ma,ma,moyenne mobile,M/A,mozgóátlag,media mobile,ma,скользящее среднее,ma,ma,移動平均線
MA Env,غلاف المتوسط المتحرك,Enveloppe de la moyenne mobile,MA Env,MÁ Boríték,MA Env,Env MA,Конверт скользящих средних,Sobre MM,移动平均线通道,移動平均エンベロープ
MA Env Bottom,أسفل غلاف المتوسط المتحرك,Enveloppe de la moyenne mobile Bas,MA Env Unten,MÁ Boríték Alsó pont,MA Env bottom,Env MA fundo,Конверт скользящих средних (минимальный),Sobre MM inferior,移动平均线通道底部,移動平均エンベロープ・ボトム
MA Env Median,متوسط غلاف المتوسط المتحرك,Enveloppe de la moyenne mobile Médian,MA Env Mitte,MÁ Boríték Közép,MA Env median,Env MA médio,Конверт скользящих средних (медианный),Sobre MM medio,移动平均线通道中位,移動平均エンベロープ中央値
MA Env Top,أعلى غلاف المتوسط المتحرك,Enveloppe de la moyenne mobile Haut,MA Env Oben,MÁ Boríték csúcs,MA Env top,Env MA Topo,Конверт скользящих средних (максимальный),Sobre MM superior,移动平均线通道顶部,移動平均エンベロープ・トップ
MA Period,MA فترة,Période moyenne mobile,MA-Zeitraum,MA időszak,Periodo MA (media mobile),Período MA,Период скользящей средней,Periodo MA,MA期间,MA 期間
MACD,MACD,MACD,MACD,MACD,MACD,MACD,MACD,MACD,移动平均汇聚背驰指标,MACD
Market Data,بيانات السوق,Données du marché,Marktdaten,Market Data,Dati di mercato,Dados de mercado,Данные рынка,Datos del mercado,市场数据,市場データ
Market Facilitation Index,مؤشر تسهيل السوق,Indice de facilitation du marché,Market Facilitation Index,Market Facilitation Index (Piackönnyítő index),Indice Market Facilitation,Índice de facilitação de mercado,Индекс облегчения рынка,Índice de facilitación de mercado,市场促进指数指标,市場簡素化指数
Mass Idx,مؤشر الكتلة,Indice de masse,Masse Idx,TömegIdx,Mass Idx,Índice de massa,Индекс массы,Índ. de masa,梅斯指标,マス指数
Mass Index,مؤشر الكتلة,Indice de masse,Masse-Index,Mass Index (Tömeg index),Indice Mass,Índice de massa,Индекс массы,Índice de masa,梅斯指标,マス指数
Maximum AF,معامل التسارع الأقصى,Fréquence audio maximale,Maximum AF,Maximum AF,Maximum AF,AF máximo,Макс. AF,AF máximo,最大AF,最大AF
mean,تعني,moyens,Mittelwert,középérték,mezzo,significado,среднее,significado,平均,意味する
Measure,مقياس,Mesure,Messen,Mérés,Misura,Medir,Измерить,Medir,测量,計測
Med Price,متوسط السعر,Prix médian,mit. Preis,Köz. ár,Med Price,Preço médio,Мед. цена,Precio med.,中位价格,中央値価格
median,متوسط,médiane,Median,medián,mediano,mediano,медиана,mediano,"中位数",中央値
Median Price,متوسط السعر,Prix médian,Mittlerer Preis,Közepes ár,Median Price,Preço médio,Медианная цена,Precio medio,中间价位指数,中央値価格
Min Tick Value,أدنى قيمة لأصغر حركة سعر,Valeur minimale de l'unité,Min Tick-Wert,Min Tick érték,Min Tick Value,Valor Tick min.,Минимальное значение тика,Valor mín. de marca,最小点数值,最小ティックバリュー
Minimum AF,معامل التسارع الأدني=ى,Fréquence audio minimale,Minimum AF,Minimum AF,Minimum AF,AF mínimo,Мин. AF,AF mínimo,最小AF,最小AF
Momentum,الزخم,Dynamique,Dynamik,Momentum,Momentum,Momentum,Темп,Momento,动量,モメンタム
Momentum Indicator,مؤشر الزخم,Indicateur de dynamique,Momentum-Indikator,Momentum mutató,Indicatore di momentum,Indicador de momentum,Индикатор темпа,Indicador de momento,动量,モメンタムインジケーター
Money Flow Index,مؤشر السيولة,Indicateur des flux monétaires,Geldfluss-Index,Pénzáramlás index,Money Flow Index,Índice de fluxo monetário,Индекс денежных потоков,Índice de flujo de dinero,资金流量指标,マネーフロー指数
More,المزيد,Plus,Mehr,Részletek,Di più,Mais,Еще,Ninguno,更多,詳細
More studies,مزيد من الدراسات,Plus d'études,Weitere Studien,További elemzések,Altri studi,Mais estudos,Другие исследования,Más estudios,更多研究……,詳細な研究
Mountain,جبل,Montagne,Berg,Hegyi,Montagna,Montanha,Гора,Montaña,山,マウンテン
Mountain Charts,مخططات الجبال,Graphiques en relief,Berg-Diagramme,Hegydiagramok,Grafici a montagna,Gráficos em forma de montanha,Графики в виде линий с заполнением,Gráficas de montaña,山峰图,マウンテンチャート
Mountain Color,الخط الجبلي,Couleur de la montagne,Farbschema Mountain,Hegy színe,Colore della montagna,Cor Montanha,Цвет Mountain,Color de la montaña,山的颜色,山の色
Mountain Color,لون الجبل,Couleur de la montagne,Farbe der Spitzen,Hegy színe,Colore della montagna,Cor de Montanha,Цвет Mountain,Color de montaña,山色,山の色
Moving Average,المتوسط المتحرك,Moyenne mobile,Gleitender Mittelwert,Mozgóátlag,Media mobile,Média móvel,Скользящее среднее,Media móvil,移动平均线,移動平均
Moving Average Deviation,انحراف المتوسط المتحرك,Déviation moyenne mobile,Moving Average Abweichung,Mozgóátlag eltérése,Deviazione della media mobile,Movendo o Desvio Médio,Отклонение скользящей средней,Desviación de la media variable,移动平均偏差,移動平均線偏差
Moving Average Envelope,غلاف المتوسط المتحرك,Enveloppe de moyenne mobile,Moving Average Envelope,Mozgóátlag boríték,Moving Average Envelope,Envelope média móvel,Конверт скользящих средних,Sobre de media móvil,移动平均线通道,移動平均エンベロープ
Moving Average Type,نوع المتوسط المتحرك,Type de moyenne mobile,Art des gleitenden Mittelwerts,Mozgóátlag típus,Tipologia media mobile,Tipo de média móvel,Тип скользящего среднего,Tipo de media móvil,移动平均线类型,移動平均タイプ
ms,ملي,ms,Ms,ms,ms,Milésima de segundo,мс,ms,毫秒,ミリセカンド
Multiplier,معامل الضرب,Multiplicateur,Multiplikator,Szorzó,Moltiplicatore,Multiplicador,Мультипликатор,Multiplicador,乘数,マルチプライヤー
Name,اسم,Nom,Name,Név,Nome,Nome,Имя,Nombre,名称,名称
Neg Vol,مؤشر الحجم السلبي,Volume négatif,Neg Vol,Neg Vol,Neg Vol,Vol neg,Отрицательный объем,Vol. negativo,负成交量,マイナス取引高
Negative Bar,عمود سلبي,Barre négative,Negativer Balken,Negatív bar,Barra negativa,Barra negativa,Отрицательная граница,Barra negativa,负柱,ネガティブバー
Negative Volume Index,مؤشر الحجم السلبي,Indice de volume négatif,Negative Volume Index,Negatív volumenindex,Indice Negative Volume,Índice de volume negativo,Индекс отрицательного объема,Índice de volumen negativo,负成交量指标,ネガティブ取引高指数
Neutral,محايد,Neutre,Neutral,Semleges,Neutrale,Neutro,Нейтральный,Neutral,中立,中立
New Custom Theme,نسق جديد مخصص,Nouveau modèle personnalisé,Neue individuelle Layouts,Új egyedi téma,Nuovo Tema Personalizzato,Novo tema personalizado,Создать пользовательскую тему,Nuevo tema personalizado,新自定义主题,新規カスタムテーマ
New Theme,مظهر جديد,Nouveau thème,Neues Thema,Új téma,Nuovo tema,Novo Tema,Новая тема,Tema nuevo,新主题,新しいテーマ
New Theme Name,اسم النسق الجديد,Nom du nouveau modèle,Neuer Layoutname,Új téma neve,Nome Nuovo Tema,Novo nome do tema,Название темы,Nombre del nuevo tema,新主题名称,新規テーマ名
New Theme Name:,اسم الموضوع الجديد:,Nouveau nom du thème :,Neuer Themenname:,Az új téma neve:,Nuovo nome del tema:,Novo nome do tema:,Название новой темы:,Nuevo nombre de tema:,新的主题名称：,新しいテーマ名：
Night,ليلي,Nuit,Nacht,Éjszaka,Notte,Noite,Ночь,Oscuro,夜晚,夜
None,لا شيء,Aucun,Keine,Nincs,Nessuno,Nenhum,Нет,Ninguno,没有,なし
None available,غير متاح,Indisponible,Nicht verfügbar,Nem elérhető,Nessuno disponibile,Nenhum disponível,Доступных вариантов нет,Ninguno disponible,无可提供,何もなし
Not enough data to compute,لا توجد بيانات كافية للحساب,Pas assez de données pour le calculer,Nicht genügend Daten zum Berechnen,Not enough data to compute,Dati non sufficienti per il calcolo,Dados insuficientes para processar,Недостаточно данных для вычисления,No existe suficientes datos para calcular,没有足够的数据进行计算,計算するデータが足りません
Offset,التعويض,Compenser,Ausgleich,Leállás,Compensazione,Offset,Офсет,Compensación,抵消,相殺
On Bal Vol,مؤشر أحجام التداول المتراكمة,Sur le volume du solde,Saldo Vol,On Bal Vol,On Bal Vol,Vol On Ball,Балансовый объем,Vol. en equilibrio,能量潮,オンバランス取引高
On Balance Volume,مؤشر أحجام التداول المتراكمة,Sur le volume du solde,On Balance Volume,On Balance volumen,On Balance Volume,Volume balanceado,Балансовый объем,Volumen en equilibrio,能量潮,オンバランス取引高
Open,الفتح,Ouverture,Eröffnung,Nyitott,Apertura,Abrir,Открытие,Abrir,开盘,オープン
Open shared chart in new window,افتح الرسم البياني الذي تم مشاركته في نافذة جديدة,Ouvrir le tableau partagé dans une nouvelle fenêtre,Geteilten Chart in neuem Fenster öffnen,Megosztott chart megnyitása új ablakban,Apri il grafico condiviso in una nuova finestra,Abrir o gráfico partilhado numa nova janela,Открыть опубликованный график в новом окне,Abrir la gráfica compartida en una nueva ventana,在新窗口中打开分享的图表,新しいウィンドウで共有チャートを開く
or,أو,ou,oder,vagy,o,ou,или,o,或者,もしくは
OverBought,مُبَالَغ في الشراء,Suracheté,Überkauft,Túlvásárolt,Ipercomprato,Sobrecompra,OverBought (перекупленность),Exceso compra,超买,買い持ち
Overlay,تراكب,Sus-jacent,Überlagern,Felső rész,Soprastante,Sobreposição,Основание,Superposición,覆盖图,オーバーレイ
OverSold,مُبَالَغ في البيع,Survendu,Überverkauft,Túlértékesített,Ipervenduto,Sobrevenda,OverSold (перепроданность),Exceso venta,超卖,売り持ち
P Rel,منسوب السعر,P Rel,P Rel,P Rel,P Rel,Rel P,Относительное значение цен,P rel.,价格相关,価格指数
Palatino,Palatino,Palatino,Palatino,Palatino,Palatino,Palatino,Palatino,Palatino,Palatino 字体,Palatino
Parabolic SAR,مؤشر التوقف والانعكاس,Parabolique SAR,Parabolic SAR,Parabolic SAR (Trend szerinti indikátor),Parabolic SAR,SAR parabólico,Параболическая система SAR,Sistema parabólico SAR,抛物线SAR,パラボリックSAR
Percent,نسبة مئوية,Pour cent,Prozent,Százalék,Percento,Por cento,Процент,Por ciento,百分比,パーセント
percent,نسبة مئوية,pour cent,Prozent,Százalék,percento,por cento,процент,por ciento,百分比,パーセント
Perf Idx,مؤشر الأداء,Indice de performance,Perf Idx,Teljesítm Idx,Perf Idx,Índice Perf,Индекс эффективности,Índ. de desempeño,性能指标,パフォーマンス指数
Performance Index,مؤشر الأداء,Indice de performance,Performance-Index,Teljesítményindex,Indice di Performance,Índice de desempenho,Индекс эффективности,Índice de desempeño,性能指标,パフォーマンス指数
Period,الفترة,Période,Periode,Időszak,Periodo,Período,Период,Período,周期,期間
pips,نقاط,pips,Pips,pontok,pips,pips,пипсы,Pips,基点,pip
Pitchfork,مذراة,Fourche,Gabel-Chart,Pitchfork,Pitchfork,Forquilha,Вилка,Horquilla,叉子,ピッチフォーク
Pivot,المحور,Pivot,Drehpunkt,Pivot,Pivot,Eixo,Разворот,Pivote,轴心,ピボット
Pivot Points,النقاط المحورية,Points pivots,Drehpunkte,Pivot pontok,Punti pivot,Pontos de rotação,Точки разворота,Puntos de pivote,轴心点,ピボットポイント
Plot Type,نوع الرسم البياني,Type de tracé,Darstellungsart,Tervtípus,Tipo di tracciato,Tipo de parcela,Тип схемы,Tipo de diagrama,作图类型,プロットタイプ
PMO,PMO,PMO,PMO,PMO,PMO,PMO,PMO,PMO,价格动量震荡指标,PMO
PMOSignal,إشارة بي إم أو,Signal PMO,PMOSignal,PMO-jelzés,Segnale PMO,PMOSignal,PMOSignal,Señal PMO,PMO信号,PMOSignal
Point & Figure,نقطة والشكل,Point & Figure,Point & Figure,Point & ábra,Point & Figure,Ponto & Figura,Точка & Рис,Punto y Figura,点与图,
Points,نقاط,Points,Punkte,Pont,Punti,Pontos,Точки,Puntos,点,ポイント
points,نقاط,points,Punkte,pont,punti,pontos,точки,puntos,点,ポイント
Points Or Percent,نقاط أو نسبة مئوية,Points ou pourcentage,Punkte oder Prozent,Pontok vagy százalék,Punti o percentuale,Pontos ou percentagem,Пункты или проценты,Puntos o Porcentaje,点数或百分比,ポイントまたはパーセント
Popular Studies,دراسات شائعة,Études générales,Populäre Studien,Népszerű elemzések,Studi più diffusi,Estudos populares,Популярные исследования,Estudios populares,受欢迎的研究,人気のある研究
Pos Vol,مؤشر الحجم الإيجابي,Volume positif,Pos Vol,Vol poz,Pos Vol,Vol pos,Волатильность позиций,Vol. positivo,正成交量,POS取引高
Positive Bar,عمود إيجابي,Barre positive,Positiver Balken,Pozitív bar,Barra positiva,Barra positiva,Положительная граница,Barra positiva,正柱,ポジティブバー
Positive Volume Index,مؤشر الحجم الإيجابي,Indice de volume positif,Positive Volume Index,Pozitív volumenindex,Indice Positive Volume,Índice de volume positivo,Индекс положительного объема,Índice de volumen positivo,正成交量指标,ポジティブ取引高指数
Press this button to generate a shareable image:,اضغط على هذا الزر لإنشاء صورة قابلة للمشاركة:,"Pour créer une image partageable, cliquez sur ce bouton:","Drücken Sie diese Taste, um ein teilbares Bild zu erzeugen:",Nyomja meg ezt a gombot megosztható kép készítéséhez:,"Per generare un'immagine condivisibile, clicca questo tasto:",Presione este botão para criar uma imagem partilhável:,"Нажмите эту кнопку, чтобы получить изображение, которым можно будет поделиться:",Pulse este botón para generar una imagen compartible:,按此按钮生成可共享的图像：,このボタンを押して共有可能な画像を生成する：
Pretty Good,جيد جدًا,Très bon,Ziemlich gut,Pretty Good,Pretty Good,Bastante bom,Pretty Good,Bastante bueno,棒极了,プリティ・グッド
Pretty Good Oscillator,مذبذب جيد جدًا,Oscillateur très bon,Ziemlich guter Oszillator,Pretty Good oszcillátor,Oscillatore Pretty Good,Oscilador PGO,Осциллятор Pretty Good,Oscilador bastante bueno,不错震荡指标,プリティ・グッド・オシレーター
Price,السعر,Prix,Preis,Ár,Prezzo,Preço,Цена,Precio,价格,価格
Price Minimum,السعر الأمثل,Prix minimum,Preisuntergrenze,Árminimum,Minimo del prezzo,Preço mínimo,Ценовой минимум,Precio mínimo,最低价,最低価格
Price Momentum Oscillator,مذبذب السعر,Oscillateur de dynamique de prix,Preis-Oszillator,Ár momentum oszcillátor,Oscillatore Price Momentum,Oscilador de momentum de preço,Ценовой моментум-осциллятор,Oscilador de momento de precios,价格势头震荡指标,プライス・モメンタム・オシレーター
Price Osc,مذبذب السعر,Oscillateur de prix,Preis Osz,Ároszcill,Price Osc,Osc preço,Осциллятор цены,Osc. de precio,价格震荡指标,価格オシレーター
Price Oscillator,مذبذب السعر,Oscillateur de prix,Preis-Oszillator,Ároszcillátor,Oscillatore Price,Oscilador de preço,Ценовой осциллятор,Oscilador de precio,价格震荡指标,プライス・オシレーター
Price Rate of Change,معدل التغيرات السعرية,Prix Taux de change,Preis Änderungsquote,Price Rate of Change (változás mértéke ár),Tasso di variazione del prezzo,Taxa de variação de preço,Скорость изменения цены,Precio tipo de cambio,价格变化率,価格変化率
Price Relative,منسوب السعر,Prix relatif,Relativer Preis,Árrelatív,Price Relative,Relativo de preço,Относительное значение цен,Precio relativo,价格相对指标,価格指数
Price ROC,معدل التغيرات السعرية,Prix RDC,Preis ROC,ROC ár,Price ROC,Preço ROC,Скорость изменения цены,Precio ROC,价格变化率,価格ROC
Price Vol,حجم السعر,Prix Volume,Preis Vol,Vol ár,Price Vol,Vol de preço,Волатильность цен,Vol. de precio,价格成交量,価格取引高
Price Volume Trend,اتجاه حجم السعر,Tendance du volume et des prix,Preis-Volumen-Trend,Árvolumen trend,Price Volume Trend,Tendência volume de preço,Тренд цены и объема,Tendencias de volumen de precio,价格成交量趋势,価格取引高トレンド
Prime Bands Bottom,أسفل الحدود الرئيسية,Bandes premières Bas,Prime Bänder Unten,Legjobb szalagok alsó pont,Bande Prime Bottom,Fundo bandas primárias,Полосы простых чисел (нижний уровень),Bandas primas inferiores,质数通道底部,プライム・バンド・ボトム
Prime Bands Channel,قناة الحدود الرئيسية,Bandes premières Canal,Prime Bänder Channel,Legjobb szalagok Channel,Bande Prime Channel,Canal bandas primárias,Канал полос простых чисел,Canal de bandas primas,质数带通道,プライム・バンド・チャネル
Prime Bands Top,أعلى الحدود الرئيسية,Bandes premières Haut,Prime Bänder Oben,Legjobb szalagok csúcs,Bande Prime Top,Topo bandas primárias,Полосы простых чисел (верхний уровень),Bandas primas superiores,质数通道顶部,プライム・バンド・トップ
Prime Number,الرقم الرئيسي,Nombre premier,Prime Anzahl,Prime Number (törzsszám),Prime Number,Número primo,Простое число,Número primo,质数,プライム・ナンバー
Prime Number Bands,حدود الأعداد الأولية,Bandes des nombres premiers,Primzahl-Bänder,Prime Number (törzsszám) szalagok,Prime Number Bands,Bandas de números primos,Полосы простых чисел,Bandas de número primo,质数通道,プライム・ナンバー・バンド
Prime Number Oscillator,مذبذب الأعداد الأولية,Oscillateur des nombres premiers,Primzahl-Oszillator,Prime Number (törzsszám) oszcillátor,Oscillatore Prime Number,Oscilador de número primo,Осциллятор простых чисел,Oscilador de número primo,质数震荡指标,プライム・ナンバー・オシレーター
Pring's Know Sure Thing,برينغز يعرف بالتأكيد,Know Sure Thing de Pring,Pring's Know Sure Thing,Pring Know Sure Thing oszcillátora,Indicatore Know Sure Thing di Pring,Pring sabe algo garantido,Индикатор Принга “Знать наверняка”,Oscilador “Know Sure Thing” de Pring,普林格确然指标,プリングのKST
Pring's Special K,خاص برينغز كيه,Spécial K de Pring,Pring's Special K,Pring Special K oszcillátora,Indicatore Special K di Pring,Special K da Pring,Индикатор Принга Special K,Oscilador “Special K” de Pring,普林格特殊K线,プリングの特殊K
Psychological Line,الخط النفسي,Seuil psychologique,Psychologische Linie,Pszichológiai vonal,Soglia psicologica,Linha Psicológica,Психологическая линия,Línea psicológica,心理线,心理的ライン
QStick,مؤشر قارئ الشموع اليابانية QStick,QStick,QStick,QStick,QStick,QStick,QStick,QStick,量化蜡烛线,Qスティック
Quadrant Lines,خطوط رباعية,Lignes cadrans,Quadrant-Linien ,Kvadráns vonalak,Linee quadranti,Linhas Quadrantes,Перпендикулярные линии,Líneas cuadrantes,四等分线,四分円ライン
Rainbow Moving Average,متوسط قوس قزح المتحرك,Moyenne mobile arc-en-ciel,Rainbow - gleitender Durchschnitt,Rainbow Moving átlag,Grafico media mobile ad arcobaleno,Média de movimento arco-íris,Радужная скользящая средняя,Media móvil Rainbow,彩虹移动平均值,虹色移動平均線
Rainbow Oscillator,قوس قزح المذبذب,Oscillateur arc-en-ciel,Rainbow-Oszillator,Rainbow oszcillátor,Oscillatore arcobaleno,Oscilador arco-íris,Радужный осциллятор,Oscilador Rainbow,彩虹震荡指标,レインボー・オシレーター
Random Walk,الحركة العشوائية,Random Walk,Random Walk,Random Walk,Random Walk,Percurso aleatório,Случайное блуждание,Camino aleatorio,随机漫步指标,ランダムウォーク
Random Walk High,الحركة العشوائية المرتفعة,Random Walk Élevé,Random Walk Hoch,Random Walk magas,Random Walk High,Alto percurso aleatório,Случайное блуждание (высокий уровень),Camino aleatorio alto,随机漫步最高点,ランダムウォーク高値
Random Walk Index,مؤشر الحركة العشوائية,Indice aléatoire,Random Walk Index,Random Walk Index,Indice Random Walk,Índice de percurso aleatório,Индекс случайного блуждания,Índice de camino aleatorio,随机漫步指标,ランダムウォーク指数
Random Walk Low,الحركة العشوائية المنخفضة,Random Walk Faible,Random Walk Tief,Random Walk alacsony,Random Walk Low,Baixo percurso aleatório,Случайное блуждание (низкий уровень),Camino aleatorio bajo,随机漫步最低点,ランダムウォーク安値
Range Bars,أعمدة,Barres d'amplitude,Balken-Bandbreite,Barok tartománya,Barre di intervallo,Barras de intervalo,Пределы диапазона,Barras de intervalo,范围柱,レンジバー
Range Selector,محدد النطاق,Sélecteur de la gamme,Wählknopf für Bereich,Tartományválasztó,Selettore della gamma,Seletor de Gama,Выбор диапазонов,Selector de rango,范围选择器,レンジセレクター
Rate Of Change,معدل التغير,Taux de change,Änderungsquote,Rate Of Change (Változás mértéke),Tasso di variazione,Taxa de mudança,Скорость изменения,Tipo de cambio,变化率指标,変化率
RAVI,RAVI,RAVI,RAVI,Tartományművelet Ellenőrző Index (RAVI),RAVI,RAVI,RAVI,RAVI,RAVI,RAVI
Ray,شعاع,Ray,Strahl,Sugár,Raggio,Raio,Луч,Rayo,射线,線
Rectangle,مستطيل,Rectangle,Rechteck,Téglalap,Rettangolo,Retângulo,Прямоугольник,Rectángulo,四边形,長方形
Redo,إعادة,Refaire,Wiederherstellen,Ismét,Rifai,Refazer,Вернуть,Volver a hacer,重做,やりなおす
Regression Line,خط الانحدار,Lignes de régression,Regressionslinie ,Regresszió vonal,Linea di regressione,Linha de Regressão,Регресионная линия,Línea de regresión ,回归线,回帰線
Rel Vig,مؤشر النشاط النسبي,Vigueur relative,Rel Vig,Rel Vig,Rel Vig,Vig rel,Относительная бодрость,Vig. rel.,相对能量指数指标,相対活性
Rel Vol,مؤشر التقلب النسبي,Volatilité relative,Rel Vol,Rel Vol,Rel Vol,Vol rel,Относительная волатильность,Vol. rel.,相关成交量,相対取引高
Relative Vigor Index,مؤشر النشاط النسبي,Indice de vigueur relative,Relative Vigor Index,Relative Vigor Index (Volatilitás viszonylagossági indexe),Indice Relative Vigor,Índice de vigor relativo,Индекс относительной бодрости,Índice de vigor relativo,相对能量指数指标,相対活性指数
Relative Volatility,التقلب النسبي,Volatilité relative,Relative Volatilität,Relatív volatilitás,Volatilità relativa,Volatilidade relativa,Относительная волатильность,Volatilidad relativa,相对波幅,相対ボラティリティ
RelVigSignal,إشارات مؤشر النشاط النسبي,Signal/Vigueur relative,RelVigSignal,RelVig-Jelzés,RelVigSignal,RelVigSignal,Сигнал относительной бодрости,Señal de vig. rel.,相对能量信号,相対活性シグナル
Renko,Renko ( رينكو),Renko,Renko,Renko,Renko,Renko,Renko,Renko,砖形图,蓮子
Resistance 1,المقاومة 1,Résistance 1,Widerstand 1,1. rezisztencia,Resistenza 1,Resistência 1,Устойчивость 1,Resistencia 1,压力1,抵抗線1
Resistance 2,المقاومة 2,Résistance 2,Widerstand 2,2. rezisztencia,Resistenza 2,Resistência 2,Устойчивость 2,Resistencia 2,压力2,抵抗線2
Resistance 3,المقاومة 3,Résistance 3,Widerstand 3,3 rezisztencia,Resistenza 3,Resistência 3,Устойчивость 3,Resistencia 3,压力3,抵抗線3
Result,النتيجة,Résultat,Ergebnis,Eredmény,Risultato,Resultado,Результат,Resultado,结果,結果
Retracement,الارتداد,Retracement,Rückverfolgung,Korrekció,Ritracciamento,Retração,Коррекция,Rebote,回调,リトレースメント
right-click to delete,انقر بزر الماوس الأيمن لإدارة,Faites un clic droit pour supprimer,Rechts klicken um zu löschen,kattintson jobb gombbal az egér hogy törölni,destro del mouse per cancellare,Botão direito do mouse para apagar,Щелкните правой кнопкой мыши чтобы удалить,botón derecho para borrar,右键单击鼠标删除,削除するには、右クリック
right-click to manage,انقر بزر الماوس الأيمن لحذف,Faites un clic droit pour gérer,Rechts klicken um zu verwalten,kattintson jobb gombbal az egér hogy kezelni,destro del mouse per gestire,Botão direito do mouse para gerenciar,Щелкните правой кнопкой мыши чтобы управлять,botón derecho para manejar,右键单击管理,管理するために、右クリック
Risk/Reward,مخاطرة/مكافأة,Risque/Récompense,Risiko/Chance,Kockázat/Díjazás,Rischio/Rendimento,Risco/recompensa,Риск/Вознаграждение,Riesgo/Recompensa,风险/回报,リスク/リワード
RSI,RSI,RSI,RSI,RSI,RSI,RSI,RSI,RSI,相对强弱指数,RSI
RSquared,معامل التحديد المربع,RSquared,RSquared,Rnégyzeten,RSquared,RSquared,R-квадрат,RSquared,R相关,決定係数
s,ث,s,Sec,mp,sec,segundo,с,s,秒,秒
save,حفظ,Sauvegarder,speichern,mentés,salva,guardado,сохранение,guardar,存档,保存
Save,حفظ,Sauvegarder,Speichern,Mentés,Salva,Guardar,Сохранить,Guardar,保存,保存する
Save Theme,حفظ النسق,Sauvegarder,Speichern,Téma mentése,Salva Tema,Guardar,Сохранить,Guardar,保存主题,テーマの保存
Save View,حفظ العرض,Sauvegardez la vue,Ansicht speichern,Nézet mentése,Salva visualizzazione,Guardar Visão,Сохранить отображение,Guardar visualización,保存视图,ビューを保存する
Saved View,عرض محفوظ,Vue sauvegardée,Gespeicherte Ansicht,Mentett nézet,Visualizzazione salvata,Visão Guardada,Сохраненные отображения,Visualización guardada,已保存的视图,保存したビュー
Saved Views,العروض المحفوظة,Vues sauvegardées ,Gespeicherte Vorlagen,Mentett nézetek,Visualizzazioni salvate,Visualizações Guardadas,Сохраненные панели,Guardar vistas,已保存视图,保存したビュー
Scale Factor,عامل التكبير,Facteur d'échelle,Skalierungsfaktor ,Skála tényező,Fattore di scala,Factor Escala,Фактор масштаба,Factor de escala,比例系数,目盛要素
Schaff,شاف,Schaff,Schaff,Schaff,Schaff,Schaff,Шафф,Schaff,沙夫指标,シャフ
Schaff Trend Cycle,دورة اتجاه شاف,Cycle de tendances Schaff,Schaff Trend-Zyklus,Schaff Trend Ciklus,Schaff Trend Cycle,Ciclo de tendência de Schaff,Трендовый цикл Шаффа,Ciclo de tendencia de Schaff,沙夫趋势周期,シャフ・トレンド・サイクル
Segment,قطاع,Segment,Segment,Szegmens,Segmento,Segmento,Сегмент,Segmento,细分,区切り
Select Tool,حدد أداة,Sélectionner Outil,Werkzeug,Eszköz,Seleziona,Selecionar,Выбор,Seleccionar,选择工具,選択ツール
Sell Stops,أوامر توقف البيع,Arrêts des ventes,Verkauf-Stopps,Stopok eladása,Ordini stop di vendita (Sell Stops),Vender paragens,Стопы на продажу,Paradas de venta,止损卖单,売り逆指値
Series,السلسلة,Série,Reihen,Sorozat,Serie,Séries,Серия,Series,系列,シリーズ
Set Point & Figure Parameters,تعيين معلمات النقطة والشكل,Définissez les paramètres des points et des figures,Point & Figure Parameter festlegen,Pont és ábra paraméterek beállítása,Imposta i parametri dei punti e delle figure,Definir Parâmetros de Ponto & Figura,Установка параметров точки и фигуры,Establecer puntos y parámetros de cifras,设定值和图形指数,ピボット設定&パラメータ計算
Set Price Lines,تعيين خطوط السعر,Définissez les lignes de prix,Preislinien festlegen,Árvonalak beállítása,Imposta le linee del prezzo,Definir Linhas de Preço,Установка линий цены,Establecer líneas de precios,设置价格线,価格ラインを設定する
Set Range,تعيين النطاق,Définissez la gamme,Range festlegen,Tartomány beállítása,Imposta la gamma,Definir Variação,Установка диапазона,Establecer rango,设置范围,設定範囲
Set Reversal Percentage,تعيين النسبة العكسية,Définissez le pourcentage d'inversion,Prozentuale Umkehr festlegen,Visszatérési százalék beállítása,Imposta la percentuale di inversione,Definir Percentagem de Reversão,Установка обратного процента,Establecer porcentaje de retroceso,设置逆转百分比,反転率を設定する
Settings,إعدادات,Paramètres,Einstellungen,Beállítások,Impostazioni,Configurações,Настройки,Configuración,设置,設定
Shading,الظل,Nuance,Schattierung,Különbözet megállapítása,Gradazione,Sombreamento,Незначительное понижение,Sombreado,暗影,シェーディング
Shape,شكل,Forme,Form,Alak,Forma,Forma,Форма,Forma,形状,パターン
Shape - Arrow,الشكل – سهم,Forme - Flèche,Form - Pfeil,Alakzat - Nyíl,Forma - Freccia,Forma - Seta,Фигура - Стрелка,Forma -Flecha,形状 – 箭头,形 - 矢印
Shape - Check,الشكل – فحص,Forme - Tique,Form - Karo,Alakzat - Pipa,Forma - Spunta,Forma - Verificar,Фигура - Галочка,Forma - Verificación,形状 – 打勾,形 - チェック
Shape - Cross,الشكل – تقاطع,Forme - Croix,Form - Kreuz,Alakzat - Kereszt,Forma - Croce,Forma - Cruzar,Фигура - Крест,Forma - Cruce,形状 – 十字,形 - クロス
Shape - Focus,الشكل – بؤرة التركيز,Forme - Focus,Form - Fokus,Alakzat - Fókusz,Forma - Focus,Forma - Foco,Фигура - Фокус,Forma - Centro,形状 – 焦点,形 - フォーカス
Shape - Heart,الشكل – قلب,Forme - Cœur,Form - Herz,Alakzat - Szív,Forma - Cuore,Forma - Coração,Фигура - Сердце,Forma - Corazón,形状 – 心形,形 - ハート
Shape - Star,الشكل – نجمة,Forme - Étoile,Form - Stern,Alakzat - Csillag,Forma - Stella,Forma - Estrela,Фигура - Звезда,Forma - Estrella,形状 – 星形,形 - 星
Share,شارك,Partager,Teilen,Megosztás,Condividi,Partilhar,Поделиться,Compartir,分享此图,共有
Share This Chart,شارك هذا المخطط,Partager ce graphique,Dieses Diagramm teilen,Diagram megosztása,Condividi questo grafico,Partilhar este gráfico,Поделиться этим графиком,Compartir esta gráfica,分享此图,このチャートを共有
Share Your Chart,شارك الرسم البياني,Partagez votre graphique,Chart teilen,Ossza meg grafikonját,Condividi il tuo grafico,Partilhar o Seu Gráfico,Поделиться графиком,Compartir su gráfico,分享您的图表,チャートを共有する
Shift,التحول,Déplacement,Verschieben,Eltolódás,Shift,Deslocação,Сдвиг,Giro,转换,シフト
Shift Percentage,نسبة التحول,Pourcentage de déplacement,Prozentsatz verschieben,Eltolódás százaléka,Percentuale di variazione,Percentagem de deslocamento,Процент заполнения,Porcentaje de giro,变换百分比,シフト割合
Shift Type,نوع التحول,Type de déplacement,Verschiebungsart,Eltolódás típusa,Shift Type,Tipo de desvio,Тип сдвигу,Tipo de giro,转换类型,シフトタイプ
Shinohara Intensity Ratio,معدل كثافة شينوهارا,Rapport d'intensité Shinohara,Shinohara Intensitätsverhältnis,Shinohara intenzitási arány,Rapporto di intensità Shinohara,Relação de Intensidade Shinohara,Коэффициент интенсивности Синохара,Radio de intensidad Shinohara,筱原强度比,篠原強弱レシオ
Short Cycle,دورة قصيرة,Cycle court,Kurzer Zyklus,Rövid ciklus,Ciclo corto,Ciclo curto,Короткий цикл,Ciclo corto,短周期,短期サイクル
Short RoC,معدل التغيرات القصير,RDC à court terme,Verkauf RoC,Rövid RoC,RoC corto,RoC curto,Кратковременная скорость изменения,RoC corto,做空变化率,短期変化率
Show All,إظهار الكل,Afficher Tout,Alle anzeigen,Mindet megmutat,Mostra tutti,Mostrar tudo,Показать все,Mostrar todo,显示所有,全部表示
Show Fractals,عرض فركتلات,Afficher fractales,Fraktale anzeigen,Fraktálok megmutat,Mostra frattali,Mostrar fractais,Показать фракталы,Mostrar fractales,显示分形,ディスプレイフラクタル
Show Zones,عرض المناطق,Afficher des zones,Zonen anzeigen,Zónák megjelenítése,Mostra Zone,Mostrar zonas,Показать зоны,Mostrar zonas,显示区域,ゾーンの表示
Signal,إشارة التداول,Signal,Signal,Jelzés,Segnale,Sinalização,Сигнал,Señal,信号,シグナル
Signal Period,فترة إشارات التداول,Période du signal,Signal-Periode,Jelző értékű időszak,Periodo di segnale,Período de sinalização,Период сигнала,Período de señal,信号周期,シグナル期間
Signal Periods,فترات إشارات التداول,Périodes du signal,Signal-Perioden,Jelző értékű időszakok,Periodo di segnale,Períodos de sinalização,Периоды сигнала,Períodos de señal,信号周期,シグナル期間
Simple,البسيط,Simple,Einfach,Simple,Semplice,Simples,Обыкновенная,Simple,简单,単純
Simple Circle,دائرة بسيطة,Cercle simple,Einfacher Kreis,Egyszerű kör,Cerchio semplice,Círculo Simples,Обыкновенная окружность,Círculo simple,简单圆形,単純円
Simple Square,مربع بسيط,Carré simple,Einfaches Quadrat,Egyszerű négyzet,Quadrato semplice,Praça Simples,Обыкновенный квадрат,Cuadrado simple,简单的广场,単純正方形
Simulated data.,بيانات المحاكاة.,Données simulées.,Simulierte Daten.,Szimulált adatok.,Dati simulati.,Dados simulados.,Симуляция данных,Datos simulados.,模拟数据,模擬データ
Slope,منحدر,Pente,Steigung,Lejtő,Slope,Declive,Наклон,Pendiente,斜率,傾き
Slow,بطئ,Lent,Langsam,Lassú,Slow,Lento,Медленный,Lento,慢速,遅い
Slow MA Period,فترة المتوسط المتحرك البطيء,Période lente de la moyenne mobile,Langsame MA-Periode,Lassú mozgóátlagú időszak,Periodo di media mobile lento,Período MA lento,Период медленной скользящей средней,Período de media móvil lenta,慢速移动平均线周期,遅いMA期間
SMA1,SMA1,SMA1,SMA1,SMA1,SMA1,SMA1,SMA1,SMA1 (Media móvil simple 1),简单移动平均线1,SMA1
SMA10,SMA10,SMA10,SMA10,SMA10,SMA10,SMA10,SMA10,SMA10,简单移动平均线10,SMA10
SMA2,SMA2,SMA2,SMA2,SMA2,SMA2,SMA2,SMA2,SMA2,简单移动平均线2,SMA2
SMA3,SMA3,SMA3,SMA3,SMA3,SMA3,SMA3,SMA3,SMA3,简单移动平均线3,SMA3
SMA4,SMA4,SMA4,SMA4,SMA4,SMA4,SMA4,SMA4,SMA4,简单移动平均线4,SMA4
SMA5,SMA5,SMA5,SMA5,SMA5,SMA5,SMA5,SMA5,SMA5,简单移动平均线5,SMA5
SMA6,SMA6,SMA6,SMA6,SMA6,SMA6,SMA6,SMA6,SMA6,简单移动平均线6,SMA6
SMA7,SMA7,SMA7,SMA7,SMA7,SMA7,SMA7,SMA7,SMA7,简单移动平均线7,SMA7
SMA8,SMA8,SMA8,SMA8,SMA8,SMA8,SMA8,SMA8,SMA8,简单移动平均线8,SMA8
SMA9,SMA9,SMA9,SMA9,SMA9,SMA9,SMA9,SMA9,SMA9,简单移动平均线9,SMA9
Smooth,ناعم,Smooth,Glatt,Egyenletes,Smooth,Suave,Плавный,Uniforme,平滑,スムーズ
Smoothing Period,فترة التنعيم,Période de lissage,Glättungszeitraum,Kiegyenlítő időszak,Periodo di lisciatura,Período de nivelamento,Период сглаживания,Período de uniformidad,平滑周期,スムージング期間
Speed Resistance Arc,قوس مقاومة السرعة,Arc de résistance de la vitesse,Speed Widerstand Arc,Sebesség-ellenállás ív,Arco di resistenza della velocità,Arco de Resistência Velocidade,Дуга сопротивления,Arco de resistencia a la velocidad,速阻弧形线,スピードレジスタンスアーク
Speed Resistance Line,خط مقاومة السرعة,Ligne de résistance de la vitesse,Speed Widerstandslinie,Sebesség-ellenállás vonal,Linea di resistenza della velocità,Linha de Resistência Velocidade,Линия сопротивления,Línea de resistencia a la velocidad,速阻线,スピードレジスタンスライン
SPY,SPY,VOYANT,SPION,SPY,SPIA,ESPIÃO,SPY,SPY,SPY,SPY
Squarewave,Squarewave (موجة مربعة),Squarewave,Rechteck,Négyszögjel,Quadra,Squarewave,Squarewave,Ola Cuadrada,方波,方形
squarewave,موجة مربع,onde carrée,Rechteck,négyzethullám,onda quadra,squarewave,прямоугольник,onda cuadrada,方波,方形波
Squat,عشوائي,Squat,Kompakt,Zömök,Squat,Squat,Проседание,Asentado,蛰伏,スクワット
standard,قياسي,standard,Standard,normál,standard,padrão,стандартный,estándar,标准,標準
Standard Deviation,الانحراف المعياري,Écart type,Standardabweichung,Standard szórás,Deviazione standard,Desvio-padrão,Среднеквадратичное отклонение,Desviación estándar,时序预测,標準偏差
Standard Deviations,الانحرافات المعيارية,Écarts types,Standardabweichungen,Standard szórások,Deviazione standard,Desvios-padrão,Среднеквадратичные отклонения,Desviaciones estándar,标准差,標準偏差
Star,نجمة,Étoile,Stern,Csillag,Stella,Estrella,Звездочка,Estrella,星形,スター
STARC Bands,فروقات ستارك,Bandes STARC,STARC-Bänder,STARC sávok,Bande di STARC,Bandas STARC,STARC-полосы,Bandas STARC,标准差,STARC バンド
STARC Bands Bottom,أسوء فرق ستارك,Bandes STARC Bas,STARC-Bänder Min,Alsó STARC sávok,Bande STARC inferiori,Fundo de bandas STARC,Нижняя STARC-полоса,Valor inferior de bandas STARC,斯塔克带中间值,STARC バンド下限
STARC Bands Median,فرق متوسط ستارك,Bandes STARC Milieu,STARC-Bänder Mittel,Középső STARC sávok,Bande STARC mediane,Mediana de bandas STARC,Медиана STARC-полос,Mediana de bandas STARC,ATR带通道,STARC バンド中値
STARC Bands Top,أفضل فرق ستارك,Bandes STARC Haut,STARC-Bänder Max,Felső STARC sávok,Bande STARC superiori,Topo de bandas STARC,Верхняя STARC-полоса,Valor superior de bandas STARC,斯塔克带底部值,STARC バンド上限
Stch Mtm,مؤشر الزخم العشوائي,Dynamique stochastique,Stch Dyn,Stch Mtm,Stch Mtm,Stch Mtm,Стохастический темп,Mom. est.,随机动量,ストキャスティック・モメンタム
STD Dev,الانحرافات المعيارية,Écart type,STD Abw,STD szórás,STD Dev,STD Dev,Ср-квадр отклонение,Desv. EST.,标准差,標準偏差
STD Period,الفترة المعيارية,Période type,STD Zeitraum,STD időszak,STD Period,Período STD,Базисный период,Período STD,标准周期,STD期間
Stochastic Momentum Index,مؤشر الزخم العشوائي,Indice de dynamique stochastique,Stochastic Momentum Index,Sztochasztikus momentum index,Indice Stochastic Momentum,Índice Momentum estocástico,Индекс стохастического темпа,Índice de momento estocástico,随机动量指标,ストキャスティック・モメンタム指数
Stochastics,مؤشر الاستوكاستك,Stochastique,Stochastik,Sztochasztika,Stocastici,Estocásticos,Стохастика,Estocástico,随机指标,ストキャスティクス
STOCKS,الأسهم,ACTIONS,AKTIEN,RÉSZVÉNYEK,AZIONI,TÍTULOS,АКЦИИ,ACCIONES,股票,株式
Stop Levels,مستويات التوقف,Nveaux d'arrêt,Stopp-Niveaus,Szintek leállítása,Livelli di stop,Níveis de paragem,Уровни остановки,Niveles de límite,止位,ストップ水準
Stop Loss,وقف الخسارة,Stop Loss,Stop Loss,Stop loss,Stop Loss,Parar com perda,Стоп-лосс,Límite de pérdidas,止损,ストップロス
Stops,توقفات,Arrêts,Stopps,Stopok,Stop,Paragens,Стопы,Paradas,止损,ストップ
Strong Ratio,نسبة قوية,Rapport fort,Hohe Quote,Erős arány,Rapporto forte,Ratio Forte,Сильное соотношение,Ratio sólido,强比例,強い比率
Studies,دراسات,Études,Studien,Elemzések,Studi,Estudos,Моделирование,Estudios,研究,スタディ
Study,الدراسة,Étude,Studien,Mutató,Studio,Estudo,Аналитика,Estudio ,研究,スタディー
Supertrend,إتجاه مرتفع,Supertendance,Supertrend,Szupertrend,Supertrend,Supertendência,Супертренд,Supertendencia,超级趋势,スーパートレンド
Support 1,الدعم 1,Support 1,Unterstützung 1,1. támogatás,Supporto 1,Suporte 1,Поддержка 1,Soporte 1,支撑1,支持線1
Support 2,الدعم 2,Support 2,Unterstützung 2,2. támogatás,Supporto 2,Suporte 2,Поддержка 2,Soporte 2,支撑2,支持線2
Support 3,الدعم 3,Support 3,Unterstützung 3,3. támogatása,Supporto 3,Apoio 3,Поддержка 3,Soporte 3,支撑3,支持線3
Swing,التأرجح,Swing,Oszillation,Swing,Swing,Oscilação,Колебания,Oscilación,摆动,スイング
Swing Index,مؤشر التأرجح,Indice Swing,Oszillation-Index,Swing Index,Indice Swing,Índice de oscilação,Индекс колебаний,Índice de oscilación,时序预测,スイング指数
Symbol,الرمز,Symbole,Symbol,Szimbólum,Simbolo,Símbolo,Символ,Símbolo,用户名,シンボル
T,تيك,T,Tick,T,T,Marcar,Т,T,时间,ティック
Take Profit,الحصول على الربح,Faire des bénéfices,Take Profit,Profitfelvétel,Take Profit,Recolher lucros,Тейк-профит,Límite de ganancias,止盈,テイクプロフィット
Teeth,الأسنان,Dents,Teeth,Teeth (Fogak),Teeth,Dentes,Красная линия (зубы аллигатора),Dientes,牙,歯
Teeth Offset,تعويض أسنان التمساح,Compensation dents,Teeth Ausgleich,Teeth Offset (Fogak leállás),Compensazione Teeth,Offset dentes,Смещение красной линии,Compensación de dientes,牙抵消,ワニの歯オフセット
Teeth Period,فترة أسنان التمساح,Période dents,Teeth Zeitraum,Teeth Period (Fogak időszak),Periodo Teeth,Período dentes,Период усреднения красной линии,Período de dientes,牙周期,ワニの歯
Themes,المظاهر,Thèmes,Themen,Témák,Temi,Temas,Темы,Temas,主题,テーマ
This is a callout marker,هذه علامة شرح,Ceci est un marqueur de callout,Dies ist ein Markierstift für Beschriftungen,Ez egy ábrafelirat jelölő,Questo è un marker di callout,Este é um marcador de callout,Маркер элемента,Este es un marcador de referencia,这是一个标注标记,こちらはコールアウトマーカーです
"This is an example of a complex marker which can contain html, video, images, css, and animations.",هذا مثال على احدى العلامات المركبة والتي يمكن أن تحتوي على ملف html، فيديو، صور، css، ورسوم متحركة.,"Ceci est un exemple de marqueurs complexes, qui peut contenir html, vidéo, images, animations et css","Dies ist ein Beispiel für eine komplexe Markierung, die html, Videos, Bilder, CSS und Animationen enthalten kann.","Ez egy komplex jelölő példája, amely html-t, videót, képeket, css-t és animációkat tartalmazhat.","Questo è un esempio di marker complesso, che può contenere html, video, immagini, css e animazioni","Este é um exemplo de um marcador complexo que pode conter animações, vídeo, imagens, css e html.","Пример сложного маркера, содержащего html, видео, изображения, css или анимацию.","Este es un ejemplo de un marcador complejo que puede contener html, video, imágenes, css y animaciones.",这是一个可包含 HTML、视频、图像、CSS 和动画的复杂标记示例。,こちらはhtmlやビデオ、画像、css、アニメーションを含めることが可能な複雑マーカーです。
TII,TII,TII,TII,TII,TII,TII,TII,TII,TII,TII
Time Cycle,دورة الوقت,Temps de cycle,Zykluszeit,Időciklus,Ciclo temporale,Ciclo de Tempo,Временной круг,Ciclo de tiempo,时间周期,時間サイクル
Time Fcst,التنبؤ الزمني,Progression dans le temps,Zeit Prog,Idő előrejelz,Time Fcst,Previsão de tempo,Временной прогноз,Prev. de tiempo,时间预测,時間予想
Time Series,السلاسل الزمنية,Des séries chronologiques,Zeitfolgen,Time Series,Serie Temporali,Séries Cronológicas,Периоды,Series de tiempo,时间序列,一連の時間
Time Series Forecast,توقعات مجموعة الوقت,Prévision des séries chronologiques,Zeitreihenanalyse,Idősorok előrejelzés,Previsione su serie temporali,Previsão de tempo das series,Временной прогноз,Pronóstico de evolución temporal,摆动指标,時系列予想
Time Zone,التوقيت الزمني,Fuseau horaire,Zeitzone,Időzóna,Fuso orario,Fuso horário,Часовой пояс,Zona horaria,时区,時間帯
Times New Roman,Times New Roman,Time New Roman,Times New Roman,Times New Roman,Time New Roman,Times New Roman,Times New Roman,Times New Roman,新罗马字体,Times New Roman
Timezone,المنطقة الزمنية,Plage horaire,Zeitzone,Időzóna,Fuso orario,Fuso horário,Часовой пояс,Zona horaria,时区,タイムゾーン
Tirone Levels,مستويات تايرون,Niveaux  Tirone,Tirone Niveaus,Tirone szintek,Livelli di Tirone,Níveis de Tirone,Уровни Тирона,Niveles de Tirone,泰龙水平线,タイロンレベル
To set your timezone use the location button below or scroll through the following list,لتعيين النطاق الزمني الخاص بك، استخدم زر الموقع أدناه أو انتقل خلال القائمة الآتية,Pour indiquer votre fuseau horaire veuillez utiliser le bouton Emplacement ci-dessous ou parcourir la liste suivante,Zur Einstellung Ihrer Zeitzone können Sie unten auf die die Standort-Schaltfläche klicken oder durch die folgende Liste scrollen,Időzónájának beállításához használja az alábbi helymegjelölő gombot vagy gördítse le az alábbi listát,Per impostare il tuo fuso orario usa il pulsante ubicazione che segue o fai scorrere l'elenco che segue,Para definir o seu fuso horário utilize o botão de localização abaixo ou navegue pela lista seguinte,Для установки часового пояса используйте расположенную внизу кнопку местоположения или прокрутите следующий список,Para fijar su zona horaria utilice el botón de ubicación de abajo o desplácese por la siguiente lista,使用上面的位置按钮或滚动查看跟踪清单设置你的时间区域,タイムゾーンを設定するには、以下のロケーションボタンを使用するか、以下のリストをスクロールしてください
"To set your timezone use the location button below, or scroll through the following list...",لتعيين منطقتك الزمنية استخدم زر الموقع أدناه، أو مرر من خلال القائمة التالية ...,"Pour définir votre fuseau horaire, utilisez le bouton de localisation ci-dessous ou faites défiler la liste suivante …","Um Ihre Zeitzone einzustellen, benutzen Sie bitte die unten angeführten Standorttaste oder scrollen Sie durch die folgende Liste…","Az időzóna beállításához használja az alábbi Hely gombot, vagy görgessen le a következő listán...","Per impostare il Suo fuso orario, utilizzi il tasto di localizzazione qui sotto o scorra l'elenco seguente…",Para definir o uso do seu fuso horário no botão de localização abaixo ou percorrer a lista seguinte...,"Для установки часового пояса воспользуйтесь кнопкой "Местоположение" или выберите пояс из списка...","Para establecer su huso horario, utilice el botón de localización inferior, o desplácese a lo largo de la lista siguiente…",要设置您的时区，使用下面的位置按钮，或者滚动浏览以下列表...,タイムゾーンを設定するには、以下のロケーションボタンを使用するか、以下のリストをスクロールしてください…
Tolerance Percentage,نسبة التحمل,Pourcentage de tolérance,Toleranzprozentsatz,Tolerancia százalék,Percentuale di tolleranza,Percentagem de tolerância,Погрешность в процентах,Porcentaje de tolerancia,容忍百分比,許容率
Trade Vol,حجم التداول,Volume de trading,Handelsvol,Ügylet vol,Trade Vol,Vol de negócios,Объем торговли,Volumen de operaciones,交易量,取引高
Trade Volume Index,مؤشر حجم التداول,Indice de volume de transactions,Handelsvolumen-Index,Kereskedelmi volumenindex,Indice Trade Volume,Índice de volume de negócios,Индекс торгового объема,Índice de volumen de operaciones,交易量指标,取引高指数
Trend Intensity Index,مؤشر كثافة الاتجاه,Indice d'ntensité de la tendance ,Trendidensitätsindex,Trend intenzitás index,Indice di intensità della tendenza,Índice de Intensidade de Tendência,Индекс интенсивности тренда,Índice de intensidad de tendencia,趋势强度指数,トレンドの強弱指数
Triangular,الثلاثي,Triangulaire,Dreieckig,Triangular,Triangolare,Triangular,Треугольная,Triangular,三角,三角形
Triple Exponential,الآسي الثلاثي,Triple Exponentiel,Dreifach exponentiell,Triple Exponential,Triplo Esponenziale,Triplicar Exponencia,Тройная экспоненциальная,Exponencial triple,三重指数,三重指数
TRIX,TRIX,TRIX,TRIX,TRIX,TRIX,TRIX,TRIX,TRIX,TRIX,TRIX
True Range,مؤشر المد الحقيقي,Gamme réelle,True Range,Igaz tartomány,True Range,Intervalo real,Истинный диапазон,rango verdadero,真实范围,トゥルー・レンジ
Twiggs,تويجز,Twiggs,Twiggs,Twiggek,Twiggs,Twiggs,Твиггс,Twiggs,TMF现金流量指标,ツウィッグス
Twiggs Money Flow,مؤشر السيولة تويجز,Flux monétaire Twiggs,Twiggs Money Flow,Twiggs pénzáramlat,Twiggs Money Flow,Fluxo monetário Twiggs,Индекс денежных потоков Твиггса,Flujo de dinero de Twiggs,TMF现金流量指标,ツウィッグス・マネーフロー
Type,النوع,Type,Art,Típus,Tipologia,Tipo,Тип,Tipo,类型,種類
Typical Price,السعر النموذجي,Prix type,Typischer Preis,Jellemző ár,Typical Price,Preço típico,Типичная цена,Precio típico,典型价格,標準価格
Ulcer Index,مؤشر ألسر,Indice Ulcer,Ulcer-Index,Ulcer index,Indice dell'ulcera,Índice Ulcer,Индекс Ульцера,Índice Ulcer,终极波动指数,アルサー・インデックス
Ultimate,المطلق,Principal,Zuletzt,Végső,Ultimo,Ultimar,Окончательный,Definitivo,终极震荡指标,アルティメット
Ultimate Oscillator,المذبذب المطلق,Oscillateur principal,Ultimate Oscillator,Végső oszcillátor,Oscillatore Ultimate,Derradeiro oscilador,Окончательный осциллятор,Oscilador definitivo,终极震荡指标,アルティメット・オシレーター
Underlay,طبقة تحتية,Sous-couche,Grundlage,Süppedés,Substrato,Subjacente,Под кривой,Subyacente,基础,アンダーレイ
Undo,تراجع,Annulez,Rückgängig machen,Visszavonás,Annulla,Retroceder,Отменить,Deshacer,撤销,取り消す
Units,الوحدات,Unités,Einheiten,Egységek,Unità,Unidades,Единицы,Unidades,单位,単位
Unrealized Gain/Loss,ربح/خسارة محققة,Gain/perte non réalisé,Nicht realisierter Gewinn/Verlust,Nem realizált nyereség/veszteség,Guadagni/perdite non realizzate,Ganhos/perdas não realizadas,Нереализованная прибыль/убыток,Ganancias/pérdidas no realizadas,未实现收益/亏损,未実現利益/損失
Up Volume,حجم صاعد,Volume augmenté,Mehr Volumen,Felfelé haladó volumen,Up Volume,Subir volume,Объем повышения,Volumen arriba,上升成交量,アップ取引高
Uploading Image,جاري تحميل الصورة,Téléchargement de l'image,Bild hochladen,Uploading Image,Caricamento Immagine,Carregando Imagem,Идет загрузка изображения…,Cargar imagen,上传图片,画像アップロード中
Uptrend,إتجاه عالي,Tendance à la hausse,Aufwärtstrend,Felfelé haladó trend,Uptrend,Tendência de aumentar,Восходящий тренд,Tendencia al alza,上升趋势,上昇トレンド
Use My Current Location,استخدم موقعي الحالي,Utiliser mon emplacement actuel,Meinen aktuellen Standort verwenden,Használja a Saját jelenlegi helymeghatározást,Usa la mia ubicazione corrente,Utilizar a minha localização atual,Использовать мое текущее местоположение,Usar mi ubicación actual,使用我的当前位置,現在のロケーションを使用する
Use the following link to share your chart:,استخدم الرابط التالي لمشاركة رسمك البياني,Utilisez le lien suivant pour partager votre tableau,Verwenden Sie den nachfolgenden Link\u002c um Ihren Chart zu teilen,A chart megosztásához használja az alábbi hivatkozást,Usa il link seguente per condividere il tuo grafico,Utilize a seguinte ligação para partilhar o seu gráfico,Для публикации Вашего графика используйте следующую ссылку,Utilizar el siguiente enlace para compartir su gráfica,使用下列链接分享你的图表,次のリンクを使ってチャートを共有してください
Use Volume,الاستفادة من حجم التداول,Utiliser Volume,Ausnutzen Volume,Hasznosítani volumen,Utilizzare Volume,Utilize volume,объем Использование,Utilizar Volumen,利用卷,ボリュームを利用し
Valuation Lines,خطوط التقييم,Directives d'évaluation,Bewertungslinien,Értékelő vonalak,Linee di valutazione,Linhas de Avaliação,Линии оценки,Líneas de valoración,价值线,評価ライン
Variable,المتغير,Variable,Variabel,Variable,Variabile,Variável,Переменная,Variable,变量,変数
Vchart,رسم تخطيطي مرئي,Vchart,Vchart,Vdiagram,grafico V,Vchart,Vchart,Gráfica V,成交量图,Vチャート
vdma,VDMA,vdma,Vdma,vdma,vdma,vdma,vdma,vdma,vdma,vdma
Vertical,عمودي,Vertical,Vertikal,Függőleges,Verticale,Vertical,Вертикаль,Vertical,垂直的,縦
Vertical Horizontal Filter,عامل التصفي العمودي الأفقي,Filtre horizontal et vertical,Vertical Horizontal Filter,Függőleges vízszintes szűrő,Filtro verticale orizzontale,Filtro horizontal vertical,Вертикальный/горизонтальный фильтр,Filtro vertical horizontal,成交量图,垂直水平フィルター
VIDYA,VIDYA,VIDYA,VIDYA,VIDYA,VIDYA,VIDYA,VIDYA,VIDYA,VIDYA,VIDYA
Views,العروض,Vues,Vorlagen,Nézetek,Visualizzazioni,Visualizações,Панели,Vistas,视图,ビュー
Vol,الحجم,Vol,Vol,Vol,Vol,Vol,Объем,Vol.,交易量,ボリューム
Vol Osc,مذبذب الحجم,Oscillateur de volume,Vol Osz,Vol oszc,Vol Osc,Osc vol,Объемный осциллятор,Osc. vol.,成交量震荡指标,取引高オシレーター
vol profile,ملف الحجم,profil du volume,vol Profil,vol profil,vol profile,Perfil do vol,профиль объемов,Perfil vol.,成交量特点,取引高プロフィール
Vol ROC,معدل التغير الحجمي,Volume RDC,Vol ROC,ROC vol,Vol ROC,Vol ROC,Скорость изменения объема,Vol. ROC,成交量变化率,取引高ROC
vol undr,حجم أدنى,vol undr,vol undr,vol undr,vol undr,vol abai,vol undr,Debajo vol.,成交量下置,取引高アンダー
Volume,الحجم,Volume,Volumen,Volumen,Volume,Volume,Объем,Volumen,成交量,取引高
Volume % of Avg,متوسط الحجم %,% de moyenne volume,Volumen in % des Durchschnitts,Átlag %-nak volumene,% di volume della media,Percentagem de volume na média,Объем % от среднего,% de volumen de la media,平均成交量%,平均出来高（%）
Volume Candle,شمعة الحجم,Volume en chandelle,Volumen Kerzenchart,Haladó gyertya,Grafico a Candele Volumetrico,Vela de volume,Объемная свеча,Vela de volumen,成交量K线图,出来高ローソク足
Volume Chart,الرسم البياني للحجم,Graphique des volumes,Volumen-Chart,Volumen chart,Grafico volumi,Gráfico de volume,Схема оборотов,Gráfica de volumen,十字过滤线,出来高チャート
Volume Not Available,الحجم غير متوفر,Volume non disponible,Volume nicht verfügbar,Volume Not Available,Volume non disponibile,Volume Não Disponível,Объем недоступен,Volumen no disponible,该卷不可用,ボリュームは利用できません
Volume Oscillator,مذبذب الحجم,Oscillateur de volume,Volume Oscillator,Volumenoszcillátor,Oscillatore Volume,Oscilador de volume,Объемный осциллятор,Oscilador de volumen,成交量震荡指标,取引高オシレーター
Volume Profile,مؤشر ملف الحجم,Volume Profil,Volumen Profil,Volumenprofil,Profilo Volume,Perfil do volume,Профиль объемов,Perfil de volumen,成交量特点,取引高プロフィール
Volume Rate of Change,معدل التغير الحجمي,Volume Taux de change,Volumen Änderungsquote,Volume Rate of Change (volumen változás mértéke),Tasso di variazione del volume,Taxa de variação de volume,Скорость изменения объема,Volumen de tipo de cambio,成交量变化率,取引高変化率
Volume Spike,حجم سبايك,Volume Spike,Volumen Höchstwert,Volumen kicsúcsosodás,Spike dei volumi,Pico de volume,“Шпилька” объема,Punta de volumen,柱状成交量,出来高スパイク
Volume Underlay,مؤشر أساس حجم التداول,Volume intégré,Volumen-Underlay,Vol Underlay,Volume Underlay,Vol subjacente,Объем под кривой,Vol. subyacente,成交量下置,取引高アンダーレイ
Vortex Indicator,مؤشر Vortex,Indicateur de Vortex,Vortek Indikator,Vortex indikátor,Indicatore di vortice,Indicador de Vórtice,Индикатор Vortex,Indicador Vortex,漩涡指示器,渦巻きインジケーター
VT HZ Filter,عامل التصفية العمودي الأفقي,Filtre VT HZ,VT HZ Filter,VT HZ szűrő,VT HZ Filter,Filtro VT HZ,Верт/гор фильтр,Filtro VT HZ,VT HZ过滤线,垂直水平フィルター
VWAP,VWAP,VWAP,VWAP,VWAP,VWAP,VWAP,VWAP,VWAP (Precio promedio ponderado por volumen),成交量加权平均价,VWAP
W,أ,S,W,Hé,s,Semanal,Н,S,周,週
W Acc Dist,مؤشر التوزيع المتراكم ويليامز,Accumulation/Distribution de Williams,W Acc Dist,W felhalm eloszt,W Acc Dist,W Acc Dist,Индикатор накопления/распределения Уильямса,Dist. A acu.,累积摆动距离,W集積分布
Weak Ratio,نسبة ضعيفة,Faible rapport,Schwache Quote,Gyenge arány,Rapporto debole,Ratio Fraca,Слабое соотношение,Ratio débil,弱比例,弱い比率
weekly,أسبوعي,hebdomadaire,wöchentlich,heti,settimanale,semanal,недельный,semanal,每周,ウィークリー
Weighted,الموزون,Pondéré,Gewichtet,Weighted,Pesata,Ponderado,Взвешенная,Pesado,加权重,加重
Weighted Close,مؤشر الإغلاق المرجح,Clôture pondéré,Gewichteter Abschluss,Súlyozott zárás,Chiusura ponderata,Peso próximo,Взвешенная цена закрытия,Cierre ponderado,权重收盘价,加重終値
Welles Wilder,ويلز وايلدر,Welles Wilder,Welles Wilder,Welles Wilder,Welles Wilder,Welles Wilder,Уэллс Уалдер,Welles Wilder,Welles Wilder,Welles Wilder
White,أبيض,Blanc,Weiß,Fehér,Bianco,Branco,Белая,Blanco,白色,白
Williams %R,مؤشر ويليامز %R,Williams %R,Williams %R,Williams %R,Williams %R,Williams %R,%R Уильямса,Williams %R,威廉指标,ウィリアムズ %R
Your timezone is your current location,منطقتك الزمنية تتبع موقعك الحالي,Votre fuseau horaire est votre position actuelle,Ihre Zeitzone ist Ihr aktueller Standort,Az Ön időzónája a jelenlegi tartózkodási helye,Il tuo fuso orario è la tua posizione attuale,O seu fuso horário é a sua localização actual,Часовой пояс соответствует текущему местоположению,Su huso horario es su ubicación actual,您的时区即您当前的位置,お客様のタイムゾーンとは、お客様の現在の場所です
YTD,حتى تاريخه,années jusqu'à aujourd'hui,YTD,ÉVES SZINTEN,anni a oggi,YTD,С начала года,HLF,最近的一年,年度初めから今日まで
ZigZag,زجزاج,ZigZag,ZickZack,ZigZag,ZigZag,ZigZag,Зигзаг,ZigZag,锯齿状,ZigZag*/});


	/**
	 * This object will be created by {@link CIQ.I18N.convertCSV} based on the provided 'CSV formatted' string,
	 * or you can set it explicitly if not using {@link CIQ.I18N.setLanguage} or {@link CIQ.I18N.convertCSV}
	 * @memberOf CIQ.I18N
	 * @type {Object}
	 * @example
	 * // sample of object with translations for Arabic and Spanish
	 * ( when setting explicitly without using CIQ.I18N.setLanguage or CIQ.I18N.convertCSV )
	 * CIQ.I18N.wordLists={
	 * 		"ar":{
	 *			"1 D": "1ي",
	 *			"1 Hour": "1 ساعة",
	 *			"1 Min": "1د",
	 *			"1 Mo": "1ش",
	 *			"1 W": "أ1",
	 *			"1 hour": "ساعة واحدة",
	 *			"1d": "1يوم",
	 *			"1m": "1شهر",
	 *			"1y": "1عام",
	 *			"3m": "3أشهر"
	 *		},
	 * 		"es":{
	 * 			"1 D": "1 D",
	 * 			"1 Hour": "1 Hora",
	 * 			"1 Min": "1 Min",
	 * 			"1 Mo": "1 Mes",
	 * 			"1 W": "1 S",
	 * 			"1 hour": "1 hora",
	 * 			"1d": "1d",
	 * 			"1m": "1m",
	 * 			"1y": "1a",
	 * 			"3m": "3m"
	 *		}
	 * }
	 */
	CIQ.I18N.wordLists={
			"en":{}
	};

	return _exports;
});
