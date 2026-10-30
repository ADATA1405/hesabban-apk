// تست خودکار: توابع خالص را از www/index.html بیرون می‌کشد و بررسی می‌کند.
// اجرا: node tests/run.js
const fs=require("fs"),vm=require("vm"),path=require("path");
const html=fs.readFileSync(path.join(__dirname,"../www/index.html"),"utf8");
const src=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join("\n");
function grab(name){
  const i=src.search(new RegExp("function "+name+"\\s*\\("));
  if(i<0)throw new Error("تابع پیدا نشد: "+name);
  let j=src.indexOf("{",i),d=0,k=j;
  for(;k<src.length;k++){if(src[k]==="{")d++;else if(src[k]==="}"&&--d===0)break;}
  return src.slice(i,k+1);
}
const names=["div","g2j","j2g","jMonthLen","pad2","toFaDigits","toFaMoney","toEnDigits","parseAmount","canonicalDate","groupNum","accBalance"];
const ctx={DB:{tx:[],transfers:[]},MONTHS:[]};vm.createContext(ctx);
vm.runInContext(names.map(grab).join("\n"),ctx);
let pass=0,fail=0;
function eq(a,b,m){const ok=JSON.stringify(a)===JSON.stringify(b);ok?pass++:(fail++,console.log("✗",m,"\n   انتظار:",JSON.stringify(b),"\n   نتیجه:",JSON.stringify(a)));}
const C=ctx;
// تاریخ
eq(C.g2j(2026,3,21),[1405,1,1],"نوروز ۱۴۰۵");
eq(C.j2g(1405,1,1),[2026,3,21],"نوروز ۱۴۰۵ معکوس");
eq(C.g2j(2025,3,21),[1404,1,1],"نوروز ۱۴۰۴");
eq(C.g2j(2026,10,30),[1405,8,8],"۸ آبان ۱۴۰۵");
for(let y=1380;y<=1420;y++)for(let m=1;m<=12;m++)for(const d of [1,15,C.jMonthLen(y,m)]){
  const g=C.j2g(y,m,d);const b=C.g2j(g[0],g[1],g[2]);
  if(JSON.stringify(b)!==JSON.stringify([y,m,d])){eq(b,[y,m,d],"رفت‌وبرگشت "+y+"/"+m+"/"+d);}
}
eq(C.jMonthLen(1405,1),31,"فروردین");eq(C.jMonthLen(1405,7),30,"مهر");
eq(C.jMonthLen(1403,12),30,"اسفند کبیسه ۱۴۰۳");eq(C.jMonthLen(1404,12),29,"اسفند ۱۴۰۴");
// ارقام و مبلغ
eq(C.toFaMoney(1234567),"۱٬۲۳۴٬۵۶۷","جداکننده");
eq(C.toFaMoney(-5000),"−۵٬۰۰۰","منفی");
eq(C.toFaMoney(0),"۰","صفر");
eq(C.toEnDigits("۱٬۲۳۴"),"1234","فارسی به انگلیسی");
eq(C.toEnDigits("١٢٣"),"123","عربی به انگلیسی");
eq(C.parseAmount("۱۲۳٬۰۰۰"),123000,"parseAmount");
eq(Number.isNaN(C.parseAmount("")),true,"parseAmount خالی");
eq(C.groupNum("1234567.5"),"۱٬۲۳۴٬۵۶۷٫۵","groupNum اعشار");
// تاریخ canonical
eq(C.canonicalDate("1405/08/08"),"1405-08-08","canonical");
eq(C.canonicalDate("۱۴۰۵-۸-۸"),"1405-08-08","canonical فارسی");
eq(C.canonicalDate("1405/07/31"),"","مهر ۳۱ نامعتبر");
eq(C.canonicalDate("1404/12/30"),"","اسفند ۳۰ در سال غیرکبیسه");
eq(C.canonicalDate("1403/12/30"),"1403-12-30","اسفند ۳۰ کبیسه");
// مانده حساب
C.DB.tx=[{acc:"a",type:"income",amount:1000},{acc:"a",type:"expense",amount:300},{acc:"b",type:"income",amount:50}];
C.DB.transfers=[{from:"a",to:"b",amount:200}];
eq(C.accBalance({id:"a",balance:500}),1000,"مانده a");
eq(C.accBalance({id:"b",balance:0}),250,"مانده b");
console.log(`\n${pass} موفق، ${fail} ناموفق`);process.exit(fail?1:0);
