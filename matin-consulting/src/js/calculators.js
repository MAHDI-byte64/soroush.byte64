// ===== Generic single-field calculators (modal) =====
var currentToolId = 1;
var toolsData = {
  2: { title: 'محاسبه تعداد و ابعاد پله (فرمول بلوندل)', desc: 'بر اساس ارتفاع کف تا کف.', inputs: [ { id: 'floorHeight', label: 'ارتفاع کف تا کف (سانتی‌متر):', type: 'number', value: 320 }, { id: 'stepTread', label: 'عرض کف پله پیشنهادی (سانتی‌متر):', type: 'number', value: 30 } ], calc: function(vals) { var h=parseFloat(vals.floorHeight)||320; var b=parseFloat(vals.stepTread)||30; var count=Math.round(h/17.5); var er=(h/count).toFixed(2); var bl=(2*er)+b; return 'تعداد پله‌ها: <strong style="color:#e0b354;">'+count+'</strong> عدد<br/>ارتفاع خیز هر پله: <strong style="color:#e0b354;">'+er+'</strong> cm<br/>آزمون بلوندل (۲h + b): <strong style="color:#e0b354;">'+bl.toFixed(1)+'</strong> cm ('+(bl>=62&&bl<=66?'استاندارد ✓':'نیاز به اصلاح')+')'; } },
  3: { title: 'محاسبه وزن میلگرد', desc: 'بر اساس قطر (جدول اشتال) و طول شاخه.', inputs: [ { id: 'rebarSize', label: 'قطر میلگرد (میلی‌متر):', type: 'number', value: 16 }, { id: 'rebarLength', label: 'طول کل میلگرد (متر):', type: 'number', value: 100 } ], calc: function(vals) { var d=parseFloat(vals.rebarSize)||16; var L=parseFloat(vals.rebarLength)||100; var wpm=(d*d)/162; var tk=wpm*L; return 'وزن هر متر میلگرد فی '+d+': <strong style="color:#e0b354;">'+wpm.toFixed(3)+'</strong> kg/m<br/>وزن کل: <span style="font-size:17px;color:#e0b354;font-weight:900;">'+tk.toFixed(1)+'</span> کیلوگرم ('+(tk/1000).toFixed(3)+' تن).'; } },
  5: { title: 'محاسبه ظرفیت آسانسور', desc: 'طبق مبحث ۱۵ مقررات ملی.', inputs: [ { id: 'floorsCount', label: 'تعداد کل طبقات بالای همکف:', type: 'number', value: 5 }, { id: 'unitsPerFloor', label: 'تعداد واحد در هر طبقه:', type: 'number', value: 2 } ], calc: function(vals) { var f=parseInt(vals.floorsCount)||5; var u=parseInt(vals.unitsPerFloor)||2; var tu=f*u; var cap='۶ نفره (۴۵۰ kg)'; var spd='۱.۰ m/s'; if(f>6||tu>16){cap='۸ نفره (۶۰۰ kg)';spd='۱.۶ m/s';} return 'ظرفیت پیشنهادی: <strong style="color:#e0b354;">'+cap+'</strong><br/>سرعت نامی: <strong style="color:#e0b354;">'+spd+'</strong><br/>تعداد واحدهای تحت پوشش: <strong style="color:#e0b354;">'+tu+'</strong> واحد.'; } },
  6: { title: 'محاسبه تراکم و زیربنای ساختمان', desc: 'بر اساس سطح اشغال و طبقات مجاز.', inputs: [ { id: 'landArea', label: 'مساحت کل زمین (مترمربع):', type: 'number', value: 300 }, { id: 'occupancyRate', label: 'درصد سطح اشغال مجاز (٪):', type: 'number', value: 60 }, { id: 'allowedFloors', label: 'تعداد طبقات مسکونی مجاز:', type: 'number', value: 5 } ], calc: function(vals) { var a=parseFloat(vals.landArea)||300; var o=parseFloat(vals.occupancyRate)||60; var fl=parseFloat(vals.allowedFloors)||5; var fp=a*(o/100); var ts=fp*fl; var den=(ts/a)*100; return 'سطح اشغال هر طبقه: <strong style="color:#e0b354;">'+fp.toFixed(1)+'</strong> m²<br/>زیربنای کل: <strong style="color:#e0b354;">'+ts.toFixed(1)+'</strong> m²<br/>درصد تراکم ساختمانی: <span style="font-size:17px;color:#e0b354;font-weight:900;">'+den.toFixed(0)+'٪</span>'; } },
  7: { title: 'محاسبه شیب رمپ پارکینگ', desc: 'محاسبه درصد شیب بر اساس ارتفاع و طول رمپ.', inputs: [ { id: 'heightDiff', label: 'اختلاف ارتفاع رمپ H (متر):', type: 'number', value: 3.0 }, { id: 'rampLength', label: 'طول افقی شیب‌دار رمپ L (متر):', type: 'number', value: 20 } ], calc: function(vals) { var h=parseFloat(vals.heightDiff)||0; var L=parseFloat(vals.rampLength)||0; if(h<=0||L<=0){return '<span style="color:#f59e0b;">لطفاً اختلاف ارتفاع و طول رمپ را وارد کنید.</span>';} var slope=(h/L)*100; var slant=Math.sqrt(h*h+L*L); var ratio=L/h; var flag; if(slope>17){flag='<div style="color:#f87171;margin-top:6px;">⛔ شیب بیش از حد مجاز (۱۷٪) است — طول باید بیشتر شود.</div>';} else if(slope>15){flag='<div style="color:#f59e0b;margin-top:6px;">⚠ شیب بین ۱۵٪ تا ۱۷٪ فقط در موارد خاص مجاز است.</div>';} else {flag='<div style="color:#4ade80;margin-top:6px;">✓ شیب در محدوده مجاز (حداکثر ۱۵٪) است.</div>';} return 'درصد شیب رمپ: <span style="font-size:17px;color:#e0b354;font-weight:900;">'+slope.toFixed(1)+'٪</span><br/>طول واقعی مسیر شیب‌دار: <strong style="color:#e0b354;">'+slant.toFixed(2)+'</strong> متر<br/>نسبت شیب: <strong style="color:#e0b354;">۱ به '+ratio.toFixed(1)+'</strong>'+flag; } },
  8: { title: 'محاسبه حجم بتن‌ریزی', desc: 'برآورد حجم بتن با احتساب پرت.', inputs: [ { id: 'slabArea', label: 'مساحت دال / فونداسیون (مترمربع):', type: 'number', value: 200 }, { id: 'slabThickness', label: 'ضخامت متوسط بتن (سانتی‌متر):', type: 'number', value: 30 } ], calc: function(vals) { var a=parseFloat(vals.slabArea)||200; var t=(parseFloat(vals.slabThickness)||30)/100; var n=a*t; var g=n*1.05; return 'حجم بتن خالص: <strong style="color:#e0b354;">'+n.toFixed(2)+'</strong> m³<br/>حجم سفارش با ۵٪ ضریب پرت: <span style="font-size:17px;color:#e0b354;font-weight:900;">'+g.toFixed(2)+'</span> متر مکعب.'; } },
  9: { title: 'محاسبه تعداد بلوک / آجر تیغه‌چینی', desc: 'برآورد تعداد بلوک برای دیوارها.', inputs: [ { id: 'wallLen', label: 'طول کل دیوارها (متر):', type: 'number', value: 50 }, { id: 'wallH', label: 'ارتفاع دیوار (متر):', type: 'number', value: 3 } ], calc: function(vals) { var l=parseFloat(vals.wallLen)||50; var h=parseFloat(vals.wallH)||3; var wa=l*h; var cn=wa/(0.20*0.40); var cw=Math.ceil(cn*1.05); return 'مساحت دیوارها: <strong style="color:#e0b354;">'+wa.toFixed(1)+'</strong> m²<br/>تعداد بلوک مورد نیاز (با ۵٪ ضایعات): <span style="font-size:17px;color:#e0b354;font-weight:900;">'+cw+'</span> عدد.'; } },
  10: { title: 'محاسبه مقدار متریال و ملات نما', desc: 'برآورد میزان سنگ و سیمان.', inputs: [ { id: 'facadeNetArea', label: 'مساحت خالص نما (مترمربع):', type: 'number', value: 180 } ], calc: function(vals) { var a=parseFloat(vals.facadeNetArea)||180; var st=(a*1.08).toFixed(1); var ce=Math.ceil(a*0.35); return 'متریال نما (با ۸٪ پرت): <strong style="color:#e0b354;">'+st+'</strong> m²<br/>سیمان مصرفی ملات: <span style="font-size:17px;color:#e0b354;font-weight:900;">'+ce+'</span> کیسه ۵۰ کیلویی.'; } },
  11: { title: 'محاسبه حجم مخزن آب ساختمان', desc: 'طبق مبحث ۱۶ (۷۵ لیتر به ازای هر نفر).', inputs: [ { id: 'resUnits', label: 'تعداد کل واحدهای مسکونی:', type: 'number', value: 10 }, { id: 'avgPeople', label: 'میانگین تعداد افراد هر واحد:', type: 'number', value: 3.5 } ], calc: function(vals) { var u=parseInt(vals.resUnits)||10; var p=parseFloat(vals.avgPeople)||3.5; var tp=u*p; var li=tp*75; return 'تعداد کل ساکنین: <strong style="color:#e0b354;">'+tp+'</strong> نفر<br/>حداقل حجم مخزن آب مصرفی: <span style="font-size:17px;color:#e0b354;font-weight:900;">'+li.toLocaleString('fa-IR')+'</span> لیتر ('+(li/1000).toFixed(2)+' m³).'; } }
};

function openCalculator(id){
  currentToolId=id;
  var d=toolsData[id];
  if(!d)return;
  document.getElementById('modalTitle').innerText=d.title;
  document.getElementById('modalDesc').innerText=d.desc;
  var c=document.getElementById('modalInputs');
  c.innerHTML='';
  d.inputs.forEach(function(inp){
    var div=document.createElement('div');
    div.className='cm-input-row';
    div.innerHTML='<label>'+inp.label+'</label><input type="'+inp.type+'" inputmode="decimal" id="'+inp.id+'" value="'+inp.value+'" />';
    c.appendChild(div);
  });
  document.getElementById('calcResultBox').classList.remove('show');
  document.getElementById('calcModal').style.display='flex';
}
function closeCalculator(){document.getElementById('calcModal').style.display='none';}
function runCurrentCalculation(){
  var d=toolsData[currentToolId];
  if(!d)return;
  var vals={};
  d.inputs.forEach(function(inp){var el=document.getElementById(inp.id);if(el)vals[inp.id]=el.value;});
  document.getElementById('calcResultText').innerHTML=d.calc(vals);
  document.getElementById('calcResultBox').classList.add('show');
}

// ===== Quake modal =====
function openQuake(){document.getElementById('quakeModal').classList.add('show');document.body.style.overflow='hidden';}
function closeQuake(){document.getElementById('quakeModal').classList.remove('show');document.body.style.overflow='';}

// ===== Parking calculator =====
function openParking(){document.getElementById('parkModal').classList.add('show');document.body.style.overflow='hidden';}
function closeParking(){document.getElementById('parkModal').classList.remove('show');document.body.style.overflow='';}
function switchUsage(){
  var v=document.getElementById('usage').value;
  document.getElementById('grp-res').classList.toggle('show',v==='res');
  document.getElementById('grp-office').classList.toggle('show',v==='office');
  document.getElementById('grp-comm').classList.toggle('show',v==='comm');
  document.getElementById('pcResult').classList.remove('show');
}
function calcParking(){
  var v=document.getElementById('usage').value;var total=0,sub='';
  if(v==='res'){
    var u1=parseInt(document.getElementById('u1').value)||0;
    var u2=parseInt(document.getElementById('u2').value)||0;
    var u3=parseInt(document.getElementById('u3').value)||0;
    total=(u1*1)+(u2*2)+(u3*3);
    sub='کاربری مسکونی — برای '+toFa(u1+u2+u3)+' واحد';
  }else if(v==='office'){
    var a=parseFloat(document.getElementById('office').value)||0;
    total=a>0?Math.ceil(a/50):0;
    sub='کاربری اداری — '+toFa(a)+' متر مربع';
  }else{
    var c=parseFloat(document.getElementById('comm').value)||0;
    total=c>0?Math.ceil(c/25):0;
    sub='کاربری تجاری — '+toFa(c)+' متر مربع';
  }
  document.getElementById('pcVal').innerText=toFa(total);
  document.getElementById('pcSub').innerText=sub+' — پارکینگ بدون مزاحم';
  document.getElementById('pcResult').classList.add('show');
}

// ===== Earthquake coefficient data & logic (Standard 2800 v4) =====
var SYS_DATA={"دیوارهای باربر":[{"n":"دیوارهای برشی بتن آرمه ویژه","H":50,"R":5,"Om":2.5,"Cd":5},{"n":"دیوارهای برشی بتن آرمه متوسط","H":50,"R":4,"Om":2.5,"Cd":4},{"n":"دیوارهای برشی بتن آرمه معمولی [1]","H":"-","R":3.5,"Om":2.5,"Cd":3.5},{"n":"دیوارهای برشی با مصالح بنایی مسلح","H":15,"R":3,"Om":2.5,"Cd":3},{"n":"دیوارهای متشکل از قاب های سبک فولادی سرد نورد و صفحات پوشش فولادی","H":15,"R":4,"Om":2,"Cd":3.5},{"n":"دیوارهای متشکل از قاب های سبک فولادی سرد نورد و مهارهای تسمه ای فولادی","H":15,"R":5.5,"Om":3,"Cd":4},{"n":"دیوارهای بتن پاششی سه بعدی","H":10,"R":3,"Om":2,"Cd":3}],"قاب ساختمانی":[{"n":"دیوارهای برشی بتن آرمه ویژه [2]","H":50,"R":6,"Om":2.5,"Cd":5},{"n":"دیوارهای برشی بتن آرمه متوسط","H":35,"R":5,"Om":2.5,"Cd":4},{"n":"دیوارهای برشی بتن آرمه معمولی [1]","H":"-","R":4,"Om":2.5,"Cd":3},{"n":"دیوارهای برشی با مصالح بنایی مسلح","H":15,"R":3,"Om":2.5,"Cd":2.5},{"n":"مهاربندی واگرای ویژه فولادی [2] و [3]","H":50,"R":7,"Om":2,"Cd":4},{"n":"مهاربندی کمانش تاب","H":50,"R":7,"Om":2.5,"Cd":5},{"n":"مهاربندی همگرای معمولی فولادی","H":15,"R":3.5,"Om":2,"Cd":3.5},{"n":"مهاربندی همگرای ویژه فولادی [2]","H":50,"R":5.5,"Om":2,"Cd":5}],"قاب خمشی":[{"n":"قاب خمشی بتن آرمه ویژه","H":200,"R":7.5,"Om":3,"Cd":5.5},{"n":"قاب خمشی بتن آرمه متوسط","H":35,"R":5,"Om":3,"Cd":4.5},{"n":"قاب خمشی بتن آرمه معمولی [1]","H":"-","R":3,"Om":3,"Cd":2.5},{"n":"قاب خمشی فولادی ویژه","H":200,"R":7.5,"Om":3,"Cd":5.5},{"n":"قاب خمشی فولادی متوسط","H":50,"R":5,"Om":3,"Cd":4},{"n":"قاب خمشی فولادی معمولی [1]","H":"-","R":3.5,"Om":3,"Cd":3}],"دوگانه یا ترکیبی":[{"n":"قاب خمشی ویژه (فولادی یا بتنی) + دیوارهای برشی بتن آرمه ویژه","H":200,"R":7.5,"Om":2.5,"Cd":5.5},{"n":"قاب خمشی بتن ارمه متوسط + دیوار برشی بتن آرمه ویژه","H":70,"R":6.5,"Om":2.5,"Cd":5},{"n":"قاب خمشی بتن ارمه متوسط + دیوار برشی بتن آرمه متوسط","H":50,"R":6,"Om":2.5,"Cd":4.5},{"n":"قاب خمشی فولادی متوسط + دیوار برشی بتن آرمه ویژه","H":50,"R":6,"Om":2.5,"Cd":4.5},{"n":"قاب خمشی فولادی ویژه + مهاربند واگرای ویژه فولادی","H":200,"R":7.5,"Om":2.5,"Cd":4},{"n":"قاب خمشی فولادی متوسط + مهاربند واگرای ویژه فولادی","H":70,"R":6,"Om":2.5,"Cd":5},{"n":"قاب خمشی فولادی ویژه + مهاربند همگرای ویژه فولادی","H":200,"R":7,"Om":2.5,"Cd":5.5},{"n":"قاب خمشی فولادی متوسط + مهاربند همگرای ویژه فولادی","H":70,"R":6,"Om":2.5,"Cd":5}],"کنسولی":[{"n":"سازه های فولادی یا بتن آرمه ویژه","H":10,"R":2,"Om":1.5,"Cd":2}]};
var CITY_DATA={"اردبیل":[["آبی بیگلو",0.3],["اردبیل",0.3],["اسلام آباد",0.3],["اصلاندوز",0.3],["اودلو",0.3],["بیله سوار",0.3],["پارس آباد",0.3],["تازه کندی",0.3],["جعفرآباد",0.3],["خلخال",0.3],["رضی",0.3],["زیوه",0.3],["سرعین",0.3],["شیران",0.3],["طالب قشلاقی",0.3],["عنبران",0.3],["فیروزآباد",0.35],["کریق",0.3],["کلور",0.35],["گرمی",0.3],["گیوی",0.3],["لاهرود",0.3],["مجیدآباد",0.3],["مرادلو",0.3],["مشکین شهر",0.3],["نمین",0.3],["نیارق",0.3],["نیر",0.3],["هشتجین",0.35],["هل آباد",0.3],["هیر",0.3]],"تهران":[["آبسرد",0.35],["ارجمند",0.35],["اسلامشهر",0.35],["اشتهارد",0.35],["الارد",0.35],["اندیشه",0.35],["باقرشهر",0.35],["برغان",0.35],["بومهن",0.35],["پاکدشت",0.3],["پردیس",0.35],["پیشوا",0.3],["تهران",0.35],["جواد آباد",0.3],["چهاردانگه",0.35],["چهل قز",0.35],["حسن آباد",0.3],["خاورشهر",0.35],["خدمات",0.3],["دماوند",0.35],["دیزین",0.35],["رباط کریم",0.3],["رودشور",0.3],["رودهن",0.35],["ری",0.35],["سربندان",0.35],["سعیدآباد",0.35],["سولقان",0.35],["شاهدشهر",0.35],["شریف آباد",0.3],["شهر جدید پرند",0.3],["شهریار",0.35],["صالح آباد",0.35],["صباشهر",0.35],["صفادشت",0.35],["طالقان",0.35],["غنی آباد",0.35],["فردوسیه",0.35],["فردیس",0.35],["فرودگاه امام خمینی",0.3],["فرون آباد",0.35],["فشم",0.35],["فیروزکوه",0.35],["قدس",0.35],["قرچک",0.3],["قزل حصار",0.35],["قلعه نو",0.3],["کرج",0.35],["کمال شهر",0.35],["کندر",0.35],["کوهسار",0.35],["کهریزک",0.35],["کیلان",0.35],["گچسر",0.35],["گرمابدر",0.35],["گرمدره",0.35],["گلستان",0.35],["لواسان",0.35],["ماهدشت",0.35],["محمد شهر",0.35],["مردآباد",0.35],["مشاء",0.35],["مشکین دشت",0.35],["ملارد",0.35],["نسیم شهر",0.35],["نظرآباد",0.35],["واریش",0.35],["وحیدیه",0.35],["ورامین",0.3],["وهن‌آباد",0.3],["ویره",0.35],["هشتگرد",0.35]],"اصفهان":[["اصفهان",0.25],["کاشان",0.3],["نجف آباد",0.25],["خمینی شهر",0.25],["شاهین شهر",0.3],["شهرضا",0.3],["مبارکه",0.3],["نطنز",0.3]],"فارس":[["شیراز",0.3],["مرودشت",0.3],["جهرم",0.3],["کازرون",0.3],["فسا",0.3],["لار",0.3],["داراب",0.3]],"خراسان رضوی":[["مشهد",0.3],["نیشابور",0.3],["سبزوار",0.3],["تربت حیدریه",0.3],["قوچان",0.35],["کاشمر",0.3]],"آذربایجان شرقی":[["تبریز",0.35],["مراغه",0.25],["میانه",0.35],["مرند",0.3],["بناب",0.25]],"آذربایجان غربی":[["ارومیه",0.3],["خوی",0.35],["مهاباد",0.3],["میاندوآب",0.25],["بوکان",0.25]],"البرز":[["کرج",0.35],["فردیس",0.35],["نظرآباد",0.35],["اشتهارد",0.35],["ماهدشت",0.35]],"خوزستان":[["اهواز",0.25],["آبادان",0.2],["خرمشهر",0.2],["دزفول",0.3],["اندیمشک",0.3],["ماهشهر",0.2]],"مازندران":[["ساری",0.3],["بابل",0.3],["آمل",0.3],["قائم شهر",0.3],["چالوس",0.3],["نوشهر",0.3]],"گیلان":[["رشت",0.3],["بندر انزلی",0.3],["لاهیجان",0.3],["آستارا",0.3],["تالش",0.3]],"کرمان":[["کرمان",0.35],["رفسنجان",0.3],["سیرجان",0.25],["بم",0.3],["جیرفت",0.3]],"یزد":[["یزد",0.25],["میبد",0.25],["اردکان",0.25],["بافق",0.3]],"همدان":[["همدان",0.3],["ملایر",0.3],["نهاوند",0.35],["تویسرکان",0.3]],"کرمانشاه":[["کرمانشاه",0.3],["اسلام آباد غرب",0.3],["سنقر",0.3],["کنگاور",0.35]],"قزوین":[["قزوین",0.35],["تاکستان",0.3],["آبیک",0.35]],"قم":[["قم",0.3]],"سمنان":[["سمنان",0.3],["شاهرود",0.3],["دامغان",0.35],["گرمسار",0.3]],"مرکزی":[["اراک",0.25],["ساوه",0.3],["خمین",0.25],["دلیجان",0.3]],"لرستان":[["خرم آباد",0.3],["بروجرد",0.35],["دورود",0.35],["الیگودرز",0.3]],"کردستان":[["سنندج",0.3],["سقز",0.3],["مریوان",0.35],["بانه",0.35]],"گلستان":[["گرگان",0.3],["گنبدکاووس",0.3],["علی آباد",0.3],["آق قلا",0.3]],"زنجان":[["زنجان",0.3],["ابهر",0.3],["خدابنده",0.3]],"بوشهر":[["بوشهر",0.3],["برازجان",0.3],["گناوه",0.3],["کنگان",0.3]],"هرمزگان":[["بندرعباس",0.3],["میناب",0.3],["قشم",0.3],["بندر لنگه",0.3]],"سیستان و بلوچستان":[["زاهدان",0.3],["زابل",0.3],["ایرانشهر",0.3],["چابهار",0.3]],"ایلام":[["ایلام",0.25],["دهلران",0.25],["ایوان",0.25]],"چهارمحال و بختیاری":[["شهرکرد",0.3],["بروجن",0.3],["فارسان",0.35]],"کهگیلویه و بویراحمد":[["یاسوج",0.3],["دوگنبدان",0.3],["دهدشت",0.3]],"خراسان جنوبی":[["بیرجند",0.3],["قائن",0.35],["فردوس",0.35]],"خراسان شمالی":[["بجنورد",0.3],["اسفراین",0.3],["شیروان",0.35]]};

function toFa(n){return String(n).replace(/[0-9]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d];});}

function initQuakeSelectors(){
  var provSel=document.getElementById('qProv');
  if(!provSel) return;
  Object.keys(CITY_DATA).forEach(function(p){var o=document.createElement('option');o.value=p;o.textContent=p;provSel.appendChild(o);});
  var groupSel=document.getElementById('qGroup');
  Object.keys(SYS_DATA).forEach(function(g){var o=document.createElement('option');o.value=g;o.textContent=g;groupSel.appendChild(o);});
}
function fillCities(){var p=document.getElementById('qProv').value;var cs=document.getElementById('qCity');cs.innerHTML='<option value="">— انتخاب شهر —</option>';if(!p||!CITY_DATA[p])return;CITY_DATA[p].forEach(function(row,i){var o=document.createElement('option');o.value=i;o.textContent=row[0];cs.appendChild(o);});}
function fillA(){var p=document.getElementById('qProv').value;var i=document.getElementById('qCity').value;if(p&&i!==''&&CITY_DATA[p]){var a=CITY_DATA[p][i][1];document.getElementById('qA').value=a;document.getElementById('qAhint').textContent='A از جدول پیوست ۱ استاندارد ۲۸۰۰ درج شد';}}
function onManualA(){document.getElementById('qAhint').textContent='مقدار A به‌صورت دستی وارد شد';}
function fillSystems(){var g=document.getElementById('qGroup').value;var ss=document.getElementById('qSystem');ss.innerHTML='<option value="">— انتخاب سیستم —</option>';if(!g||!SYS_DATA[g])return;SYS_DATA[g].forEach(function(it,i){var o=document.createElement('option');o.value=i;o.textContent=it.n+' (R='+toFa(it.R)+')';ss.appendChild(o);});document.getElementById('qR').value='';document.getElementById('qHmax').value='—';}
function fillR(){var g=document.getElementById('qGroup').value;var i=document.getElementById('qSystem').value;if(!g||i===''||!SYS_DATA[g])return;var it=SYS_DATA[g][i];document.getElementById('qR').value=it.R;document.getElementById('qRhint').textContent='R و Ω₀='+toFa(it.Om)+' و C_d='+toFa(it.Cd)+' از جدول';document.getElementById('qHmax').value=(it.H==='-'||it.H==='—')?'بدون محدودیت مشخص':toFa(it.H)+' متر';}

function soilCoef(soil, A){
  var T0={I:0.1,II:0.1,III:0.15,IV:0.15}[soil];
  var Ts={I:0.4,II:0.5,III:0.7,IV:1.0}[soil];
  var S,S0;
  if(soil=='I'){S=1.5;S0=1.0;}
  else if(soil=='II'){S=1.5;S0=1.0;}
  else if(soil=='III'){S=1.75;S0=1.1;}
  else{ if(A<0.3){S=2.25;S0=1.3;} else {S=1.75;S0=1.1;} }
  return {T0:T0,Ts:Ts,S:S,S0:S0};
}
function empT(sys,H,c){
  if(sys=='cbf') return 0.05*Math.pow(H,0.75);
  if(sys=='ebf') return 0.08*Math.pow(H,0.75)*c;
  if(sys=='steel-moment') return 0.08*Math.pow(H,0.75)*c;
  if(sys=='rc-moment') return 0.05*Math.pow(H,0.9)*c;
  if(sys=='dual') return 0.05*Math.pow(H,0.75);
  return 0.05*Math.pow(H,0.9)*c;
}
function calcQuake(){
  var Hchk=parseFloat(document.getElementById('qH').value);
  if(isNaN(Hchk)||Hchk<=0){var vErr=document.getElementById('qValidity');vErr.className='qvalidity show err';vErr.innerHTML='⛔ لطفاً ارتفاع ساختمان از تراز پایه (H) را وارد کنید.';document.getElementById('qResult').classList.remove('show');return;}
  var Tschk=parseFloat(document.getElementById('qTsoft').value);
  if(isNaN(Tschk)||Tschk<=0){var vErr2=document.getElementById('qValidity');vErr2.className='qvalidity show err';vErr2.innerHTML='⛔ لطفاً زمان تناوب تحلیلی/نرم‌افزار (T) را وارد کنید.';document.getElementById('qResult').classList.remove('show');return;}
  var A=parseFloat(document.getElementById('qA').value);
  var I=parseFloat(document.getElementById('qI').value);
  var soil=document.getElementById('qSoil').value;
  var R=parseFloat(document.getElementById('qR').value)||5;
  var tsys=document.getElementById('qTsys').value;
  var H=parseFloat(document.getElementById('qH').value)||0;
  var Tsoft=parseFloat(document.getElementById('qTsoft').value);
  var c=parseFloat(document.getElementById('qInfill').value);

  var vEl=document.getElementById('qValidity'); vEl.className='qvalidity';
  var g=document.getElementById('qGroup').value; var si=document.getElementById('qSystem').value;
  if(g&&si!==''&&SYS_DATA[g]){
    var it=SYS_DATA[g][si]; var hmax=it.H; var isVizhe=it.n.indexOf('ویژه')>-1;
    if(A>=0.35&&I>=1.4){
      if(!isVizhe){ vEl.className='qvalidity show err'; vEl.innerHTML='⛔ در پهنه خیلی‌زیاد با اهمیت خیلی‌زیاد فقط سیستم «ویژه» مجاز است.'; }
      else if(hmax!=='-'&&H>hmax){ vEl.className='qvalidity show warn'; vEl.innerHTML='⚠ ارتفاع H از حداکثر مجاز ('+toFa(hmax)+' متر) بیشتر است.'; }
      else { vEl.className='qvalidity show ok'; vEl.innerHTML='✓ سیستم و ارتفاع در محدوده مجاز است.'; }
    } else if(hmax==='-'){
      if((A>=0.3)&&I==1){ vEl.className='qvalidity show err'; vEl.innerHTML='⛔ این سیستم در پهنه خطر زیاد/خیلی‌زیاد مجاز نیست.'; }
      else if(I>=1.2){ vEl.className='qvalidity show err'; vEl.innerHTML='⛔ این سیستم برای ساختمان با اهمیت زیاد/خیلی‌زیاد مجاز نیست.'; }
      else if(H>15){ vEl.className='qvalidity show warn'; vEl.innerHTML='⚠ حداکثر ارتفاع مجاز ۱۵ متر است.'; }
      else { vEl.className='qvalidity show ok'; vEl.innerHTML='✓ سیستم و ارتفاع در محدوده مجاز است.'; }
    } else {
      if(H>hmax){ vEl.className='qvalidity show warn'; vEl.innerHTML='⚠ ارتفاع H از حداکثر مجاز ('+toFa(hmax)+' متر) بیشتر است.'; }
      else { vEl.className='qvalidity show ok'; vEl.innerHTML='✓ سیستم و ارتفاع در محدوده مجاز است.'; }
    }
  }

  var sc=soilCoef(soil,A);
  var Temp=empT(tsys,H,c);
  var T=Math.max(Math.min(Temp*1.25,Tsoft),Temp);
  var B1;
  if(T<sc.T0) B1=sc.S0+(sc.S-sc.S0+1)*(T/sc.T0);
  else if(T>sc.Ts) B1=(sc.S+1)*(sc.Ts/T);
  else B1=1+sc.S;
  var N;
  if(A>0.25){ if(T<sc.Ts) N=1; else if(T>4) N=1.7; else N=0.7/(4-sc.Ts)*(T-sc.Ts)+1; }
  else { if(T<sc.Ts) N=1; else if(T>4) N=1.4; else N=0.4/(4-sc.Ts)*(T-sc.Ts)+1; }
  var B=N*B1;
  var Craw=A*B*I/R;
  var Cmin=0.12*A*I;
  var C=Math.max(Craw,Cmin);
  var gov=C>Craw+1e-9?'کنترل با حداقل C<sub>min</sub>':'کنترل با رابطه اصلی';
  document.getElementById('qC').innerText=C.toFixed(4);
  document.getElementById('qCsub').innerHTML=gov+' — برش پایه V = وزن لرزه‌ای × '+toFa(C.toFixed(4));
  var steps=[
    ['زمان تناوب تجربی T', toFa(Temp.toFixed(3))+' ثانیه'],
    ['زمان تناوب طرح T', toFa(T.toFixed(3))+' ثانیه'],
    ['ضریب شکل طیف B₁', toFa(B1.toFixed(3))],
    ['ضریب اصلاح N', toFa(N.toFixed(3))],
    ['ضریب بازتاب B = N·B₁', toFa(B.toFixed(3))],
    ['C اصلی = A·B·I/R', toFa(Craw.toFixed(4))],
    ['C حداقل = ۰.۱۲·A·I', toFa(Cmin.toFixed(4))],
    ['T₀ / T_s / S خاک', toFa(sc.T0)+' / '+toFa(sc.Ts)+' / '+toFa(sc.S)]
  ];
  document.getElementById('qSteps').innerHTML=steps.map(function(s){return '<div class="qstep"><span>'+s[0]+'</span><span>'+s[1]+'</span></div>';}).join('');
  document.getElementById('qResult').classList.add('show');
}

export function initCalculators(){
  initQuakeSelectors();
  window.openCalculator=openCalculator;
  window.closeCalculator=closeCalculator;
  window.runCurrentCalculation=runCurrentCalculation;
  window.openQuake=openQuake;
  window.closeQuake=closeQuake;
  window.openParking=openParking;
  window.closeParking=closeParking;
  window.switchUsage=switchUsage;
  window.calcParking=calcParking;
  window.fillCities=fillCities;
  window.fillA=fillA;
  window.onManualA=onManualA;
  window.fillSystems=fillSystems;
  window.fillR=fillR;
  window.calcQuake=calcQuake;
}
