// Copyright 2014-2016 by ChartIQ, Inc.

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

	CIQ.I18N.csv=CIQ.I18N.hereDoc(function(){/*!en,ar,fr,de,hu,it,pu,ru,es,zh,ja
Chart,الرسم البياني,Graphique,Darstellung,Diagram,Grafico,Gráfico,График,Gráfica,图表,チャート
Chart Style,أسلوب الرسم البياني,Style de graphique,Darstellungsstil,Diagram stílusa,Stile grafico,Estilo do gráfico,Тип графика,Estilo de gráfica,图表类型,チャート形式
Candle,الشموع,Bougie,Kerze,Gyertya,Candela,Vela,Свеча,Vela,蜡烛,ローソク足
Shape,شكل,Forme,Form,Alak,Forma,Forma,Форма,Forma,形状,パターン
Retracement,الارتداد,Retracement,Rückverfolgung,Korrekció,Ritracciamento,Retração,Коррекция,Rebote,回调,リトレースメント
Fan,معجب,Fan,Fächer-Chart,Legyező,Ventola,Ventilador,Веер,Seguidor,扇形,ファン
Arc,قوس,Arc,Bogen,Ív,Arco,Arco,Дуга,Arco,弧形,アーク
Time Zone,التوقيت الزمني,Fuseau horaire,Zeitzone,Időzóna,Fuso orario,Fuso horário,Часовой пояс,Zona horaria,时区,時間帯
Arrow,السهم,Flèche,Pfeil,Nyíl,Freccia,Seta,Стрелка,Flecha,箭头,矢印
Heart,القلب,Cœur,Herz,Szív,Cuore,Coração,Сердечко,Corazón,心形,ハート
Cross,الصليب,Croix,Kreuz,Kereszt,Croce,Cruz,Крест,Cruz,叉,クロス
Check,شيك,Vérifier,Häkchen,Ellenőrzés,Segno di spunta,Verificação,Галочка,Comprobar,勾,チェック
Focus Arrow,سهم التركيز,Flèche de mise en évidence,Fokus-Pfeil,Fókusznyíl,Freccia su bersaglio,Seta de foco,Сходящаяся стрелка,Flecha de foco,焦点箭头,注目矢印
Star,نجمة,Étoile,Stern,Csillag,Stella,Estrella,Звездочка,Estrella,星形,スター
Compare,مقارنة,Comparer,Vergleichen,Összehasonlítás,Confronta,Comparar,Сравнить,Comparar,比较,比較
Measure,مقياس,Mesure,Messen,Mérés,Misura,Medir,Измерить,Medir,测量,計測
Fibonacci,فيبوناتشي,Fibonacci,Fibonacci,Fibonacci,Fibonacci,Fibonacci,Фибоначчи,Fibonacci,斐波那契数列,フィボナッチ
Vertical,عمودي,Vertical,Vertikal,Függőleges,Verticale,Vertical,Вертикаль,Vertical,垂直的,縦
Ray,شعاع,Ray,Strahl,Sugár,Raggio,Raio,Луч,Rayo,射线,線
Continuous,متصل,Continu,Durchgehend,Állandó,Continuo,Contínuo,Непрерывный,Continuo,连续线,連続的
Rectangle,مستطيل,Rectangle,Rechteck,Téglalap,Rettangolo,Retângulo,Прямоугольник,Rectángulo,四边形,長方形
Ellipse,قطع ناقص,Ellipse,Ellipse,Ellipszis,Ellisse,Elipse,Эллипс,Elipse,椭圆,楕円
Doodle,شكل حر,Forme libre,Freiform,Szabad alakzat,Formato libero,Forma livre,Произвольной формы,Forma libre,自由形式,フリーフォーム
Current Symbols,الرموز الحالية,Symboles actuels,Aktuelle Symbole,Aktuális szimbólumok,Simboli correnti,Símbolos atuais,Используемые символы,Símbolos actuales,当前符号,現在の記号
Add,إضافة,Ajouter,Hinzufügen,Hozzáadás,Somma,Adicionar,Добавить,Añadir,添加,追加
Correlation,ترابط,Corrélation,Korrelation,Korreláció,Correlazione,Correlação,Корреляция,Correlación,相关,相関関係
Stops,توقفات,Arrêts,Stopps,Stopok,Stop,Paragens,Стопы,Paradas,止损,ストップ
Clear,مسح,Régler,Löschen,Törlés,Cancella,Limpar,Очистить,Borrar,清除,消去
None available,غير متاح,Indisponible,Nicht verfügbar,Nem elérhető,Nessuno disponibile,Nenhum disponível,Доступных вариантов нет,Ninguno disponible,无可提供,何もなし
Enter Symbol,أدخل رمزًا,Saisir un symbole,Symbol eingeben,Szimbólum beírása,Inserisci simbolo,Introduza símbolo,Ввести символ,Introducir símbolo,输入符号,記号を入力
ALL,الكل,TOUT,ALLE,ÖSSZES,TUTTI,TUDO,ВСЕ,TODO,全部,全て
STOCKS,الأسهم,ACTIONS,AKTIEN,RÉSZVÉNYEK,AZIONI,TÍTULOS,АКЦИИ,ACCIONES,股票,株式
FOREX,فوركس,FOREX,DEVISEN,FOREX,FOREX,FOREX,ФОРЕКС,FOREX,外汇,FX
INDICES,المؤشرات,INDICES,INDIZES,INDEXEK,INDICI,ÍNDICES,ИНДЕКСЫ,ÍNDICES,指数,指数
COMMODITIES,السلع,MATIÈRES PREMIÈRES,ROHSTOFFE,ÁRUCIKKEK,MATERIE PRIME,PRODUTOS,ТОВАРЫ,MATERIAS PRIMAS,商品,商品
1 D,يوم واحد,1J,1 d,1 N,1 D,1 D,1 D,1 D,1天,1日
1 W,أسبوع واحد,1S,1 w,1 H,1 W,1 S,1 W,1 S,1週,1週
1 Mo,1 م و,1 Mo,1 M.,1 hónap,1 Mese,1 Mo,1 мес.,1 mes,1 修改,1月
1 Min,دقيقة واحدة,1 Min,1 min,1 perc,1 Min,1 Min,1 мин,1 Min.,1分钟,1分
5 Min,5 دقائق,5 Min,5 min,5 perc,5 Min,5 Min,5 мин,5 Min.,5分钟,5分
10 Min,10 دقائق,10 Min,10 min,10 perc,10 Min,10 Min,10 мин,10 Min.,10分钟,10分
15 Min,15 دقيقة,15 Min,15 min,15 perc,15 Min,15 Min,15 мин,15 Min.,15分钟,15分
30 Min,30 دقيقة,30 Min,30 min,30 perc,30 Min,30 Min,30 мин,30 Min.,30分钟,30分
1 hour,ساعة واحدة,1 Heure,1 h,1 óra,1 ora,1 hora,1 ч,1 hora,1小时,1時間
4 hour,4 ساعات,4 Heures,4 h,4 óra,4 ore,4 horas,4 ч,4 horas,4小时,4時間
Period,الفترة,Période,Periode,Időszak,Periodo,Período,Период,Período,周期,期間
Field,المجال,Champ,Feld,Terület,Campo,Campo,Поле,Campo,域,分野
Type,النوع,Type,Art,Típus,Tipologia,Tipo,Тип,Tipo,类型,種類
Offset,التعويض,Compenser,Ausgleich,Leállás,Compensazione,Offset,Офсет,Compensación,抵消,相殺
Fast MA Period,فترة المتوسط المتحرك السريع,Période rapide de la moyenne mobile,Schnelle MA-Periode,Gyors mozgóátlagú időszak,Periodo di media mobile veloce,Período MA rápido,Период быстрой скользящей средней,Período de media móvil rápida,快速移动平均线周期,速いMA期間
Slow MA Period,فترة المتوسط المتحرك البطيء,Période lente de la moyenne mobile,Langsame MA-Periode,Lassú mozgóátlagú időszak,Periodo di media mobile lento,Período MA lento,Период медленной скользящей средней,Período de media móvil lenta,慢速移动平均线周期,遅いMA期間
Signal Period,فترة إشارات التداول,Période du signal,Signal-Periode,Jelző értékű időszak,Periodo di segnale,Período de sinalização,Период сигнала,Período de señal,信号周期,シグナル期間
Signal,إشارة التداول,Signal,Signal,Jelzés,Segnale,Sinalização,Сигнал,Señal,信号,シグナル
Bollinger Bands,حدود بولنجر,Bandes de Bollinger,Bollinger-Bänder,Bollinger szalagok,Bande di Bollinger,Marcas Bollinger,Полоса Боллинджера,Bandas de Bollinger,布林线,ボリンジャーバンド
Composite RSI,مؤشر القوة النسبية المُرّكب,Composé RSI,Zusammengesetzter RSI-Indikator,Összetett Rrlatív erősség index (RSI),RSI composito,RSI composto,Составной индекс относительной силы (RSI),RSI mixto,综合RSI（相对强弱指标）,総合RSI
Momentum Indicator,مؤشر الزخم,Indicateur de dynamique,Momentum-Indikator,Momentum mutató,Indicatore di momentum,Indicador de momentum,Индикатор темпа,Indicador de momento,动量,モメンタムインジケーター
Moving Average,المتوسط المتحرك,Moyenne mobile,Gleitender Mittelwert,Mozgóátlag,Media mobile,Média móvel,Скользящее среднее,Media móvil,移动平均线,移動平均
Parabolic SAR,مؤشر التوقف والانعكاس,Parabolique SAR,Parabolic SAR,Parabolic SAR (Trend szerinti indikátor),Parabolic SAR,SAR parabólico,Параболическая система SAR,Sistema parabólico SAR,抛物线SAR,パラボリックSAR
Stochastics,مؤشر الاستوكاستك,Stochastique,Stochastik,Sztochasztika,Stocastici,Estocásticos,Стохастика,Estocástico,随机指标,ストキャスティクス
Volume,الحجم,Volume,Volumen,Volumen,Volume,Volume,Объем,Volumen,成交量,取引高
Volume Underlay,مؤشر أساس حجم التداول,Volume intégré,Volumen-Underlay,Vol Underlay,Volume Underlay,Vol subjacente,Объем под кривой,Vol. subyacente,成交量下置,取引高アンダーレイ
More studies,مزيد من الدراسات,Plus d'études,Weitere Studien,További elemzések,Altri studi,Mais estudos,Другие исследования,Más estudios,更多研究……,詳細な研究
Popular Studies,دراسات شائعة,Études générales,Populäre Studien,Népszerű elemzések,Studi più diffusi,Estudos populares,Популярные исследования,Estudios populares,受欢迎的研究,人気のある研究
Edit,تعديل,Modifier,Bearbeiten,Szerkesztés,Modifica,Editar,Редактировать,Editar,编辑,編集
Delete,مسح,Supprimer,Löschen,Törlés,Elimina,Apagar,Удалить,Eliminar,删除,削除
Commodity Channel Index,مؤشر قناة السلع,Indice du canal des matières premières,Commodity Channel Index,Commodity Channel Index,Indice Commodity Channel,Índice de canal das mercadorias,Индекс товарного канала,Índice de canal de materias primas,顺势通道指标,コモディティ・チャネル指数
Accumulative Swing Index,مؤشر التأرجح التراكمي,Indice Accumulative Swing,ASI,Felhalmozódó Swing Index,Indice Accumulative Swing,Índice de oscilação acumulativo,Кумулятивный индекс колебаний,Índice de oscilación acumulativo,积累摆动指标,アキューミュレーション・スイング指数
Alligator,مؤشر التمساح,Alligator,Alligator,Alligátor,Alligator,Aligátor,Аллигатор,Alligator,鳄鱼指标,アリゲーター
Aroon,مؤشر أرون,Aroon,Aroon,Aroon,Aroon,Aroon,Арун,Aroon,阿隆指标,アルーン
Aroon Oscillator,مذبذب أرون,Oscillateur d'Aroon,Aroon Oscillator,Aroon oszcillátor,Oscillatore Aroon,Oscilador Aroon,Осциллятор Арун,Oscilador Aroon,阿隆摆动指标,アルーン・オシレーター
Average True Range,متوسط المدى الحقيقي,Gamme moyenne réelle,Average True Range (ATR),Average True Range (átlagos igaz tartomány),Average True Range,Intervalo real médio,Средний истинный диапазон (ATR),Rango medio verdadero (ATR),平均真实范围,アベレージ・トゥルー・レンジ
ATR Bands,حدود متوسط المدى الحقيقي,Bandes GMR,ATR Bänder,ATR szalagok,Bande ATR,Marcas ATR,Полосы ATR,Bandas ATR,ATR带,アベレージ・トゥルー・レンジ・バンド
ATR Trailing Stops,التوقفات المتحركة لمتوسط المدى الحقيقي,Arrêts des négociations GMR,ATR Trailing-Stops,ATR Trailing Stops (ATR csúszó stop megbízások),ATR Trailing Stop,Limites móveis ATR,Скользящие стопы ATR,Órdenes de arrastre de pérdidas ATR,ATR追踪止损,アベレージ・トゥルー・レンジ・トレーリング・ストップ
Awesome Oscillator,المتذبذب الرائع,Oscillateur impressionnant,Awesome Oscillator,Awesome oszcillátor,Oscillatore Awesome,Awesome Oscillator,Волшебный осциллятор,Oscilador asombroso,AO震荡指标,オーサム・オシレーター
Bollinger %b,بولنجر %b,Bollinger %b,Bollinger %b,Bollinger %b,Bollinger %b,Bollinger %b,%b Боллинджера,Bollinger %b,布林%b,ボリンジャー %b
Bollinger Bandwidth,مؤشر عرض حدود بولنجر,Bande passante de Bollinger,Bollinger Bandbreite,Bollinger szalagszélesség,Ampiezza Banda di Bollinger,Largura de banda Bollinger,Ширина полосы Боллинджера,Ancho de banda de Bollinger,布林带宽,ボリンジャーバンド幅
Center Of Gravity,مؤشر مركز الجاذبية,Centre de gravité,Schwerpunkt-Indikator,Center Of Gravity,Center Of Gravity,Centro de gravidade,Центр тяжести,Centro de gravedad,重心指标,重心
Chaikin Money Flow,مؤشر سيولة تشايكن,Flux monétaire de Chaikin,Chaikin Money Flow,Chaikin pénzáramlás,Chaikin Money Flow,Fluxo monetário Chaikin,Денежный поток Чайкина,Flujo de dinero Chaikin,佳庆现金流指标,チャイキン・マネー・フロー
Chaikin Volatility,مؤشر التقلب تشايكن,Volatilité de Chaikin,Chaikin Volatility,Chaikin volatilitás,Volatilità di Chaikin,Volatilidade Chaikin,Волатильность Чайкина,Volatilidad Chaikin,佳庆波动指标,チャイキン・ボラティリティ
Chande Forecast Oscillator,مذبذب تنبؤ شاندي,Indicateur de prévision de Chande,Chande Forecast Oszillator,Chande előrejelzési oszcillátor,Oscillatore Chande Forecast,Oscilador de previsão Chande,Предсказующий осциллятор Чанде,Oscilador de previsión Chande,钱德预测摆动指标,シャンデ予想オシレーター
Chande Momentum Oscillator,مذبذب زخم شاندي,Oscillateur de dynamique de Chande,Chande Momentum Oszillator,Chande momentum oszcillátor,Oscillatore Chande Momentum,Oscilador de momentum Chande,Моментум-осциллятор Чанде,Oscilador de momento Chande,钱德动量摆动指标,シャンデ・モメンタム・オシレーター
Coppock Curve,منحنى كوبوك,Courbe de Coppock,Coppock-Indikator,Coppock görbe,Coppock Curve,Curva de Coppock,Кривая Коппока,Curva de Coppock,估波曲线,コポック指標
Detrended Price Oscillator,مذبذب السعر بدون اتجاه,Oscillateur de prix éliminant la tendance,Detrended Price Oszillator,Detrended Price Oscillator (Tendencia nélküli ár oszcillátor),Oscillatore Detrended Price,Oscilador de preço destendenciada,Осциллятор бестрендовой цены,Oscilador de precio sin tendencia,非趋势价格摆动指标,デトレンディッド・プライス・オシレーター
Donchian Channel,قناة دونكان,Canal de Donchian,Donchian Channel,Donchian Channel,Donchian Channel,Canal Donchian,Канал Дончиана,Canal Donchian,唐奇安通道,ドンチャン・チャネル
Donchian Width,عرض دونكان,Valeur de Donchian,Donchian Width,Donchian szélesség,Ampiezza di Donchian,Largura Donchian,Ширина канала Дончиана,Amplitud Donchian,唐奇安宽度指标,ドンチャン幅
Ease of Movement,مؤشر سهولة الحركة,Facilité du mouvement,Ease of Movement,Mozgás könnyűsége,Ease of Movement,Facilidade de movimento,Легкость движения,Facilidad de movimiento,简易波动指标,動きやすさ
Ehler Fisher Transform,مؤشر تحويل إيلر فيشر,Ehler Fisher Transform,Ehler Fisher Transform,Ehler Fisher Transform,Ehler Fisher Transform,Transformação Ehler Fisher,Преобразование Фишера,Transformación Ehler Fisher,埃勒斯费舍尔变换转化,エーラース・フィッシャー・トランスフォーム
Elder Force Index,مؤشر القوة الأكبر,Indice Elder Force,Elder Force Index,Elder Force Index,Indice Elder Force,Índice de força Elder,Индекс силы Элдера,Índice de fuerza de Elder,爱耳德强力指数指标,エルダー・フォース指数
Elder Ray Index,مؤشر الشعاع الأكبر,Elder Ray,Elder Ray,Elder Ray,Elder Ray,Raio Elder,Луч Элдера,Rayo de Elder,爱耳德射线指标,エルダー線
Fractal Chaos Bands,مؤشر حدود الفوضى الكسيرية,Valeurs chaos fractal,Fractal Chaos Bänder,Fractal Chaos szalagok,Bande Fractal Chaos,Bandas de caos fraccionadas,Полосы фрактала и хаоса,Bandas de caos fractales,分形混沌带,フラクタル・カオス・バンド
Fractal Chaos Oscillator,مذبذب الفوضى الكسيرية,Oscillateur chaos fractal,Fractal Chaos Oszillator,Fractal Chaos oszcillátor,Oscillatore Fractal Chaos,Oscilador de caos fraccionado,Осциллятор фракталов и хаоса,Oscilador de caos fractal,分形混沌摆动指标,フラクタル・カオス・オシレーター
Gopalakrishnan Range Index,مؤشر نطاق جوبال كريشنان,Indice d'intervalle Gopalakrishnan,Gopalakrishnan Range Index,Gopalakrishnan tartományindex,Indice Gopalakrishnan Range,Índice de intervalo Gopalakrishnan,Индекс диапазона Гопалакришнана,Índice de rango Gopalakrishnan,高帕拉克里施南范围指标,ゴパラクリシュナン・レンジ指数
Gator Oscillator,مذبذب التمساح,Oscillateur de Gator,Gator Oszillator,Gator oszcillátor,Oscillatore Gator,Oscilador Gator,Осциллятор Гатор,Oscilador Gator,鳄鱼震荡指标,ゲーター・オシレーター
High Low Bands,مؤشر الحدود المرتفعة المنخفضة,Valeurs élevées et faibles,Hoch-Niedrig-Bänder,Felső alsó szalagok,Bande High Low,Bandas máx. min.,Высокие/низкие полосы,Bandas alto bajo,最高价最低价带,ハイ・ロー・バンド
High Minus Low,مؤشر قياس معدل ارتفاع السلبية,Élevé Négatif Faible,Hoch-Minus-Niedrig,Magas mínusz alacsony,High Minus Low,Máx. menos min.,Высокий минус низкий,Alto menos Bajo,最高价减最低价,ハイ・マイナス・ロー
Highest High Value,مؤشر أعلى قيمة,Valeur élevée plus élevée,Höchster hoher Wert,Legmagasabb felső érték,Valore Highest Highe,Maior valor alto,Максимальное/высокое значение,Valor alto más alto,最高最高价,最高値
Historical Volatility,مؤشر التقلب التاريخي,Volatilité historique,Historische Volatilität,Történelmi volatilitás,Volatilità storica,Volatilidade histórica,Статистика волатильности,Volatilidad histórica,历史波动,ヒストリカル・ボラティリティ
Ichimoku Clouds,غيمة الإيتشيموكو,Ichimoku Clouds,Ichimoku-Charts,Ichimoku felhők,Ichimoku Clouds,Nuvens Ichimoku,Облака Ишимоку,Nubes de Ichimoku,一目均衡表,一目均衡表
Intraday Momentum Index,مؤشر الزخم الداخلي اليومي,Indice de dynamique intrajournalier,Intraday Momentum Index,Intraday (napon belüli) momentum index,Indice Intraday Momentum,Índice de momentum intradiário,Индикатор внутридневного импульса,Índice de momento intradía,日内动量指标,イントラデイ・モメンタム指数
Keltner Channel,مؤشر قناة كيلتنر,Canal de Keltner,Keltner Channel,Keltner Channel,Keltner Channel,Canal Keltner,Канал Кельтнера,Canal de Keltner,肯特纳通道,ケルトナー・チャネル
Klinger Volume Oscillator,مذبذب حجم كلنجر,Oscillateur de volume de Klinger,Klinger Volume Oszillator,Klinger volumen oszcillátor,Oscillatore Klinger Volume,Oscilador de volume Klinger,Объемный осциллятор Клингера,Oscilador de volumen de Klinger,克林格成交量摆动指标,クリンガー取引高オシレーター
Linear Reg Forecast,مؤشر تنبؤ الانحدار الخطي,Progression linéaire de l'indice Reg,Lineare Regression Prognose,Lineáris regresszió előrejelzés,Previsione nella regressione lineare,Previsão reg linear,Прогноз линейной регрессии,Previsión de reg. lineal,线性回归预测,線形回帰予想
Linear Reg Intercept,مؤشر اعتراض الانحدار الخطي,Ordonnée linéaire de l'indice Reg,Lineare Reg Unterbrechung,Lineáris regresszió metszet,Linear Reg Intercept,Interceção reg linear,Отрезок линейной регрессии,Interceptar reg. lineal,线性回归截距,線形回帰インターセプト
Linear Reg R2,مربع معامل تحديد (R2) الانحدار الخطي,Reg R2 linéaire,Lineare Reg R2,Lineáris regresszió R2,Linear Reg R2,reg linear R2,R2 линейной регрессии,Reg. lineal R2,线性回归相关系数R2,線形回帰R2
Linear Reg Slope,منحدر الانحدار الخطي,Pente linéaire de l'indice Reg,Lineare Reg Steigung,Lineáris regresszió lejtő,Linear Reg Slope,Inclinação reg linear,Наклон линейной регрессии,Pendiente de reg. lineal,线性回归斜率,線形回帰傾き
Lowest Low Value,مؤشر أدنى قيمة,Valeur faible plus faible,Niedrigster niedriger Wert,Legalacsonyabb alsó érték,Lowest Low Value,Valor mais baixo dos baixos,Минимальное/низкое значение,Valor bajo más bajo,最低最低价,最安値
Market Facilitation Index,مؤشر تسهيل السوق,Indice de facilitation du marché,Market Facilitation Index,Market Facilitation Index (Piackönnyítő index),Indice Market Facilitation,Índice de facilitação de mercado,Индекс облегчения рынка,Índice de facilitación de mercado,市场促进指数指标,市場簡素化指数
Mass Index,مؤشر الكتلة,Indice de masse,Masse-Index,Mass Index (Tömeg index),Indice Mass,Índice de massa,Индекс массы,Índice de masa,梅斯指标,マス指数
Median Price,متوسط السعر,Prix médian,Mittlerer Preis,Közepes ár,Median Price,Preço médio,Медианная цена,Precio medio,中间价位指数,中央値価格
Money Flow Index,مؤشر السيولة,Indicateur des flux monétaires,Geldfluss-Index,Pénzáramlás index,Money Flow Index,Índice de fluxo monetário,Индекс денежных потоков,Índice de flujo de dinero,资金流量指标,マネーフロー指数
Moving Average Envelope,غلاف المتوسط المتحرك,Enveloppe de moyenne mobile,Moving Average Envelope,Mozgóátlag boríték,Moving Average Envelope,Envelope média móvel,Конверт скользящих средних,Sobre de media móvil,移动平均线通道,移動平均エンベロープ
Negative Volume Index,مؤشر الحجم السلبي,Indice de volume négatif,Negative Volume Index,Negatív volumenindex,Indice Negative Volume,Índice de volume negativo,Индекс отрицательного объема,Índice de volumen negativo,负成交量指标,ネガティブ取引高指数
On Balance Volume,مؤشر أحجام التداول المتراكمة,Sur le volume du solde,On Balance Volume,On Balance volumen,On Balance Volume,Volume balanceado,Балансовый объем,Volumen en equilibrio,能量潮,オンバランス取引高
Performance Index,مؤشر الأداء,Indice de performance,Performance-Index,Teljesítményindex,Indice di Performance,Índice de desempenho,Индекс эффективности,Índice de desempeño,性能指标,パフォーマンス指数
Pivot Points,النقاط المحورية,Points pivots,Drehpunkte,Pivot pontok,Punti pivot,Pontos de rotação,Точки разворота,Puntos de pivote,轴心点,ピボットポイント
Positive Volume Index,مؤشر الحجم الإيجابي,Indice de volume positif,Positive Volume Index,Pozitív volumenindex,Indice Positive Volume,Índice de volume positivo,Индекс положительного объема,Índice de volumen positivo,正成交量指标,ポジティブ取引高指数
Pretty Good Oscillator,مذبذب جيد جدًا,Oscillateur très bon,Ziemlich guter Oszillator,Pretty Good oszcillátor,Oscillatore Pretty Good,Oscilador PGO,Осциллятор Pretty Good,Oscilador bastante bueno,不错震荡指标,プリティ・グッド・オシレーター
Price Oscillator,مذبذب السعر,Oscillateur de prix,Preis-Oszillator,Ároszcillátor,Oscillatore Price,Oscilador de preço,Ценовой осциллятор,Oscilador de precio,价格震荡指标,プライス・オシレーター
Price Rate of Change,معدل التغيرات السعرية,Prix Taux de change,Preis Änderungsquote,Price Rate of Change (változás mértéke ár),Tasso di variazione del prezzo,Taxa de variação de preço,Скорость изменения цены,Precio tipo de cambio,价格变化率,価格変化率
Price Relative,منسوب السعر,Prix relatif,Relativer Preis,Árrelatív,Price Relative,Relativo de preço,Относительное значение цен,Precio relativo,价格相对指标,価格指数
Price Volume Trend,اتجاه حجم السعر,Tendance du volume et des prix,Preis-Volumen-Trend,Árvolumen trend,Price Volume Trend,Tendência volume de preço,Тренд цены и объема,Tendencias de volumen de precio,价格成交量趋势,価格取引高トレンド
Prime Number Bands,حدود الأعداد الأولية,Bandes des nombres premiers,Primzahl-Bänder,Prime Number (törzsszám) szalagok,Prime Number Bands,Bandas de números primos,Полосы простых чисел,Bandas de número primo,价格成交量趋势,プライム・ナンバー・バンド
Prime Number Oscillator,مذبذب الأعداد الأولية,Oscillateur des nombres premiers,Primzahl-Oszillator,Prime Number (törzsszám) oszcillátor,Oscillatore Prime Number,Oscilador de número primo,Осциллятор простых чисел,Oscilador de número primo,质数通道,プライム・ナンバー・オシレーター
QStick,مؤشر قارئ الشموع اليابانية QStick,QStick,QStick,QStick,QStick,QStick,QStick,QStick,质数震荡指标,Qスティック
Random Walk Index,مؤشر الحركة العشوائية,Indice aléatoire,Random Walk Index,Random Walk Index,Indice Random Walk,Índice de percurso aleatório,Индекс случайного блуждания,Índice de camino aleatorio,量化蜡烛线,ランダムウォーク指数
Relative Vigor Index,مؤشر النشاط النسبي,Indice de vigueur relative,Relative Vigor Index,Relative Vigor Index (Volatilitás viszonylagossági indexe),Indice Relative Vigor,Índice de vigor relativo,Индекс относительной бодрости,Índice de vigor relativo,随机漫步指标,相対活性指数
Relative Volatility,التقلب النسبي,Volatilité relative,Relative Volatilität,Relatív volatilitás,Volatilità relativa,Volatilidade relativa,Относительная волатильность,Volatilidad relativa,相对能量指数指标,相対ボラティリティ
Schaff Trend Cycle,دورة اتجاه شاف,Cycle de tendances Schaff,Schaff Trend-Zyklus,Schaff Trend Ciklus,Schaff Trend Cycle,Ciclo de tendência de Schaff,Трендовый цикл Шаффа,Ciclo de tendencia de Schaff,相对波幅,シャフ・トレンド・サイクル
Standard Deviation,الانحراف المعياري,Écart type,Standardabweichung,Standard szórás,Deviazione standard,Desvio-padrão,Среднеквадратичное отклонение,Desviación estándar,沙夫趋势周期,標準偏差
STARC Bands,فروقات ستارك,Bandes STARC,STARC-Bänder,STARC sávok,Bande di STARC,Bandas STARC,STARC-полосы,Bandas STARC,时序预测,STARC バンド
Stochastic Momentum Index,مؤشر الزخم العشوائي,Indice de dynamique stochastique,Stochastic Momentum Index,Sztochasztikus momentum index,Indice Stochastic Momentum,Índice Momentum estocástico,Индекс стохастического темпа,Índice de momento estocástico,标准差,ストキャスティック・モメンタム指数
Swing Index,مؤشر التأرجح,Indice Swing,Oszillation-Index,Swing Index,Indice Swing,Índice de oscilação,Индекс колебаний,Índice de oscilación,随机动量指标,スイング指数
Time Series Forecast,توقعات مجموعة الوقت,Prévision des séries chronologiques,Zeitreihenanalyse,Idősorok előrejelzés,Previsione su serie temporali,Previsão de tempo das series,Временной прогноз,Pronóstico de evolución temporal,时序预测,時系列予想
Trade Volume Index,مؤشر حجم التداول,Indice de volume de transactions,Handelsvolumen-Index,Kereskedelmi volumenindex,Indice Trade Volume,Índice de volume de negócios,Индекс торгового объема,Índice de volumen de operaciones,摆动指标,取引高指数
True Range,مؤشر المد الحقيقي,Gamme réelle,True Range,Igaz tartomány,True Range,Intervalo real,Истинный диапазон,rango verdadero,交易量指标,トゥルー・レンジ
Twiggs Money Flow,مؤشر السيولة تويجز,Flux monétaire Twiggs,Twiggs Money Flow,Twiggs pénzáramlat,Twiggs Money Flow,Fluxo monetário Twiggs,Индекс денежных потоков Твиггса,Flujo de dinero de Twiggs,真实范围,ツウィッグス・マネーフロー
Typical Price,السعر النموذجي,Prix type,Typischer Preis,Jellemző ár,Typical Price,Preço típico,Типичная цена,Precio típico,TMF现金流量指标,標準価格
Ultimate Oscillator,المذبذب المطلق,Oscillateur principal,Ultimate Oscillator,Végső oszcillátor,Oscillatore Ultimate,Derradeiro oscilador,Окончательный осциллятор,Oscilador definitivo,典型价格,アルティメット・オシレーター
Vertical Horizontal Filter,عامل التصفي العمودي الأفقي,Filtre horizontal et vertical,Vertical Horizontal Filter,Függőleges vízszintes szűrő,Filtro verticale orizzontale,Filtro horizontal vertical,Вертикальный/горизонтальный фильтр,Filtro vertical horizontal,终极震荡指标,垂直水平フィルター
Volume Chart,الرسم البياني للحجم,Graphique des volumes,Volumen-Chart,Volumen chart,Grafico volumi,Gráfico de volume,Схема оборотов,Gráfica de volumen,成交量图,出来高チャート
Volume Oscillator,مذبذب الحجم,Oscillateur de volume,Volume Oscillator,Volumenoszcillátor,Oscillatore Volume,Oscilador de volume,Объемный осциллятор,Oscilador de volumen,十字过滤线,取引高オシレーター
Volume Rate of Change,معدل التغير الحجمي,Volume Taux de change,Volumen Änderungsquote,Volume Rate of Change (volumen változás mértéke),Tasso di variazione del volume,Taxa de variação de volume,Скорость изменения объема,Volumen de tipo de cambio,成交量震荡指标,取引高変化率
Volume Profile,مؤشر ملف الحجم,Volume Profil,Volumen Profil,Volumenprofil,Profilo Volume,Perfil do volume,Профиль объемов,Perfil de volumen,成交量变化率,取引高プロフィール
Weighted Close,مؤشر الإغلاق المرجح,Clôture pondéré,Gewichteter Abschluss,Súlyozott zárás,Chiusura ponderata,Peso próximo,Взвешенная цена закрытия,Cierre ponderado,成交量特点,加重終値
Williams %R,مؤشر ويليامز %R,Williams %R,Williams %R,Williams %R,Williams %R,Williams %R,%R Уильямса,Williams %R,权重收盘价,ウィリアムズ %R
Accumulation/Distribution,مؤشر التوزيع المتراكم,Distribution/Accumulation,Accumulation Distribution,Accumulation Distribution,Accumulation Distribution,Distribuição acumulativa de,Индикатор накопления/распределения ,Distribución de acumulación,威廉指标,集積/離散
Smooth,ناعم,Smooth,Glatt,Egyenletes,Smooth,Suave,Плавный,Uniforme,威廉多空力度线,スムーズ
Fast,سريع,Rapide,Schnell,Gyors,Fast,Rápido,Быстрый,Rápido,平滑,速い
Slow,بطئ,Lent,Langsam,Lassú,Slow,Lento,Медленный,Lento,快速,遅い
Correl,الارتباط,Correl,Correl,Korrelál,Correlazione,Correl,Корреляция,Correl.,慢速,相関係数
Aroon Up,مؤشر أرون الصاعد,Aroon Up,Aroon Up,Aroon felfelé,Aroon Up,Aroon para cima,Арун (вверх),Aroon arriba,相关,アルーン・アップ
Aroon Down,مؤشر أرون الهابط,Aroon Down,Aroon Down,Aroon lefelé,Aroon Down,Aroon para baixo,Арун (вниз),Aroon abajo,阿隆指标上升,アルーン・ダウン
Aroon Osc,مذبذب أرون,Aroon Osc,Aroon Osz,Aroon oszc.,Oscillatore Aroon,Aroon osc,Осциллятор Арун,Osc. Aroon,阿隆指标下降,アルーン・オシレーター
Lin R2,مؤشر الانحدار معامل مربع التحديد (R2),R2 linéaire,Lin R2,Lin R2,Lin R2,Lin R2,Линейный R2,Lin R2,阿隆震荡指标,線形R2
RSquared,معامل التحديد المربع,RSquared,RSquared,Rnégyzeten,RSquared,RSquared,R-квадрат,RSquared,线性相关R2,決定係数
Lin Fcst,التنبؤ الخطي,Progression linéaire,Lin Prog,Lin előrejelz,Lin Fcst,Previsão de linha,Линейный прогноз,Prev. lineal,R相关,線形予想
Forecast,التنبؤ,Prévision,Prognose,Előrejelzés,Forecast,Previsão,Прогноз,Previsión,线性预测,予想
Lin Incpt,الاعتراض الخطي,Ordonnée linéaire,Lin Unterbr,Lin metsz,Lin Incpt,Lin Incpt,Секущая,Intercepción lin.,预测,線形インターセプト
Intercept,الاعتراض,Ordonnée,Unterbrechung,Metszet,Intercept,Intersetar,Отрезок,Intercepción,线性截距,インターセプト
Time Fcst,التنبؤ الزمني,Progression dans le temps,Zeit Prog,Idő előrejelz,Time Fcst,Previsão de tempo,Временной прогноз,Prev. de tiempo,截距,時間予想
VT HZ Filter,عامل التصفية العمودي الأفقي,Filtre VT HZ,VT HZ Filter,VT HZ szűrő,VT HZ Filter,Filtro VT HZ,Верт/гор фильтр,Filtro VT HZ,时间预测,垂直水平フィルター
STD Dev,الانحرافات المعيارية,Écart type,STD Abw,STD szórás,STD Dev,STD Dev,Ср-квадр отклонение,Desv. EST.,VT HZ过滤线,標準偏差
Standard Deviations,الانحرافات المعيارية,Écarts types,Standardabweichungen,Standard szórások,Deviazione standard,Desvios-padrão,Среднеквадратичные отклонения,Desviaciones estándar,标准差,標準偏差
Moving Average Type,نوع المتوسط المتحرك,Type de moyenne mobile,Art des gleitenden Mittelwerts,Mozgóátlag típus,Tipologia media mobile,Tipo de média móvel,Тип скользящего среднего,Tipo de media móvil,标准差,移動平均タイプ
Trade Vol,حجم التداول,Volume de trading,Handelsvol,Ügylet vol,Trade Vol,Vol de negócios,Объем торговли,Volumen de operaciones,移动平均线类型,取引高
Min Tick Value,أدنى قيمة لأصغر حركة سعر,Valeur minimale de l'unité,Min Tick-Wert,Min Tick érték,Min Tick Value,Valor Tick min.,Минимальное значение тика,Valor mín. de marca,交易量,最小ティックバリュー
Swing,التأرجح,Swing,Oszillation,Swing,Swing,Oscilação,Колебания,Oscilación,最小点数值,スイング
Limit Move Value,قيمة تغير الحد,Valeur limite du mouvement,Limit Move Value,Mozgóértékhatár,Limit Move Value,Valor limite de movimento,Значение сдвига лимита,Valor del límite de movimiento,摆动,限定移動値
Acc Swing,مؤشر التأرجح التراكمي,Acc Swing,Acc Oszilation,Felhalm Swing,Acc Swing,Oscilação Acc,Кумулятивный индекс колебаний,Oscilación Acc.,限制运行值,集積スイング
Price ROC,معدل التغيرات السعرية,Prix RDC,Preis ROC,ROC ár,Price ROC,Preço ROC,Скорость изменения цены,Precio ROC,积累摆动指标,価格ROC
Vol ROC,معدل التغير الحجمي,Volume RDC,Vol ROC,ROC vol,Vol ROC,Vol ROC,Скорость изменения объема,Vol. ROC,价格变化率,取引高ROC
Momentum,الزخم,Dynamique,Dynamik,Momentum,Momentum,Momentum,Темп,Momento,成交量变化率,モメンタム
Price Vol,حجم السعر,Prix Volume,Preis Vol,Vol ár,Price Vol,Vol de preço,Волатильность цен,Vol. de precio,动量,価格取引高
Pos Vol,مؤشر الحجم الإيجابي,Volume positif,Pos Vol,Vol poz,Pos Vol,Vol pos,Волатильность позиций,Vol. positivo,价格成交量,POS取引高
Index,المؤشر,Indice,Index,Index,Indice,Índice,Индекс,Índice,正成交量,指数
Neg Vol,مؤشر الحجم السلبي,Volume négatif,Neg Vol,Neg Vol,Neg Vol,Vol neg,Отрицательный объем,Vol. negativo,指数,マイナス取引高
On Bal Vol,مؤشر أحجام التداول المتراكمة,Sur le volume du solde,Saldo Vol,On Bal Vol,On Bal Vol,Vol On Ball,Балансовый объем,Vol. en equilibrio,负成交量,オンバランス取引高
Perf Idx,مؤشر الأداء,Indice de performance,Perf Idx,Teljesítm Idx,Perf Idx,Índice Perf,Индекс эффективности,Índ. de desempeño,能量潮,パフォーマンス指数
Stch Mtm,مؤشر الزخم العشوائي,Dynamique stochastique,Stch Dyn,Stch Mtm,Stch Mtm,Stch Mtm,Стохастический темп,Mom. est.,性能指标,ストキャスティック・モメンタム
%K Periods,فترات %K,%K Périodes,%K Zeiträume,%K Időszakok,%K Periodi,%K Períodos,Периоды %K,Períodos %K,随机动量,%K期間
%K Smoothing Periods,فترات التنعيم %K,Périodes de lissage en % K,%K Glättungszeiträume,%K kiegyenlítő időszakok,%K periodi di lisciatura,%K períodos de suavização,Периоды сглаживания %K,Períodos de uniformidad %K,%K周期,%Kスムージング期間
%K Double Smoothing Periods,فترات التنعيم المزدوجة %K,Périodes doubles de lissage en % K,%K Doppelte Glättungszeiträume,%K dupla kiegyenlítő időszakok,%K Periodi Double Smoothing,%K períodos de suavização dupla,Периоды двойного сглаживания %K,Períodos de uniformidad doble %K,%K平滑周期,%Kダブルスムージング期間
%D Periods,فترات %D,%D Périodes,%d Zeiträume,%D időszakok,%D Periodi,%D períodos,Периоды %D,Períodos %D,%K双重平滑周期,%D期間
%D Moving Average Type,نوع المتوسط المتحرك %D,Type de moyenne mobile en % D,%D Art des gleitenden Mittelwerts,%D mozgóátlag típus,%D Tipologia media mobile,%D tipo de média móvel,Тип скользящего среднего %D,Tipo de media móvil %D,%D周期,%D移動平均タイプ
Hist Vol,مؤشر التقلب التاريخي,Volatilité historique,Hist. Vol.,Történ Vol,Hist Vol,Volume histórico,Статистика волатильности,Vol. histórico,%D移动平均线类型,過去の取引高
Days Per Year,يوم في السنة,Jours par an,Tage pro Jahr,Év per napok,giorni l'anno,Dias por ano,Дней в году,Días por año,历史波动,年間あたり日数
Rel Vol,مؤشر التقلب النسبي,Volatilité relative,Rel Vol,Rel Vol,Rel Vol,Vol rel,Относительная волатильность,Vol. rel.,每年天数,相対取引高
STD Period,الفترة المعيارية,Période type,STD Zeitraum,STD időszak,STD Period,Período STD,Базисный период,Período STD,相关成交量,STD期間
Smoothing Period,فترة التنعيم,Période de lissage,Glättungszeitraum,Kiegyenlítő időszak,Periodo di lisciatura,Período de nivelamento,Период сглаживания,Período de uniformidad,标准周期,スムージング期間
Pretty Good,جيد جدًا,Très bon,Ziemlich gut,Pretty Good,Pretty Good,Bastante bom,Pretty Good,Bastante bueno,平滑周期,プリティ・グッド
Awesome,رائع,Génial,Fantastisch,Remek,Fantastico,Excelente,Великолепно,Fantástico,棒极了,オーサム
Increasing Bar,شريط الصعود,Barre montante,Zunehmender Balken,Növekvő sáv,Barra crescente,Aumentando a barra,Столбец роста,Barra creciente,不错指标,増加バー
Decreasing Bar,شريط الهبوط,Barre descendante,Abnehmender Balken,Csökkenő sáv,Barra decrescente,Diminuindo a barra,Столбец падения,Barra decreciente,增加柱线,減少バー
Ultimate,المطلق,Principal,Zuletzt,Végső,Ultimo,Ultimar,Окончательный,Definitivo,减少柱线,アルティメット
Cycle 1,الدورة 1,Cycle 1,Zyklus 1,1. ciklus,Ciclo 1,Ciclo 1,Цикл 1,Ciclo 1,终极震荡指标,サイクル1
Cycle 2,الدورة 2,Cycle 2,Zyklus 2,2. ciklus,Ciclo 2,Ciclo 2,Цикл 2,Ciclo 2,周期1,サイクル2
Cycle 3,الدورة 3,Cycle 3,Zyklus 3,3. ciklus,Ciclo 3,Ciclo 3,Цикл 3,Ciclo 3,周期2,サイクル3
W Acc Dist,مؤشر التوزيع المتراكم ويليامز,Accumulation/Distribution de Williams,W Acc Dist,W felhalm eloszt,W Acc Dist,W Acc Dist,Индикатор накопления/распределения Уильямса,Dist. A acu.,周期3,W集積分布
Green,أخضر,Vert,Grün,Zöld,verde,Verde,Зеленый,Verde,累积摆动距离,グリーン
Fade,متلاشي,Fictif,Schwächer,Fakó,Fade,Esbatimento,Угасание,Difuminado,绿色,フェード
Fake,مزيف,Faux,Falsch,Hamis,Fake,Falso,Фальсификация,Falso,衰退,フェイク
Squat,عشوائي,Squat,Kompakt,Zömök,Squat,Squat,Проседание,Asentado,伪装,スクワット
Vol Osc,مذبذب الحجم,Oscillateur de volume,Vol Osz,Vol oszc,Vol Osc,Osc vol,Объемный осциллятор,Osc. vol.,蛰伏,取引高オシレーター
Short Cycle,دورة قصيرة,Cycle court,Kurzer Zyklus,Rövid ciklus,Ciclo corto,Ciclo curto,Короткий цикл,Ciclo corto,成交量震荡指标,短期サイクル
Long Cycle,دورة طويلة,Cycle long,Kauf Zyklus,Hosszú ciklus,Ciclo Lungo,Ciclo longo,Длинный цикл,Ciclo largo,短周期,長期サイクル
Points Or Percent,نقاط أو نسبة مئوية,Points ou pourcentage,Punkte oder Prozent,Pontok vagy százalék,Punti o percentuale,Pontos ou percentagem,Пункты или проценты,Puntos o Porcentaje,长周期,ポイントまたはパーセント
Twiggs,تويجز,Twiggs,Twiggs,Twiggek,Twiggs,Twiggs,Твиггс,Twiggs,点数或百分比,ツウィッグス
Chaikin MF,مؤشر سيولة تشايكن,Flux monétaire de Chaikin,Chaikin MF,Chaikin MF,Chaikin MF,MF Chaikin,Денежный поток Чайкина,MF de Chaikin,TMF现金流量指标,チャイキン・マネーフロー
Chaikin Vol,مؤشر التقلب تشايكن,Volatilité de Chaikin,Chaikin Vol,Chaikin Vol,Chaikin Vol,Vol Chaikin,Волатильность Чайкина,Vol. de Chaikin,佳庆现金流量指标,チャイキン・ボラティリティ
Rate Of Change,معدل التغير,Taux de change,Änderungsquote,Rate Of Change (Változás mértéke),Tasso di variazione,Taxa de mudança,Скорость изменения,Tipo de cambio,佳庆成交量指标,変化率
Price Osc,مذبذب السعر,Oscillateur de prix,Preis Osz,Ároszcill,Price Osc,Osc preço,Осциллятор цены,Osc. de precio,变化率指标,価格オシレーター
Detrended,بدون اتجاه,Qui élimine la tendance,Trendbereinigt,Detrended (Tendencia nélküli),Detrended,Destendenciada,Бестрендовая,Sin tendencia,价格震荡指标,デトレンディッド
Shift,التحول,Déplacement,Verschieben,Eltolódás,Shift,Deslocação,Сдвиг,Giro,非趋势指标,シフト
Channel Fill,تعبئة القناة,Canal de Fill,Channel Fill,Channel feltöltés,Channel Fill,Preenchimento de canal,Заполнение канала,Llenado del canal,转换,チャネル・フィル
ATR Bands Top,أعلى حدود متوسط المدى الحقيقي,Bandes GMR Haut,ATR Bänder Oben,ATR szalagok csúcsa,Bande ATR top,Topo bandas ATR,Верхняя граница полос ATR,Bandas ATR superiores,通道填充,アベレージ・トゥルー・レンジ・バンド・トップ
ATR Bands Bottom,أسفل حدود متوسط المدى الحقيقي,Bandes GMR Bas,ATR Bänder Unten,ATR szalagok alsó pontja,Bande ATR bottom,Fundo bandas ATR,Нижняя граница полос ATR,Bandas ATR inferiores,ATR带顶部,アベレージ・トゥルー・レンジ・バンド・ボトム
ATR Bands Channel,حدود متوسط المدى الحقيقي,Bandes GMR Canal,ATR Bänder Channel,ATR szalagok Channel,Bande ATR Channel,Canal bandas ATR,Канал полос ATR,Canal de bandas ATR,ATR带底部,アベレージ・トゥルー・レンジ・バンド・チャネル
STARC Bands Top,أفضل فرق ستارك,Bandes STARC Haut,STARC-Bänder Max,Felső STARC sávok,Bande STARC superiori,Topo de bandas STARC,Верхняя STARC-полоса,Valor superior de bandas STARC,斯塔克带顶部值,STARC バンド上限
STARC Bands Bottom,أسوء فرق ستارك,Bandes STARC Bas,STARC-Bänder Min,Alsó STARC sávok,Bande STARC inferiori,Fundo de bandas STARC,Нижняя STARC-полоса,Valor inferior de bandas STARC,斯塔克带底部值,STARC バンド下限
STARC Bands Median,فرق متوسط ستارك,Bandes STARC Milieu,STARC-Bänder Mittel,Középső STARC sávok,Bande STARC mediane,Mediana de bandas STARC,Медиана STARC-полос,Mediana de bandas STARC,斯塔克带中间值,STARC バンド中値
ATR Trailing Stop,التوقف المتحرك لمتوسط المدى الحقيقي,Arrêt des négociations GMR,ATR Trailing-Stop,ATR Trailing Stop (ATR csúszó stop megbízás),ATR Trailing Stop,Paragem móvel ATR,Скользящий стоп ATR,Orden de arrastre de pérdidas ATR,ATR带通道,アベレージ・トゥルー・レンジ・トレーリング・ストップ
Multiplier,معامل الضرب,Multiplicateur,Multiplikator,Szorzó,Moltiplicatore,Multiplicador,Мультипликатор,Multiplicador,ATR追踪止损,マルチプライヤー
Plot Type,نوع الرسم البياني,Type de tracé,Darstellungsart,Tervtípus,Tipo di tracciato,Tipo de parcela,Тип схемы,Tipo de diagrama,乘数,プロットタイプ
HighLow,مرتفع منخفض,Élevé Faible,HochNiedrig,FelsőAlsó,HighLow,MáxMin,Высокий/низкий,Alto/Bajo,作图类型,高低
Buy Stops,أوامر توقف الشراء,Arrêts des achats,Kauf-Stopps,Stopok vétele,Ordini stop di acquisto (Buy Stops),Comprar paragem,Стопы на покупку,Paradas de compra,最高价最低价,買い逆指値
Sell Stops,أوامر توقف البيع,Arrêts des ventes,Verkauf-Stopps,Stopok eladása,Ordini stop di vendita (Sell Stops),Vender paragens,Стопы на продажу,Paradas de venta,止损买单,売り逆指値
Ehler Fisher,إيلر فيشر,Ehler Fisher,Ehler Fisher,Ehler Fisher,Ehler Fisher,Ehler Fisher,Преобразование Фишера по Элерсу (EF),Ehler Fisher,止损卖单,エーラース・フィッシャー
EF Trigger,محرك عامل تصفية الأحداث,EF Trigger,EF Auslöser,EF Trigger (EF küszöbérték),EF Trigger,EF Trigger,Триггер EF,Activador EF,埃勒斯费舍尔变换,EFトリガー
Schaff,شاف,Schaff,Schaff,Schaff,Schaff,Schaff,Шафф,Schaff,EF触发器,シャフ
Coppock,كوبوك,Coppock,Coppock,Coppock,Coppock,Coppock,Коппок,Coppock,沙夫指标,コポック
Short RoC,معدل التغيرات القصير,RDC à court terme,Verkauf RoC,Rövid RoC,RoC corto,RoC curto,Кратковременная скорость изменения,RoC corto,估波指标,短期変化率
Long RoC,معدل التغيرات الطويل,RDC à long terme,Kauf RoC,Hosszú RoC,RoC lungo,RoC longo,Долговременная скорость изменения,RoC largo,做空变化率,長期変化率
Chande Mtm,زخم شاندي,Dynamique de Chande,Chande Dyn,Chande Mtm,Chande Mtm,Mtm Chande,Моментум-осциллятор Чанде,Momento Chande,做多变化率,シャンデ・モメンタム
Chande Fcst,تنبؤ شاندي,Progression de Chande,Chande Prog,Chande Előrejelz,Chande Fcst,Previsão Chande,Предсказующий осциллятор Чанде,Prev. Chande,钱德动量指标,シャンデ予想
Intraday Mtm,الزخم الداخلي اليومي,Dynamique intrajournalière,Intraday Dyn,Intraday Mtm,Intraday Mtm,Mtm intradiário,Внутридневной импульс,Momento intradía,钱德预测指标,イントラデイ・モメンタム
Random Walk,الحركة العشوائية,Random Walk,Random Walk,Random Walk,Random Walk,Percurso aleatório,Случайное блуждание,Camino aleatorio,日内动量,ランダムウォーク
Random Walk High,الحركة العشوائية المرتفعة,Random Walk Élevé,Random Walk Hoch,Random Walk magas,Random Walk High,Alto percurso aleatório,Случайное блуждание (высокий уровень),Camino aleatorio alto,随机漫步指标,ランダムウォーク高値
Random Walk Low,الحركة العشوائية المنخفضة,Random Walk Faible,Random Walk Tief,Random Walk alacsony,Random Walk Low,Baixo percurso aleatório,Случайное блуждание (низкий уровень),Camino aleatorio bajo,随机漫步最高点,ランダムウォーク安値
Directional,اتجاهي,Directionnel,Ausgerichtet,Irányított,Direzionale,Direcional,Направленный,Direccional,随机漫步最低点,ディレクショナル
High Low,مرتفع منخفض,Élevé Faible,Hoch-Niedrig,Magas Alacsony,High Low,Máx. min.,Высокий/низкий,Alto Bajo,方向,ハイ・ロー
Shift Percentage,نسبة التحول,Pourcentage de déplacement,Prozentsatz verschieben,Eltolódás százaléka,Percentuale di variazione,Percentagem de deslocamento,Процент заполнения,Porcentaje de giro,最高的最低价,シフト割合
High Low Top,مرتفع منخفض علوي,Élevé Faible Haut,Hoch-Niedrig Oben,Magas Alacsony Csúcs,High Low top,Máx. Min. Superior,Высокий/низкий/максимальный,Alto Bajo superior,变换百分比,ハイ・ロー・トップ
High Low Median,مرتفع منخفض متوسط,Élevé Faible Médian,Hoch-Niedrig Mitte,Magas Alacsony Közép,High Low median,Máx. Min. Mediano,Высокий/низкий/медианный,Alto Bajo medio,最高的最低价顶部,ハイ・ロー中央値
High Low Bottom,مرتفع منخفض سفلي,Élevé Faible Bas,Hoch-Niedrig Unten,Magas Alacsony Alsó pont,High Low bottom,Máx. min. inferior,Высокий/низкий/минимальный,Alto Bajo inferior,最高的最低价中位,ハイ・ロー・ボトム
High-Low,مرتفع منخفض,Élevé Faible,Hoch-Niedrig,Magas-alacsony,High-Low,Máx. - min.,Высокий-низкий,Alto-Bajo,最高的最低价底部,ハイ・ロー
Med Price,متوسط السعر,Prix médian,mit. Preis,Köz. ár,Med Price,Preço médio,Мед. цена,Precio med.,最高价-最低价,中央値価格
MA Env,غلاف المتوسط المتحرك,Enveloppe de la moyenne mobile,MA Env,MÁ Boríték,MA Env,Env MA,Конверт скользящих средних,Sobre MM,中位价格,移動平均エンベロープ
Shift Type,نوع التحول,Type de déplacement,Verschiebungsart,Eltolódás típusa,Shift Type,Tipo de desvio,Тип сдвигу,Tipo de giro,移动平均线通道,シフトタイプ
MA Env Top,أعلى غلاف المتوسط المتحرك,Enveloppe de la moyenne mobile Haut,MA Env Oben,MÁ Boríték csúcs,MA Env top,Env MA Topo,Конверт скользящих средних (максимальный),Sobre MM superior,转换类型,移動平均エンベロープ・トップ
MA Env Median,متوسط غلاف المتوسط المتحرك,Enveloppe de la moyenne mobile Médian,MA Env Mitte,MÁ Boríték Közép,MA Env median,Env MA médio,Конверт скользящих средних (медианный),Sobre MM medio,移动平均线通道顶部,移動平均エンベロープ中央値
MA Env Bottom,أسفل غلاف المتوسط المتحرك,Enveloppe de la moyenne mobile Bas,MA Env Unten,MÁ Boríték Alsó pont,MA Env bottom,Env MA fundo,Конверт скользящих средних (минимальный),Sobre MM inferior,移动平均线通道中位,移動平均エンベロープ・ボトム
Fractal High,كسيرية مرتفعة,Fractal Élevé,Fraktal hoch,Fractal magas,Fractal High,Alto fraccionado,Фрактал (высокий),Fractal alto,移动平均线通道底部,フラクタル高値
Fractal Low,كسيرية منخفضة,Fractal Faible,Fraktal niedrig,Fractal alacsony,Fractal Low,Baixo fraccionado,Фрактал (низкий),Fractal bajo,分形最高点,フラクタル安値
Fractal Channel,قناة كسيرية,Fractal Canal,Fraktal Channel,Fractal Channel,Fractal Channel,Canal fraccionado,Канал фракталов,Canal fractal,分形最低点,フラクタル・チャネル
Fractal Chaos,فوضة كسيرية,Chaos fractal,Fraktal Chaos,Fractal Chaos,Fractal Chaos,Caos fraccionado,Фрактал/хаос,Caos fractal,分形通道,フラクタル・カオス
Gopala,جوبال كريشنان,Gopala,Gopala,Gopala,Gopala,Gopala,Гопала,Gopala,分形混沌,ゴーパーラ
Prime Bands Top,أعلى الحدود الرئيسية,Bandes premières Haut,Prime Bänder Oben,Legjobb szalagok csúcs,Bande Prime Top,Topo bandas primárias,Полосы простых чисел (верхний уровень),Bandas primas superiores,高帕拉克里施南,プライム・バンド・トップ
Prime Bands Bottom,أسفل الحدود الرئيسية,Bandes premières Bas,Prime Bänder Unten,Legjobb szalagok alsó pont,Bande Prime Bottom,Fundo bandas primárias,Полосы простых чисел (нижний уровень),Bandas primas inferiores,质数通道顶部,プライム・バンド・ボトム
Prime Bands Channel,قناة الحدود الرئيسية,Bandes premières Canal,Prime Bänder Channel,Legjobb szalagok Channel,Bande Prime Channel,Canal bandas primárias,Канал полос простых чисел,Canal de bandas primas,质数通道底部,プライム・バンド・チャネル
Prime Number,الرقم الرئيسي,Nombre premier,Prime Anzahl,Prime Number (törzsszám),Prime Number,Número primo,Простое число,Número primo,质数带通道,プライム・ナンバー
Tolerance Percentage,نسبة التحمل,Pourcentage de tolérance,Toleranzprozentsatz,Tolerancia százalék,Percentuale di tolleranza,Percentagem de tolerância,Погрешность в процентах,Porcentaje de tolerancia,质数,許容率
Bollinger Bands Top,أعلى حدود بولنجر,Bandes de Bollinger Haut,Bollinger Bänder Oben,Bollinger szalagok csúcs,Bande di Bollinger Top,Bandas Bollinger topo,Полосы Боллинджера (верхний уровень),Bandas de Bollinger superiores,容忍百分比,ボリンジャーバンド・トップ
Bollinger Bands Median,متوسط حدود بولنجر,Bandes de Bollinger Médian,Bollinger Bänder Mitte,Bollinger szalagok közép,Bande di Bollinger Median,Bandas Bollinger média,Полосы Боллинджера (медианный уровень),Bandas de Bollinger medias,布林线顶部,ボリンジャーバンド中央値
Bollinger Bands Bottom,أسفل حدود بولنجر,Bandes de Bollinger Bas,Bollinger Bänder Unten,Bollinger szaagok alsó pont,Bande di Bollinger Bottom,Bandas Bollinger fundo,Полосы Боллинджера (нижний уровень),Bandas de Bollinger inferiores,布林线中位,ボリンジャーバンド・ボトム
Boll %b,بولنجر %b,Boll %b,Boll %b,Boll %b,Boll %b,Boll %b,%b Боллинджера,Boll %b,布林线底部,ボリンジャー %b
Boll BW,عرض نطاق بولنجر,Bandes passantes de Bollinger,Boll BB,Boll sz.sz.,Boll BW,Boll BW,Ширина полосы Боллинджера,Ancho de banda Boll,布林线%b,ボリンジャーバンド幅
Bandwidth,عرض نطاق,Bandes passantes,Bandbreite,Szalagszélesség,Ampiezza della banda,Largura de banda,Ширина полосы,Ancho de banda,布林带宽度,幅
High Period,الفترة العليا,Période élevée,Hoher Zeitraum,Magas időszak,Periodo High,Período alto,Высокий период,Período alto,带宽,高値期間
Low Period,الفترة المنخفضة,Période creuse,Niedr. Zeitraum,Alacsony időszak,Periodo Low,Período baixo,Низкий период,Período bajo,高位期间,安値期間
Donchian High,دونكان مرتفع,Donchian Élevé,Donchian hoch,Donchian felső,Donchian High,Alto de Donchian,Канал Дончиана (высокий уровень),Donchian alto,唐奇安高点,ドンチャン高値
Donchian Median,دونكان متوسط,Donchian Médian,Donchian mittel,Donchian közép,Donchian Median,Médio Donchian,Канал Дончиана (медианный уровень),Donchian medio,唐奇安中位,ドンチャン中央値
Donchian Low,دونكان منخفض,Donchian Faible,Donchian niedr.,Donchian alsó,Donchian Low,Baixo Donchian,Канал Дончиана (низкий уровень),Donchian bajo,唐奇安低点,ドンチャン安値
Mass Idx,مؤشر الكتلة,Indice de masse,Masse Idx,TömegIdx,Mass Idx,Índice de massa,Индекс массы,Índ. de masa,梅斯指标,マス指数
Bulge Threshold,عتبة الارتفاع المفاجئ,Seuil de renflement,Anschwellen des Grenzwerts,Kiugró határérték,Bulge Threshold,Limite da saliência,Порог повышения,Umbral de abultamiento,突出部门槛,バルジ閾値
Keltner,كيلتنر,Keltner,Keltner,Keltner,Keltner,Keltner,Канал Кельтнера,Keltner,肯特纳通道,ケルトナー
Keltner Top,كيلتنر علوي,Keltner Haut,Keltner Oben,Keltner csúcs,Keltner Top,Topo Keltner,Канал Кельтнера (верхний уровень),Keltner superior,肯特纳顶部,ケルトナー・トップ
Keltner Median,كيلتنر متوسط,Keltner Médian,Keltner Mitte,Keltner közép,Keltner Median,Média Keltner,Канал Кельтнера (медианный уровень),Keltner medio,肯特纳中位,ケルトナー中央値
Keltner Bottom,كيلتنر سفلي,Keltner Bas,Keltner Unten,Keltner alsó pont,Keltner Bottom,Fundo Keltner,Канал Кельтнера (нижний уровень),Keltner inferior,肯特纳底部,ケルトナー・ボトム
Minimum AF,معامل التسارع الأدني=ى,Fréquence audio minimale,Minimum AF,Minimum AF,Minimum AF,AF mínimo,Мин. AF,AF mínimo,最小AF,最小AF
Maximum AF,معامل التسارع الأقصى,Fréquence audio maximale,Maximum AF,Maximum AF,Maximum AF,AF máximo,Макс. AF,AF máximo,最大AF,最大AF
Klinger,كلنجر,Klinger,Klinger,Klinger,Klinger,Klinger,Клингер,Klinger,克林格指标,クリンガー
Signal Periods,فترات إشارات التداول,Périodes du signal,Signal-Perioden,Jelző értékű időszakok,Periodo di segnale,Períodos de sinalização,Периоды сигнала,Períodos de señal,信号周期,シグナル期間
KlingerSignal,إشارات تداول كلنجر,Signal Klinger,KlingerSignal,KlingerJelzés,Segnale Klinger,KlingerSignal,Сигнал Клингера,Señal Klinger,克林格信号,クリンガーシグナル
Rel Vig,مؤشر النشاط النسبي,Vigueur relative,Rel Vig,Rel Vig,Rel Vig,Vig rel,Относительная бодрость,Vig. rel.,相对能量指数指标,相対活性
RelVigSignal,إشارات مؤشر النشاط النسبي,Signal/Vigueur relative,RelVigSignal,RelVig-Jelzés,RelVigSignal,RelVigSignal,Сигнал относительной бодрости,Señal de vig. rel.,相对能量信号,相対活性シグナル
Elder Bull Power,مؤشر القوة الصاعدة الأكبر,Marge haussière Elder,Elder Bull Power,Elder bikaereje,Elder Power rialzista,Potência Elder Bull,Сила быков по Элдеру,Fuerza bajista (comprador) de Elder,爱耳德多头力量指标,エルダー・ブル・パワー
Elder Bear Power,مؤشر القوة الهابطة الأكبر,Marge baissière Elder,Elder Bear Power,Elder medvereje,Elder Power ribassista,Potência Elder Bear,Сила медведей по Элдеру,Fuerza alcista (vendedor) de Elder,爱耳德空头力量指标,エルダー・ベア・パワー
Elder Force,مؤشر القوة الأكبر,Elder Force,Elder Force,Elder-erő,Elder Force,Força Elder,Индекс силы Элдера,Fuerza de Elder,爱耳德强力指标,エルダー・フォース
LR Slope,منحدر الانحدار الخطي,Pente linéaire de l'indice Reg,LR Steigung,LR lejtő,LR Slope,Declive LR,Наклон линейной регрессии,Pendiente LR,线斜率,線形回帰傾き
Slope,منحدر,Pente,Steigung,Lejtő,Slope,Declive,Наклон,Pendiente,斜率,傾き
Shading,الظل,Nuance,Schattierung,Különbözet megállapítása,Gradazione,Sombreamento,Незначительное понижение,Sombreado,暗影,シェーディング
Pivot,المحور,Pivot,Drehpunkt,Pivot,Pivot,Eixo,Разворот,Pivote,轴心,ピボット
Resistance 1,المقاومة 1,Résistance 1,Widerstand 1,1. rezisztencia,Resistenza 1,Resistência 1,Устойчивость 1,Resistencia 1,压力1,抵抗線1
Support 1,الدعم 1,Support 1,Unterstützung 1,1. támogatás,Supporto 1,Suporte 1,Поддержка 1,Soporte 1,支撑1,支持線1
Resistance 2,المقاومة 2,Résistance 2,Widerstand 2,2. rezisztencia,Resistenza 2,Resistência 2,Устойчивость 2,Resistencia 2,压力2,抵抗線2
Support 2,الدعم 2,Support 2,Unterstützung 2,2. támogatás,Supporto 2,Suporte 2,Поддержка 2,Soporte 2,支撑2,支持線2
Resistance 3,المقاومة 3,Résistance 3,Widerstand 3,3 rezisztencia,Resistenza 3,Resistência 3,Устойчивость 3,Resistencia 3,压力3,抵抗線3
Support 3,الدعم 3,Support 3,Unterstützung 3,3. támogatása,Supporto 3,Apoio 3,Поддержка 3,Soporte 3,支撑3,支持線3
M Flow,السيولة,Flux monétaire,M Fluss,Pénzáramlás,Flusso M,Fluxo M,Денежный поток,Flujo M,现金流,マネーフロー
Jaw Period,فترة فك التمساح,Période mâchoire,Jaw Zeitraum,Jaw Period (Állkapocs időszak),Periodo Jaw,Período queixo,Период усреднения синей линии,Período de mandíbula,颌周期,ワニのアゴ
Jaw Offset,تعويض فك التمساح,Compensation mâchoire,Jaw Ausgleich,Jaw Offset (Állkapocs leállás),Compensazione Jaw,Offset queixo,Смещение синей линии,Compensación de mandíbula,颌抵消,ワニのアゴオフセット
Teeth Period,فترة أسنان التمساح,Période dents,Teeth Zeitraum,Teeth Period (Fogak időszak),Periodo Teeth,Período dentes,Период усреднения красной линии,Período de dientes,牙周期,ワニの歯
Teeth Offset,تعويض أسنان التمساح,Compensation dents,Teeth Ausgleich,Teeth Offset (Fogak leállás),Compensazione Teeth,Offset dentes,Смещение красной линии,Compensación de dientes,牙抵消,ワニの歯オフセット
Lips Period,فترة شفاة التمساح,Période lèvres,Lips Zeitraum,Lips Period (Ajkak időszak),Periodo Lips,Período lábios,Период усреднения зеленой линии,Período de labios,唇周期,ワニの唇
Lips Offset,تعويض شفاة التمساح,Compensation lèvres,Lips Ausgleich,Lips Offset (Ajkak leállás),Compensazione Lips,Offset lábios,Смещение зеленый линии,Compensación de labios,唇抵消,ワニの唇オフセット
Show Fractals,عرض فركتلات,Afficher fractales,Fraktale anzeigen,Fraktálok megmutat,Mostra frattali,Mostrar fractais,Показать фракталы,Mostrar fractales,显示分形,ディスプレイフラクタル
Jaw,الفك,Mâchoire,Jaw,Jaw (Állkapocs),Jaw,Queixo,Синяя линия (челюсти аллигатора),Mandíbula,颌,アゴ
Teeth,الأسنان,Dents,Teeth,Teeth (Fogak),Teeth,Dentes,Красная линия (зубы аллигатора),Dientes,牙,歯
Lips,الشفتان,Lèvres,Lips,Lips (Ajkak),Lips,Lábios,Зеленая линия (губы аллигатора),Labios,唇,唇
Gator,التمساح الأمريكي,Gator,Gator,Gator,Gator,Gator,Гатор,Gator,鳄鱼,ワニ
Conversion Line Period,فترة خط التحويل,Phase de transformation des valeurs,Konversionslinie Zeitraum,Konverziós vonal időszak,Periodo della linea di conversione,Período de conversão de linha,Период усреднения конверсионной линии,Período de línea de conversión,对话线周期,変換ライン期間
Base Line Period,فترة الخط الأساسي,Phase de référence,Basislinie Zeitraum,Alapvonal időszak,Periodi della linea di base,Período de linha de base,Период усреднения базовой линии,Período de línea base,基础线周期,基礎ライン期間
Leading Span B Period,فترة الدورة ب الرائدة,Phase principale et échelonnée B,Leading Span B Zeitraum,Leading Span B Period (Vezető B táv időszak),Periodo Leading Span B,Intervalo de liderança período B,Период опережения B,Período tramo B destacado,领先扩展B周期,リーディングスパンB期間
Lagging Span Period,فترة دورة أسوأ أداء,Phase retardée et échelonnée,Lagging Span Zeitraum,Lagging Span Period (Lemaradó táv időszak),Periodo Lagging Span,Período de duração de lag,Период отставания,Período de tramo rezagado,滞后扩展周期,ラギングスパン期間
Conversion Line,خط التحويل,Transformation des valeurs,Konversionslinie,Konverziós vonal,Linea di conversione,Linha de conversão,Конверсионная линия,Línea de conversión,对话线,変換ライン
Base Line,الخط الأساسي,Référence,Basislinie,Alapvonal,Linea di base,Linha de base,Базовая линия,Línea base,基础线,基礎ライン
Leading Span A,الدورة أ الرائدة,Principale et échelonnée A,Leading Span A,Leading Span A (Vezető A táv),Leading Span A,Intervalo de liderança A,Период опережения A,Tramo A destacado,领先扩展A,リーディングスパンA
Leading Span B,الدورة ب الرائدة,Principale et échelonnée B,Leading Span B,Lading Span B (Vezető B táv),Leading Span B,Intervalo de liderança B,Период опережения B,Tramo B destacado,领先扩展B,リーディングスパンB
Lagging Span,دورة أسوأ أداء,Échelonnée et retardée,Lagging Span,Lagging Span (Lemaradó táv),Lagging Span,Intervalo de liderança,Период отставания,Tramo rezagado,滞后扩展,ラギングスパン
P Rel,منسوب السعر,P Rel,P Rel,P Rel,P Rel,Rel P,Относительное значение цен,P rel.,价格相关,価格指数
Comparison Symbol,رمز المقارنة,Comparaison des symboles,Vergleichssymbol,Összehasonlító szimbólum,Simbolo di confronto,Símbolo de comparação,Символ сравнения,Símbolo de comparación,比较代码,比較記号
Vchart,رسم تخطيطي مرئي,Vchart,Vchart,Vdiagram,grafico V,Vchart,Vchart,Gráfica V,成交量图,Vチャート
Up Volume,حجم صاعد,Volume augmenté,Mehr Volumen,Felfelé haladó volumen,Up Volume,Subir volume,Объем повышения,Volumen arriba,上升成交量,アップ取引高
Down Volume,حجم هابط,Volume baissé,Weniger Volume,Lefelé haladó volumen,Down Volume,Descer volume,объем понижения,Volumen abajo,下降成交量,ダウン取引高
Use Volume,الاستفادة من حجم التداول,Utiliser Volume,Ausnutzen Volume,Hasznosítani volumen,Utilizzare Volume,Utilize volume,объем Использование,Utilizar Volumen,利用卷,ボリュームを利用し
vol undr,حجم أدنى,vol undr,vol undr,vol undr,vol undr,vol abai,vol undr,Debajo vol.,成交量下置,取引高アンダー
vol profile,ملف الحجم,profil du volume,vol Profil,vol profil,vol profile,Perfil do vol,профиль объемов,Perfil vol.,成交量特点,取引高プロフィール
Bars Color,لون الأشرطة,Couleur des barres,Farbige Balken,Sávszínek,Colore delle barre,Cor das barras,Цвет столбцов,Color de las barras,柱线颜色,バーカラー
Composite,مركب,Composé,Zusammensetzung,Összetett,Composito,Composto,Составной,Mixto,综合,総合
Divergence,الانحراف,Divergence,Abweichung,Divergencia,Divergenza,Divergência,Дивергенция,Divergencia,背离,ダイバージェンス
MA Period,MA فترة,Période moyenne mobile,MA-Zeitraum,MA időszak,Periodo MA (media mobile),Período MA,Период скользящей средней,Periodo MA,MA期间,MA 期間
Result,النتيجة,Résultat,Ergebnis,Eredmény,Risultato,Resultado,Результат,Resultado,结果,結果
Fill,التعبئة,Fill,Füllung,Kitöltés,Riempimento,Preencher,Заполнение,Rellenar,填入,フィル
Color,اللون,Couleur,Farbe,Szín,Colore,Cor,Цвет,Color,颜色,カラー
Axis Label,تسمية المحور,Libellé de l'axe,Achsenbeschriftung,Tengelycímke,Nome dell'asse,Rótulo do eixo,Обозначение оси,Etiqueta de eje,轴标签,軸ラベル
Candle Borders,حدود الشمعة,Encadrements de bougies,Kerzen-Ränder,Gyertyaszegélyek,Bordi grafico a candela,Rebordos em forma de velas,Границы свечи,Bordes de vela,蜡烛国界,キャンドルボーダー
Mountain Charts,مخططات الجبال,Graphiques en relief,Berg-Diagramme,Hegydiagramok,Grafici a montagna,Gráficos em forma de montanha,Графики в виде линий с заполнением,Gráficas de montaña,山峰图,マウンテンチャート
Gradient,المنحدر,Pente,Steigung,Gradiens,Gradiente,Gradiente,Градиент,Gradiente,斜率,グラデーション
Background Color,لون الخلفية,Couleur du fond,Hintergrundfarbe,Háttérszín,Colore dello sfondo,Cor de fundo,Фоновый цвет,Color de fondo,背景颜色,背景カラー
Share This Chart,شارك هذا المخطط,Partager ce graphique,Dieses Diagramm teilen,Diagram megosztása,Condividi questo grafico,Partilhar este gráfico,Поделиться этим графиком,Compartir esta gráfica,分享此图,このチャートを共有
Share,شارك,Partager,Teilen,Megosztás,Condividi,Partilhar,Поделиться,Compartir,分享此图,共有
To set your timezone use the location button below or scroll through the following list,لتعيين النطاق الزمني الخاص بك، استخدم زر الموقع أدناه أو انتقل خلال القائمة الآتية,Pour indiquer votre fuseau horaire veuillez utiliser le bouton Emplacement ci-dessous ou parcourir la liste suivante,Zur Einstellung Ihrer Zeitzone können Sie unten auf die die Standort-Schaltfläche klicken oder durch die folgende Liste scrollen,Időzónájának beállításához használja az alábbi helymegjelölő gombot vagy gördítse le az alábbi listát,Per impostare il tuo fuso orario usa il pulsante ubicazione che segue o fai scorrere l'elenco che segue,Para definir o seu fuso horário utilize o botão de localização abaixo ou navegue pela lista seguinte,Для установки часового пояса используйте расположенную внизу кнопку местоположения или прокрутите следующий список,Para fijar su zona horaria utilice el botón de ubicación de abajo o desplácese por la siguiente lista,使用上面的位置按钮或滚动查看跟踪清单设置你的时间区域,タイムゾーンを設定するには、以下のロケーションボタンを使用するか、以下のリストをスクロールしてください
Use My Current Location,استخدم موقعي الحالي,Utiliser mon emplacement actuel,Meinen aktuellen Standort verwenden,Használja a Saját jelenlegi helymeghatározást,Usa la mia ubicazione corrente,Utilizar a minha localização atual,Использовать мое текущее местоположение,Usar mi ubicación actual,使用我的当前位置,現在のロケーションを使用する
(Scroll for more options),(انتقل لمزيدٍ من الخيارات),(Faites défiler pour plus d'options),(Für weitere Optionen scrollen),(További lehetőségeket a legördülő listában talál),(Scroll for more options),(Desloque para mais opções),(Прокрутить для выбора других вариантов),(Desplazar para más opciones),（滚动查看更多选项）,（スクロールして他のオプションを表示）
Bar,الأعمدة,Barre,Balken,Sáv,Barra,Barras,Бар,Barra,直线,棒
Bars,أعمدة,Barres,Balken,Barok,Barre,Barras,Полосы,Barras,柱,バー
Colored Bar,الأعمدة الملونة,Barre en couleur,Farbiger Balken,Színes sáv,Barra colorata,Barra colorida,Цветной бар,Barra de color,彩条,カラー棒
Line,الخطوط,Ligne,Linie,Vonal,Linea,Linha,Линия,Línea,曲线,線
Colored Line,الخطوط الملونة,Ligne en couleur,Farbiger Linie,Színes vonal,Linea colorata,Linha colorida,цветной линия,Línea de color,色线,色付きのライン
Mountain,جبل,Montagne,Berg,Hegyi,Montagna,Montanha,Rора,Montaña,山,マウンテン
Baseline Delta,التغيير من خط الأساس,Changement de ligne de base,Veränderung vom Ausgangswert,Változás a kiindulási értékhez képest,Variazione al basale,Mudança da linha de base,изменение по сравнению с исходным,Cambio de línea de base,从基线的变化,ベースラインからの変化
Squarewave,Squarewave (موجة مربعة),Squarewave,Rechteck,Négyszögjel,Quadra,Squarewave,Squarewave,Ola Cuadrada,方波,方形
Hollow Candle,الشموع المفرغة,Bougie creuse,Hohl Kerze,Üreges gyertya,Candela Vuote,Vela vazia,пустая свеча,Vela hueca,空心蜡烛,陽線ローソク足
Volume Candle,شمعة الحجم,Volume en chandelle,Volumen Kerzenchart,Haladó gyertya,Grafico a Candele Volumetrico,Vela de volume,Объемная свеча,Vela de volumen,成交量K线图,出来高ローソク足
Chart Scale,مقياس الرسم البياني,Échelle du graphique,Darstellungsskala,Diagram beosztás,Scala Grafico,Escala do gráfico,Шкала графика,Escala de la gráfica,图表尺度,チャート目盛
Log Scale,المقياس اللوغارتمي,Logarithmique,Log-Skala,Logaritmikus beosztás,Scala Log,Logarítmica,Лог. шкала,Logaritmo,对数尺度,対数目盛
Chart Type,نوع الرسم البياني,Type de graphique,Diagrammtyp,Diagram típus,Tipo di grafico,Tipo de gráfico,Тип графика,Tipo de gráfico,图表类型,グラフの種類
Heikin-Ashi,Heikin-Ashi ( شموع الهيكن اشي),Heikin-Ashi,Heikin-Ashi,Heikin-Ashi,Heikin-Ashi,Heikin-Ashi,Heikin-Ashi,Heikin-Ashi,平均酒吧,平均足
Point & Figure,نقطة والشكل,Point & Figure,Point & Figure,Point & ábra,Point & Figure,Ponto & Figura,Точка & Рис,Punto y Figura,点与图,
Line Break,كسر خط,Saut de ligne,Leitungsbruch,Sortörés,Interruzione di riga,Quebra de linha,Разрыв строки,Salto de línea,线路中断,改行
Renko,Renko ( رينكو),Renko,Renko,Renko,Renko,Renko,Renko,Renko,砖形图,蓮子
Range Bars,أعمدة,Barres d'amplitude,Balken-Bandbreite,Barok tartománya,Barre di intervallo,Barras de intervalo,Пределы диапазона,Barras de intervalo,范围柱,レンジバー
Kagi,Kagi ( كاجي),Kagi,Kagi,Kagi,Kagi,Kagi,Kagi,Kagi,卡吉,ケーギ
Clear Drawings,مسح الرسومات,Effacer les dessins,Deutliche Zeichnungen,Ábrák törlése,Cancella Disegni,Limpar desenhos,Удалить изображения,Eliminar los dibujos,清空图示,描画をクリア
Studies,دراسات,Études,Studien,Elemzések,Studi,Estudos,Моделирование,Estudios,研究,スタディ
Timezone,المنطقة الزمنية,Plage horaire,Zeitzone,Időzóna,Fuso orario,Fuso horário,Часовой пояс,Zona horaria,时区,タイムゾーン
Change Timezone,تغيير المنطقة الزمنية,Modifier la plage horaire,Zeitzone ändern,Időzóna módosítása,Cambia fuso orario,Alterar fuso horário,Изменить часовой пояс,Cambiar zona horaria,更改时区,タイムゾーンの変更
Default Themes,الأنساق الافتراضية,Thèmes par défaut,Standardlayouts,Alapértelmezett témák,Temi di default,Temas padrão,Исходные темы,Temas predeterminados,默认主题,既定のテーマ
White,أبيض,Blanc,Weiß,Fehér,Bianco,Branco,Белая,Blanco,白色,白
Black,أسود,Noir,Schwarz,Fekete,Nero,Preto,Черная,Negro,黑色,黒
Custom Themes,أنساق مخصصة,Modèles personnalisés,Individuelle Layouts,Egyedi témák,Personalizza temi,Temas personalizados,Пользовательские темы,Temas personalizados,自定义主题,カスタムテーマ
New Custom Theme,نسق جديد مخصص,Nouveau modèle personnalisé,Neue individuelle Layouts,Új egyedi téma,Nuovo Tema Personalizzato,Novo tema personalizado,Создать пользовательскую тему,Nuevo tema personalizado,新自定义主题,新規カスタムテーマ
Select Tool,حدد أداة,Sélectionner Outil,Werkzeug,Eszköz,Seleziona,Selecionar,Выбор,Seleccionar,选择工具,選択ツール
None,لا شيء,Aucune,Keines,Egyik sem,Nessuno,Nenhuma,Без,Ninguna,无,なし
Crosshairs,علامات,Croix,Fadenkreuze,Célkeresztek,Mirini,Mira,Перекрестья,Cruz visor,十字线,十字
Annotation,تعليق توضيحي,Annotation,Anmerkung,Magyarázat,Annotazione,Anotação,Примечание,Anotación,注释,注釈
Horizontal,أفقي,Horizontal,Horizontal,Vízszintes,Orizzontale,Horizontal,Горизонт.,Horizontal,水平,水平
Segment,قطاع,Segment,Segment,Szegmens,Segmento,Segmento,Сегмент,Segmento,细分,区切り
Fill,التعبئة,Remplir,Füllen,Kitöltés,Riempimento,Preenchimento,Заливка,Relleno,填充,塗りつぶし
Line,خط,Ligne,Linie,Vonal,Linea,Linha,Линия,Línea,线条,線
save,حفظ,Sauvegarder,speichern,mentés,salva,guardado,сохранение,guardar,存档,保存
cancel,إلغاء,Annuler,abbrechen,mégse,annulla,cancelamento,отмена,cancelar,取消,キャンセル
Close,إغلاق,Fermer,Schließen,Bezárás,Chiudi,Fecho,Закрыть,Cerrar,关闭,閉じる
Create,إنشاء,Créer,Erstellen,Létrehozás,Crea,Criação,Создать,Crear,创建,新規作成
Show Zones,عرض المناطق,Afficher des zones,Zonen anzeigen,Zónák megjelenítése,Mostra Zone,Mostrar zonas,Показать зоны,Mostrar zonas,显示区域,ゾーンの表示
OverBought,مُبَالَغ في الشراء,Suracheté,Überkauft,Túlvásárolt,Ipercomprato,Sobrecompra,OverBought (перекупленность),Exceso compra,超买,買い持ち
OverSold,مُبَالَغ في البيع,Survendu,Überverkauft,Túlértékesített,Ipervenduto,Sobrevenda,OverSold (перепроданность),Exceso venta,超卖,売り持ち
Choose Timezone,اختر منطقة زمنية,Choisir la plage horaire,Zeitzone wählen,Időzóna kiválasztása,Scegli Fuso orario,Escolher o fuso horário,Выбор врем. пояса,Elegir zona horaria,选择时区,タイムゾーンの選択
Create a New Custom Theme,إنشاء نسق جديد,Créer un nouveau modèle personnalisé,Neues individuelles Layout erstellen,Új egyedi téma létrehozása,Crea Nuovo Tema Personalizzato,Criar novo tema personalizado,Создать новую пользовательскую тему,Crear un nuevo tema personalizado,创建新的自定义主题,カスタムテーマの新規作成
Candles,شموع,Bougies,Kerzen,Gyertyák,Candele,Velas,Свечи,Velas,蜡烛,ローソク足
Border,الحدود,Ligne frontière,Rand,Szegély,Margine,Limite,Контур,Borde,边框,境界
Background,الخلفية,Contexte,Hintergrund,Háttér,Sfondo,Fundo,Фон,Fondo,背景,背景
Grid Lines,خطوط الشبكة,Lignes de quadrillage,Gitterlinien,Rácsvonalak,Griglia,Linhas grelha,Линии сетки,Líneas de cuadrícula,网格线,グリッド線
Date Dividers,فواصل التاريخ,Caractères de séparation,Datentrenner,Dátumelválasztók,Divisori Data,Divisores de data,Раздел. полей дат,Divisores de fecha,日期分隔符,日付区切り
Axis Text,بيان المحاور,Titres des axes,Achsentext,Tengely szövege,Testo Asse,Texto eixo,Название оси,Texto del eje,轴标题,軸ラベル
New Theme Name,اسم النسق الجديد,Nom du nouveau modèle,Neuer Layoutname,Új téma neve,Nome Nuovo Tema,Novo nome do tema,Название темы,Nombre del nuevo tema,新主题名称,新規テーマ名
Save Theme,حفظ النسق,Sauvegarder,Speichern,Téma mentése,Salva Tema,Guardar,Сохранить,Guardar,保存主题,テーマの保存
CURRENCIES,العملات,DEVISES,DEVISEN,DEVIZÁK,VALUTE,MOEDAS,ВАЛЮТЫ,DIVISAS,货币,通貨
right-click to delete,انقر بزر الماوس الأيمن لإدارة,Faites un clic droit pour supprimer,Rechts klicken um zu löschen,kattintson jobb gombbal az egér hogy törölni,destro del mouse per cancellare,Botão direito do mouse para apagar,Щелкните правой кнопкой мыши чтобы удалить,botón derecho para borrar,右键单击鼠标删除,削除するには、右クリック
right-click to manage,انقر بزر الماوس الأيمن لحذف,Faites un clic droit pour gérer,Rechts klicken um zu verwalten,kattintson jobb gombbal az egér hogy kezelni,destro del mouse per gestire,Botão direito do mouse para gerenciar,Щелкните правой кнопкой мыши чтобы управлять,botón derecho para manejar,右键单击管理,管理するために、右クリック
Events,أحداث,Événement,Ereignisse,Események,Eventi,Eventos,События,Eventos,事件,イベント
Neutral,محايد,Neutre,Neutral,Semleges,Neutro,Neutro,Нейтраль,Neutro,中性,中立
PMOSignal,إشارة بي إم أو,Signal PMO,PMOSignal,PMO-jelzés,Segnale PMO,PMOSignal,PMOSignal,Señal PMO,PMO信号,PMOSignal
Double Smoothing Period,فترات التنعيم المزدوجة %K,Période double de lissage,Doppelter Glättungszeitraum,Dupla kiegyenlítő időszak,Doppio periodi di lisciatura,Período de suavização dupla,Период двойного сглаживания,Período de uniformidad doble,双平滑期间,2重平滑期間
Lightest Rate of Change Period,أخف فترة لنسبة التغير,Taux le plus léger de période de transition,Niedrigster Kurs des Änderungszeitraums,Az időszak amikor a legenyhébb a változás mértéke,Periodo con il tasso di variazione più leggero,Período de menor taxa de troca,Период легчайшей нормы изменений,Tasa más baja de periodo de cambio,变化率最小期间,変動期間の最低レート
Lightest SMA Period,أخف فترة إس إم أيه,Période de moyenne mobile simple la plus légère,Niedrigster Kurs während des einfachen gleitenden Durchschnittszeitraums,Legenyhébb SMA-időszak,Periodo con la SMA più leggera,Período SMA mais leve,Период легчайшей простой скользящей средней,Periodo de SMA más bajo,最小SMA期间,最低SMA期間
Light Rate of Change Period,أخف فترة لنسبة التغير,Taux léger de période de transition,Niedriger Kurs während des Änderungszeitraums,Időszak amikor enyhe a változás mértéke,Periodo con tasso di variazione leggero,Período de baixa taxa de troca,Период легкой нормы изменений,Tasa baja de periodo de cambio,变化率小期间,変動期間の低レート
Light SMA Period,أخف فترة إس إم أيه,Période de moyenne mobile simple léger,Niedriger Kurs während des einfachen gleitenden Durchschnittszeitraums,Enyhe SMA-időszak,Periodo con SMA leggera,Período SMA baixo,Период легкой простой скользящей средней,Periodo de SMA bajo,小SMA期间,低SMA期間
Heaviest Rate of Change Period,أثقل فترة لنسبة التغير,Taux le plus lourd de période de transition,Höchster Kurs des Änderungszeitraums,Az időszak amikor a legsúlyosabb a változás mértéke,Periodo con il tasso di variazione più pesante,Período de maior taxa de troca,Период тяжелейшей нормы изменений,Tasa más elevada de periodo de cambio,变化率最大期间,変動期間の最高レート
Heaviest SMA Period,أثقل فترة إس إم أيه,Taux le plus lourd de période de moyenne mobile simple,Höchster Kurs während des einfachen gleitenden Durchschnittszeitraums,Legsúlyosabb SMA-időszak,Periodo con SMA più pesante,Período maior de SMA,Период тяжелейшей простой скользящей средней,Periodo de SMA más elevado,最大SMA期间,最高SMA期間
Heavy Rate of Change Period,أثقل فترة لنسبة التغير,Taux lourd de période de transition,Hoher Kurs des Änderungszeitraums,Az időszak amikor súlyos a változás mértéke,Periodo con tasso di variazione pesante,Período de grande taxa de troca,Период тяжелой нормы изменений,Tasa elevada de periodo de cambio,变化率大期间,変動期間の高レート
Heavy SMA Period,أثقل فترة إس إم أيه,Période de moyenne mobile simple lourd,Hoher Kurs während des einfachen gleitenden Durchschnittszeitraums,Súlyos SMA-időszak,Periodo con SMA pesante,Período maior de SMA,Период тяжелой простой скользящей средней,Periodo de SMA elevado,大SMA期间,高SMA期間
KSTSignal,KST إشارة,Signal KST,KSTSignal,KST-jelzés,Segnale KST,KSTSignal,KSTSignal,Señal KST,KST信号,KSTSignal
HHV/LLV Lookback,HHV/LLV مراجعة,HHV/LLV rétroviseur,HHV/LLV LookBack,HHV/LLV visszatekintés,Loookback HHV/LLV,HHV/LLV Lookback,Ретроспективный обзор HHV/LLV,HHV/LLV en retrospección,HHV/LLV回顾,HHV/LLV ルックバック
Positive Bar,عمود إيجابي,Barre positive,Positiver Balken,Pozitív bar,Barra positiva,Barra positiva,Положительная граница,Barra positiva,正柱,ポジティブバー
Negative Bar,عمود سلبي,Barre négative,Negativer Balken,Negatív bar,Barra negativa,Barra negativa,Отрицательная граница,Barra negativa,负柱,ネガティブバー
Underlay,طبقة تحتية,Sous-couche,Grundlage,Süppedés,Substrato,Subjacente,Под кривой,Subyacente,基础,アンダーレイ
Callout,طلب,Référence,Angabe,Kihívás,Fumetto,Período de disponibilidade,Сноска,Llamada,卖出,コールアウト
Channel,قناة,Canal,Kanal,Channel,Canale,Canal,Канал,Canal,通道,チャネル
Pitchfork,مذراة,Fourche,Gabel-Chart,Pitchfork,Pitchfork,Forquilha,Вилка,Horquilla,叉子,ピッチフォーク
Gartley,غارتلي,Gartley,Gartley,Gartley,Gartley,Gartley,Гартли,Gartley,Gartley形态,ガートレイ
Elder Impulse System,نظام الدفاع الأكبر,Système Impulse Elder,Elder Impulse System,Elder impulzus rendszer,Sistema impulsi di Elder,Sistema de impulso ancião,Импульсная система Элдера,Sistema de impulso de Elder,较长的脉冲系统,エルダー・インパルス・システム
Choppiness Index,مؤشر الاضطراب,Indice Choppiness,Choppiness-Index,Változó irányokat mutató (Choppiness) index,Indice choppiness,Índice de ondas,Индекс зыбучести,Índice de fluctuación de tendencias,翻滚度指数,チョピネス・インデックス
Pring's Know Sure Thing,برينغز يعرف بالتأكيد,Know Sure Thing de Pring,Pring's Know Sure Thing,Pring Know Sure Thing oszcillátora,Indicatore Know Sure Thing di Pring,Pring sabe algo garantido,Индикатор Принга “Знать наверняка”,Oscilador “Know Sure Thing” de Pring,普林格确然指标,プリングのKST
Pring's Special K,خاص برينغز كيه,Spécial K de Pring,Pring's Special K,Pring Special K oszcillátora,Indicatore Special K di Pring,Special K da Pring,Индикатор Принга Special K,Oscilador “Special K” de Pring,普林格特殊K线,プリングの特殊K
Rainbow Moving Average,متوسط قوس قزح المتحرك,Moyenne mobile arc-en-ciel,Rainbow - gleitender Durchschnitt,Rainbow Moving átlag,Grafico media mobile ad arcobaleno,Média de movimento arco-íris,Радужная скользящая средняя,Media móvil Rainbow,彩虹移动平均值,虹色移動平均線
Rainbow Oscillator,قوس قزح المذبذب,Oscillateur arc-en-ciel,Rainbow-Oszillator,Rainbow oszcillátor,Oscillatore arcobaleno,Oscilador arco-íris,Радужный осциллятор,Oscilador Rainbow,彩虹震荡指标,レインボー・オシレーター
Price Momentum Oscillator,مذبذب السعر,Oscillateur de dynamique de prix,Preis-Oszillator,Ár momentum oszcillátor,Oscillatore Price Momentum,Oscilador de momentum de preço,Ценовой моментум-осциллятор,Oscilador de momento de precios,价格势头震荡指标,プライス・モメンタム・オシレーター
Disparity Index,مؤشر التفاوت,Indice de disparité,Disparitäts-Index,Diszparitási index,Indice disparità,Índice de disparidade,Индекс диспаритета,Índice de disparidad,差异指数,ディスパリティ・インデックス
Ulcer Index,مؤشر ألسر,Indice Ulcer,Ulcer-Index,Ulcer index,Indice dell'ulcera,Índice Ulcer,Индекс Ульцера,Índice Ulcer,终极波动指数,アルサー・インデックス
Display,عرض,Afficher,Anzeige,Megmutat,Visualizza,Visualizar,Отображение,Visualizar,显示,表示
Units,الوحدات,Unités,Einheiten,Egységek,Unità,Unidades,Единицы,Unidades,单位,単位
Stop Loss,وقف الخسارة,Stop Loss,Stop Loss,Stop loss,Stop Loss,Parar com perda,Стоп-лосс,Límite de pérdidas,止损,ストップロス
Take Profit,الحصول على الربح,Faire des bénéfices,Take Profit,Profitfelvétel,Take Profit,Recolher lucros,Тейк-профит,Límite de ganancias,止盈,テイクプロフィット
pips,نقاط,pips,Pips,pontok,pips,pips,пипсы,Pips,基点,pip
Unrealized Gain/Loss,ربح/خسارة محققة,Gain/perte non réalisé,Nicht realisierter Gewinn/Verlust,Nem realizált nyereség/veszteség,Guadagni/perdite non realizzate,Ganhos/perdas não realizadas,Нереализованная прибыль/убыток,Ganancias/pérdidas no realizadas,未实现收益/亏损,未実現利益/損失
Add Stop Loss,أضف وقف الخسارة,Ajouter Stop Loss,Stop Loss hinzufügen,Stop loss hozzáadása,Aggiungi Stop Loss,Adicionar parar perda,Добавить стоп-лосс,Añadir límite de pérdidas,增加止损,ストップロスを追加
Add Take Profit,الحصول على الربح,Ajouter faire des bénéfices,Take Profit hinzufügen,Profitfelvétel hozzáadása,Aggiungi Take Profit,Adicionar recolher lucros,Добавить тейк-профит,Añadir límite de ganancias,增加止盈,テイクプロフィットを追加
Risk/Reward,مخاطرة/مكافأة,Risque/Récompense,Risiko/Chance,Kockázat/Díjazás,Rischio/Rendimento,Risco/recompensa,Риск/Вознаграждение,Riesgo/Recompensa,风险/回报,リスク/リワード
Name,اسم,Nom,Name,Név,Nome,Nome,Имя,Nombre,名称,名称
Darvas Box,صندوق دارفاس,Boîte Darvas,Darvas-Box,Darvas doboz,Scatole di Darvas,Caixa Darvas,Область Дарваса,Caja de Darvas,股票箱理论,ダーバス・ボックス
All-Time High Lookback Period,مراجعة كل أوقات الفترة الماضية,Période de rétrospection élevée tout le temps,Allzeithoch Beobachtungszeitraum,Mindenkori magas számú visszatekintési időszak,Periodo con lookback più alto di tutti i tempi,Período de Lookback mais alto de sempre,Период ретроспективного анализа абсолютных максимумов,Periodo retrospectivo alto general,随时高回顾期间,過去最高値遡及（ルックバック）期間
Exit Field,حقل الخروج,Sortir du champ,Ausstiegsfeld,Kilépő mező,Campo di uscita,Sair do campo,Выйти из поля,Campo de salida,退出领域,出口フィールド
Ghost Boxes,صناديق الشبح,Boîtes à fantôme,Ghost-Boxes,Szellemdobozok,Ghost Box,Caixas fantasma,Области Госта,Cajas fantasma,幽灵盒,ゴースト・ボックス
Stop Levels,مستويات التوقف,Nveaux d'arrêt,Stopp-Niveaus,Szintek leállítása,Livelli di stop,Níveis de paragem,Уровни остановки,Niveles de límite,止位,ストップ水準
Level Offset,مستوى التوازن,Décalage de niveau,Niveau-Ausgleich,Szintek kiegyenlítése,Offset livello,Nivelar Offset,Смещение уровня,Desviación de nivel,位移,オフセット水準
Volume Spike,حجم سبايك,Volume Spike,Volumen Höchstwert,Volumen kicsúcsosodás,Spike dei volumi,Pico de volume,“Шпилька” объема,Punta de volumen,柱状成交量,出来高スパイク
Volume % of Avg,متوسط الحجم %,% de moyenne volume,Volumen in % des Durchschnitts,Átlag %-nak volumene,% di volume della media,Percentagem de volume na média,Объем % от среднего,% de volumen de la media,平均成交量%,平均出来高（%）
Price Minimum,السعر الأمثل,Prix minimum,Preisuntergrenze,Árminimum,Minimo del prezzo,Preço mínimo,Ценовой минимум,Precio mínimo,最低价,最低価格
Darvas,دارفاس,Darvas,Darvas,Darvas,Darvas,Darvas,Дарвас,Darvas,达瓦斯,ダーバス
Ghost,شبح,Fantôme,Ghost,Szellem,Ghost,Fantasmas,Гост,Fantasma,幽灵,ゴースト
Levels,مستويات,Niveaux,Niveaus,Szintek,Livelli,Níveis,Уровни,Niveles,水平,水準
Don't see your study below? Type in your search here.,ألا ترى دراستك أدناه؟ اطبع البحث الخاص بك هنا.,Vous e voyez pas votre étude ci-dessous ? Tapez votre recherche ici.,Können Sie die unten angeführte Studie nicht sehen? Geben Sie hier Ihre Suche ein.,Nem látja a felmérését lent? Ide írja a keresett elemet.,Non trovi qui sotto lo studio che ti interessa? Digita qui per cercare.,Não encontra o seu estudo em baixo? Escreva a sua pesquisa aqui.,Не видите результатов своего анализа ниже? Впишите предмет Вашего поиска сюда.,¿No ve sus estudio más abajo? Introduzca aquí su término de búsqueda.,下方未看到您的研究？在此键入您的搜索。,調査結果が以下に見当たりませんか？こちらに検索ワードを入力してください。
Show All,إظهار الكل,Afficher Tout,Alle anzeigen,Mindet megmutat,Mostra tutti,Mostrar tudo,Показать все,Mostrar todo,显示所有,全部表示
Supertrend,إتجاه مرتفع,Supertendance,Supertrend,Szupertrend,Supertrend,Supertendência,Супертренд,Supertendencia,超级趋势,スーパートレンド
Uptrend,إتجاه عالي,Tendance à la hausse,Aufwärtstrend,Felfelé haladó trend,Uptrend,Tendência de aumentar,Восходящий тренд,Tendencia al alza,上升趋势,上昇トレンド
Downtrend,إتجاه منخفض,Tendance à la baisse,Abwärtstrend,Lefelé haladó trend,Downtrend,Tendência de baixar,Нисходящий тренд,Tendencia a la baja,下降趋势,下降トレンド
Chart Shared Successfully!,تم مشاركة الرسم البياني بنجاح!,Tableau partagé avec succès !,Chart wurde erfolgreich geteilt!,A chartot sikeresen megosztotta!,Grafico condiviso con successo!,Gráfico partilhado com sucesso!,График успешно опубликован!,¡Gráfica compartida correctamente!,成功分享图表！,チャートの共有が完了しました！
Use the following link to share your chart:,استخدم الرابط التالي لمشاركة رسمك البياني,Utilisez le lien suivant pour partager votre tableau,Verwenden Sie den nachfolgenden Link\u002c um Ihren Chart zu teilen,A chart megosztásához használja az alábbi hivatkozást,Usa il link seguente per condividere il tuo grafico,Utilize a seguinte ligação para partilhar o seu gráfico,Для публикации Вашего графика используйте следующую ссылку,Utilizar el siguiente enlace para compartir su gráfica,使用下列链接分享你的图表,次のリンクを使ってチャートを共有してください
Open shared chart in new window,افتح الرسم البياني الذي تم مشاركته في نافذة جديدة,Ouvrir le tableau partagé dans une nouvelle fenêtre,Geteilten Chart in neuem Fenster öffnen,Megosztott chart megnyitása új ablakban,Apri il grafico condiviso in una nuova finestra,Abrir o gráfico partilhado numa nova janela,Открыть опубликованный график в новом окне,Abrir la gráfica compartida en una nueva ventana,在新窗口中打开分享的图表,新しいウィンドウで共有チャートを開く
New Theme Name:,اسم الموضوع الجديد:,Nouveau nom du thème :,Neuer Themenname:,Az új téma neve:,Nuovo nome del tema:,Novo nome do tema:,Название новой темы:,Nuevo nombre de tema:,新的主题名称：,新しいテーマ名：
Symbol,الرمز,Symbole,Symbol,Szimbólum,Simbolo,Símbolo,Символ,Símbolo,用户名,シンボル
Demo data.,.البيانات تجريبي,Les données de démonstration.,Demo-Daten.,Demo adatokat.,Dati demo.,Dados de demonstração.,Демо-данные.,Datos de demostración.,示范数据。,デモデータ。
Market Data,بيانات السوق,Données du marché,Marktdaten,Market Data,Dati di mercato,Dados de mercado,Данные рынка,Datos del mercado,市场数据,市場データ
 by Xignite., Xignite بواسطة, par Xignite., von Xignite., által Xignite., per Xignite., por Xignite., по Xignite., por Xignite.,由Xignite。,Xigniteによる。
Formula courtesy ,صيغة بفضل ,Formule grâce à ,Formel dank ,Formula köszönhetően ,Formula grazie a ,Fórmula graças à ,Формула благодаря ,Fórmula gracias a ,公式感谢,式のおかげで
Data is randomized.,.البيانات غير العشوائية,Les données sont randomisées.,Daten randomisiert.,Az adatok véletlen.,I dati è randomizzato.,Dados é aleatório.,Данные рандомизированных.,De datos es aleatorizado.,数据是随机的。,データがランダム化されます。
Data is real-time.,.البيانات هو الوقت الحقيقي,Les données sont en temps réel.,Die Daten werden in Echtzeit.,Az adatok valós időben.,I dati sono in tempo reale.,Os dados estão em tempo real.,Данные в режиме реального времени.,Los datos es en tiempo real.,数据是实时的。,データはリアルタイムです。
Data delayed 15 min.,.جميع البيانات متأخرة 15 دقيقة,Données retardées 15 min.,Daten verzögert 15 min.,Adat késleltetve 15 perc.,Dati ritardato 15 min.,Dados atrasado 15 min.,Данные с задержкой 15 мин.,Datos retrasó 15 minutos.,数据延迟15分钟。,データは15分遅れ。
BATS BZX real-time.,.في الوقت الحقيقي BATS BZX,BATS BZX en temps réel.,BATS BZX Echtzeit .,BATS BZX valós időben.,BATS BZX in tempo reale.,BATS BZX em tempo real.,BATS BZX в режиме реального времени.,BATS BZX en tiempo real.,BATS BZX实时性。,BATSはリアルタイムBZX。
End of day data.,.البيانات من نهاية اليوم,Les données de la fin de la journée.,Daten von dem Ende des Tages.,Az adatok a nap végén.,I dati della fine della giornata.,Os dados a partir do final do dia.,Данные полученные в конце рабочего дня.,Los datos de la final del día.,从一天结束的数据。,一日の終わりからのデータ。
*/});
		
		
	/**
	 * This list must be kept up to date with all words requiring translation 
	 * @memberOf CIQ.I18N
	 * @type {Object}
	 */
	CIQ.I18N.wordLists={
			"en":{"1D":"",
				"1 D":"",
				"3 D":"",
				"1 W":"",
				"2 Wk":"",
				"1 Mo":"",
				"5 Min":"",
				"10 Min":"",
				"15 Min":"",
				"30 Min":"",
				"1 hour":"",
				"Chart":"",
				"Chart Style":"",
				"Candle":"",
				"Bar":"",
				"Colored Bar":"",
				"Monotone":"",
				"Line":"",
				"Colored Line":"",
				"Hollow Candle":"",
				"Volume Candle":"",
				"Mountain":"",
				"Baseline Delta":"",
				"Squarewave":"",
				"Chart Type":"",
				"Heikin-Ashi":"",
				"Kagi":"",
				"Line Break":"",
				"Point & Figure":"",
				"Renko":"",
				"Range Bars":"",
				"Chart Scale":"",
				"Log Scale":"",
				"Events":"",
				"Studies":"",
				"Edit":"",
				"Delete":"",
				"Accumulative Swing Index":"",
				"Aroon":"",
				"Aroon Oscillator":"",
				"Average True Range":"",
				"Bollinger Bands":"",
				"Bollinger Bandwidth":"",
				"Center Of Gravity":"",
				"Chaikin Money Flow":"",
				"Chaikin Volatility":"",
				"Chande Forecast Oscillator":"",
				"Chande Momentum Oscillator":"",
				"Commodity Channel Index":"",
				"Coppock Curve":"",
				"Correlation Coefficient":"",
				"Detrended Price Oscillator":"",
				"Directional Movement System":"",
				"Donchian Channel":"",
				"Donchian Width":"",
				"Ease of Movement":"",
				"Ehler Fisher Transform":"",
				"Elder Force Index":"",
				"Elder Ray Index":"",
				"Fractal Chaos Bands":"",
				"Fractal Chaos Oscillator":"",
				"Gopalakrishnan Range Index":"",
				"High Low Bands":"",
				"High Minus Low":"",
				"Highest High Value":"",
				"Historical Volatility":"",
				"Intraday Momentum Index":"",
				"Keltner Channel":"",
				"Klinger Volume Oscillator":"",
				"Linear Reg Forecast":"",
				"Linear Reg Intercept":"",
				"Linear Reg R2":"",
				"Linear Reg Slope":"",
				"Lowest Low Value":"",
				"MACD":"",
				"Mass Index":"",
				"Median Price":"",
				"Momentum Indicator":"",
				"Money Flow Index":"",
				"Moving Average":"",
				"Moving Average Deviation":"",
				"Moving Average Envelope":"",
				"Negative Volume Index":"",
				"On Balance Volume":"",
				"Parabolic SAR":"",
				"Performance Index":"",
				"Positive Volume Index":"",
				"Pretty Good Oscillator":"",
				"Price Oscillator":"",
				"Price Rate of Change":"",
				"Price Volume Trend":"",
				"Prime Number Bands":"",
				"Prime Number Oscillator":"",
				"Psychological Line":"",
				"QStick":"",
				"Random Walk Index":"",
				"RAVI":"",
				"RSI":"",
				"Schaff Trend Cycle":"",
				"Shinohara Intensity Ratio":"",
				"Standard Deviation":"",
				"Stochastics":"",
				"Stochastic Momentum Index":"",
				"Stochastic Oscillator":"",
				"Swing Index":"",
				"Time Series Forecast":"",
				"Trade Volume Index":"",
				"TRIX":"",
				"True Range":"",
				"Twiggs Money Flow":"",
				"Typical Price":"",
				"Ultimate Oscillator":"",
				"Vertical Horizontal Filter":"",
				"Volume":"",
				"Volume Chart":"",
				"Volume Underlay":"",
				"Volume Oscillator":"",
				"Volume Rate of Change":"",
				"Vortex Indicator":"",
				"Weighted Close":"",
				"Williams %R":"",
				"ZigZag":"",
				"Accumulation/Distribution":"",
				"Timezone":"",
				"Change Timezone":"",
				"Default Themes":"",
				"Light":"",
				"Dark":"",
				"Custom Themes":"",
				"New Custom Theme":"",
				"Select Tool":"",
				"None":"",
				"Crosshairs":"",
				"Annotation":"",
				"Fibonacci":"",
				"Horizontal":"",
				"Horizontal Line":"",
				"Ray":"",
				"Segment":"",
				"Rectangle":"",
				"Ellipse":"",
				"Bell Curve":"",
				"Doodle":"",
				"Vertical":"",
				"Vertical Line":"",
				"Continuous":"",
				"Continuous Line":"",
				"Gartley":"",
				"Ellipse Center":"",
				"Ellipse Left":"",
				"Measure:":"",
				"Projection:":"",
				"Fill:":"",
				"Line:":"",
				"Crossline":"",
				"Speed Line":"",
				"Speed Arc":"",
				"Gann Fan":"",
				"Regression Line":"",
				"Quadrant Lines":"",
				"Tirone Levels":"",
				"Time Cycle":"",
				"O: ":"",
				"H: ":"",
				"V: ":"",
				"C: ":"",
				"L: ":"",
				"save":"",
				"cancel":"",
				"Create":"",
				"Show Zones":"",
				"OverBought":"",
				"OverSold":"",
				"Choose Timezone":"",
				"Close":"",
				"Shared Chart URL":"",
				"Share This Chart!":"",
				" Share":"",
				"Create a New Custom Theme":"",
				"Candles":"",
				" Border":"",
				"Line/Bar/Wick":"",
				"Background":"",
				"Grid Lines":"",
				"Date Dividers":"",
				"Axis Text":"",
				"Gradient":"",
				"New Theme Name:":"",
				"Save Theme":"",
				"right-click to delete":"",
				"right-click to manage":"",
				"rsi":"",
				"Period":"",
				"ma":"",
				"Field":"",
				"Type":"",
				"Offset":"",
				"MA":"",
				"macd":"",
				"Fast MA Period":"",
				"Slow MA Period":"",
				"Signal Period":"",
				"Signal":"",
				"stochastics":"",
				"Smooth":"",
				"Fast":"",
				"Slow":"",
				"Aroon Up":"",
				"Aroon Down":"",
				"Lin R2":"",
				"RSquared":"",
				"Lin Fcst":"",
				"Forecast":"",
				"Lin Incpt":"",
				"Intercept":"",
				"Time Fcst":"",
				"VIDYA":"",
				"R2 Scale":"",
				"STD Dev":"",
				"Standard Deviations":"",
				"Moving Average Type":"",
				"Trade Vol":"",
				"Min Tick Value":"",
				"Swing":"",
				"Limit Move Value":"",
				"Acc Swing":"",
				"Price Vol":"",
				"Pos Vol":"",
				"Neg Vol":"",
				"On Bal Vol":"",
				"Perf Idx":"",
				"Stch Mtm":"",
				"%K Periods":"",
				"%K Smoothing Periods":"",
				"%K Double Smoothing Periods":"",
				"%D Periods":"",
				"%D Moving Average Type":"",
				"%K":"",
				"%D":"",
				"Hist Vol":"",
				"Bar History":"",
				"Ultimate":"",
				"Cycle 1":"",
				"Cycle 2":"",
				"Cycle 3":"",
				"W Acc Dist":"",
				"Vol Osc":"",
				"Short Term Periods":"",
				"Long Term Periods":"",
				"Points Or Percent":"",
				"Chaikin Vol":"",
				"Rate Of Change":"",
				"Price Osc":"",
				"Long Cycle":"",
				"Short Cycle":"",
				"EOM":"",
				"CCI":"",
				"Detrended":"",
				"Aroon Osc":"",
				"Elder Force":"",
				"Ehler Fisher":"",
				"EF":"",
				"EF Trigger":"",
				"Schaff":"",
				"Coppock":"",
				"Chande Fcst":"",
				"Intraday Mtm":"",
				"Random Walk":"",
				"Random Walk High":"",
				"Random Walk Low":"",
				"Directional":"",
				"ADX":"",
				"+DI":"",
				"-DI":"",
				"High Low":"",
				"High Low Bands Top":"",
				"High Low Bands Median":"",
				"High Low Bands Bottom":"",
				"MA Env":"",
				"Shift":"",
				"Shift Percentage":"",
				"Shift Type":"",
				"Envelope Top":"",
				"Envelope Median":"",
				"Envelope Bottom":"",
				"Fractal High":"",
				"Fractal Low":"",
				"Prime Bands Top":"",
				"Prime Bands Bottom":"",
				"Bollinger Bands Top":"",
				"Bollinger Bands Median":"",
				"Bollinger Bands Bottom":"",
				"%b":"",
				"Keltner":"",
				"Keltner Top":"",
				"Keltner Median":"",
				"Keltner Bottom":"",
				"Donchian High":"",
				"Donchian Median":"",
				"Donchian Low":"",
				"Channel Fill":"",
				"High Period":"",
				"Low Period":"",
				"PSAR":"",
				"Minimum AF":"",
				"Maximum AF":"",
				"Klinger":"",
				"Signal Periods":"",
				"KlingerSignal":"",
				"Elder Bull Power":"",
				"Elder Bear Power":"",
				"LR Slope":"",
				"Slope":"",
				"Correlate":"",
				"ATR":"",
				"ATR Bands":"",
				"ATR Bands Bottom":"",
				"ATR Bands Channel":"",
				"ATR Bands Top":"",
				"STARC Bands":"",
				"STARC Bands Bottom":"",
				"STARC Bands Median":"",
				"STARC Bands Top":"",
				"ATR Trailing Stop":"",
				"Alligator":"",
				"Awesome":"",
				"Bandwidth":"",
				"Bars Color":"",
				"Base Line":"",
				"Base Line Period":"",
				"Boll %b":"",
				"Boll BW":"",
				"Bulge Threshold":"",
				"Buy Stops":"",
				"COG":"",
				"Chaikin MF":"",
				"Chande Mtm":"",
				"Comparison Symbol":"",
				"Conversion Line":"",
				"Conversion Line Period":"",
				"Days Per Year":"",
				"Decreasing Bar":"",
				"Divergence":"",
				"Down Volume":"",
				"Fade":"",
				"Fake":"",
				"Fractal Channel":"",
				"Fractal Chaos":"",
				"GAPO":"",
				"Gator":"",
				"Gopala":"",
				"Green":"",
				"HHV":"",
				"High Low Bottom":"",
				"High Low Median":"",
				"High Low Top":"",
				"High-Low":"",
				"HighLow":"",
				"Ichimoku Clouds":"",
				"Increasing Bar":"",
				"Index":"",
				"Jaw":"",
				"Jaw Offset":"",
				"Jaw Period":"",
				"LLV":"",
				"Lagging Span":"",
				"Lagging Span Period":"",
				"Leading Span A":"",
				"Leading Span B":"",
				"Leading Span B Period":"",
				"Lips":"",
				"Lips Offset":"",
				"Lips Period":"",
				"Long RoC":"",
				"M Flow":"",
				"MA Dev":"",
				"MA Env Bottom":"",
				"MA Env Median":"",
				"MA Env Top":"",
				"Mass Idx":"",
				"Med Price":"",
				"Momentum":"",
				"Multiplier":"",
				"Overlay":"",
				"P Rel":"",
				"Pivot":"",
				"Pivot Points":"",
				"Plot Type":"",
				"Pretty Good":"",
				"Price ROC":"",
				"Prime Bands Channel":"",
				"Prime Number":"",
				"PSY":"",
				"Resistance 1":"",
				"Resistance 2":"",
				"Resistance 3":"",
				"Sell Stops":"",
				"Shading":"",
				"Shinohara":"",
				"Short RoC":"",
				"Show Fractals":"",
				"Squat":"",
				"Strong Ratio":"",
				"Support 1":"",
				"Support 2":"",
				"Support 3":"",
				"Teeth":"",
				"Teeth Offset":"",
				"Teeth Period":"",
				"Tolerance Percentage":"",
				"Twiggs":"",
				"Up Volume":"",
				"Use Volume":"",
				"VT HZ Filter":"",
				"Vol ROC":"",
				"Vortex":"",
				"+VI":"",
				"-VI":"",
				"W MFI":"",
				"Weak Ratio":"",
				"Rel Vig":"",
				"RelVigSignal":"",
				"Rel Vol":"",
				"Smoothing Period":"",
				"Double Smoothing Period":"",
				"STD Period":"",
				"MA Period":"",
				"composite":"",
				"correl":"",
				"vchart":"",
				"vol profile":"",
				"vol undr":"",
				"Darvas Box":"",
				"All-Time High Lookback Period":"",
				"Exit Field":"",
				"Ghost Boxes":"",
				"Stop Levels":"",
				"Level Offset":"",
				"Volume Spike":"",
				"Volume % of Avg":"",
				"Price Minimum":"",
				"Darvas":"",
				"Ghost":"",
				"Levels":"",
				"Supertrend":"",
				"Uptrend":"",
				"Downtrend":"",
				"Gain":"",
				"Loss":"",
				"Balance of Power":"",
				"Trend Intensity Index":"",
				"Beta":"",
				"Simple":"",
				"Exponential":"",
				"Double Exponential":"",
				"Triple Exponential":"",
				"Hull":"",
				"Triangular":"",
				"Weighted":"",
				"Variable":"",
				"Time Series":"",
				"Welles Wilder":"",
				"VWAP":"",
				"Don't see your study below? Type in your search here.":"",
				"Show All":"",
				"Demo data.":"",
				"Market Data":"",
				" by Xignite.":"",
				"Formula courtesy ":"",
				"Data is randomized.":"",
				"Data is real-time.":"",
				"Data delayed 15 min.":"",
				"BATS BZX real-time.":"",
				"End of day data.":"",
				"Simulated data.":""
			}
	};

	return _exports;
});