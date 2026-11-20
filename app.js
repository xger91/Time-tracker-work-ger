var S=[];try{S=JSON.parse(localStorage.getItem('wt')||'[]')}catch(e){}
function save(){try{localStorage.setItem('wt',JSON.stringify(S));localStorage.setItem('wtm',String(Date.now()))}catch(e){}}
var $=function(i){return document.getElementById(i)};
var p2=function(n){return String(n).padStart(2,'0')};
var tm=function(t){var d=new Date(t);return p2(d.getHours())+':'+p2(d.getMinutes())};
var dk=function(t){var d=new Date(t);return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())};
var dur=function(ms){var m=Math.round(ms/60000);return Math.floor(m/60)+' h '+p2(m%60)+' min'};
var len=function(x){return (x.e||Date.now())-x.s};
var opn=function(){return S.find(function(x){return !x.e})};
var ym=new Date();ym=ym.getFullYear()+'-'+p2(ym.getMonth()+1);
$('m2').value=ym;
var DN=['nd','pn','wt','śr','cz','pt','sb'];
var CF={};try{CF=JSON.parse(localStorage.getItem('wts'))||{}}catch(e){}
if(!(CF.norm>=0))CF.norm=8;if(!Array.isArray(CF.days))CF.days=[1,2,3,4,5];
if(!Array.isArray(CF.vac))CF.vac=[];if(!Array.isArray(CF.hol))CF.hol=[];if(!(CF.allow>=0))CF.allow=26;if(!Array.isArray(CF.off))CF.off=[];
var RM='m';
function saveC(){try{localStorage.setItem('wts',JSON.stringify(CF));localStorage.setItem('wtm',String(Date.now()))}catch(e){}}
function nm(){return CF.norm*3600000}
function isBase(k){return CF.days.indexOf(new Date(k+'T12:00').getDay())>=0}
function isH(k){return CF.hol.indexOf(k)>=0}
function isW(k){return isBase(k)&&CF.hol.indexOf(k)<0&&CF.vac.indexOf(k)<0}
function cnt(P,a){return P.keys.filter(function(k){return a.indexOf(k)>=0}).length}
function sd(ms){return (ms<0?'−':'+')+dur(Math.abs(ms))}
function sh(ms){return (ms<0?'-':'+')+hm(Math.abs(ms))}
function period(){var keys=[],lab,fn;
 if(RM==='w'){var d=new Date(($('w2').value||dk(Date.now()))+'T12:00');d.setDate(d.getDate()-(d.getDay()+6)%7);for(var i=0;i<7;i++){keys.push(dk(d));d.setDate(d.getDate()+1)}lab='Tydzień '+keys[0]+' – '+keys[6];fn='tydzien-'+keys[0]}
 else{var m=$('m2').value||ym,n=new Date(+m.slice(0,4),+m.slice(5,7),0).getDate();for(var j=1;j<=n;j++)keys.push(m+'-'+p2(j));lab=m;fn=m}
 return {keys:keys,lab:lab,fn:fn}}
function stats(P){var g=days(P.keys),tot=0,norm=0;P.keys.forEach(function(k){norm+=dn(k);if(g[k])tot+=sum(g[k])});return {g:g,tot:tot,norm:norm,ot:tot-norm}}
function ovt(st){var o=0;Object.keys(st.g).forEach(function(k){var d=sum(st.g[k])-dn(k);if(d>0)o+=d});return o}
function wdr(){$('wd').innerHTML=[[1,'Pn'],[2,'Wt'],[3,'Śr'],[4,'Cz'],[5,'Pt'],[6,'Sb'],[0,'Nd']].map(function(a){return '<button class="btn'+(CF.days.indexOf(a[0])>=0?' p':'')+'" data-d="'+a[0]+'">'+a[1]+'</button>'}).join('')}
$('wd').onclick=function(ev){var b=ev.target.closest('[data-d]');if(!b)return;var d=+b.dataset.d,i=CF.days.indexOf(d);if(i>=0)CF.days.splice(i,1);else CF.days.push(d);saveC();wdr();render()};
$('nh').value=CF.norm;$('nh').onchange=function(){var v=parseFloat(String(this.value).replace(',','.'));if(v>=0&&v<=24){CF.norm=v;saveC();render()}};
$('w2').value=dk(Date.now());$('w2').onchange=render;
function setRM(r){RM=r;$('m2').style.display=r==='m'?'':'none';$('w2').style.display=r==='w'?'':'none';$('rmM').className='btn'+(r==='m'?' p':'');$('rmW').className='btn'+(r==='w'?' p':'');render()}
$('rmM').onclick=function(){setRM('m')};$('rmW').onclick=function(){setRM('w')};
var VY=new Date().getFullYear();
function inY(a){return a.filter(function(k){return k.indexOf(VY+'-')===0}).sort()}
function lst(a,at){return a.length?a.map(function(k){return '<div class="row"><span>'+dl(k)+'.'+k.slice(0,4)+'</span><button class="btn d" data-'+at+'="'+k+'">Usuń</button></div>'}).join(''):'<span class="mut">Brak</span>'}
function vren(){var v=inY(CF.vac);$('yl').textContent=VY;$('al').value=CF.allow;$('rem').textContent='Pozostało: '+(CF.allow-v.length)+' dni';$('usd').textContent='Wykorzystano '+v.length+' z '+CF.allow;$('vl').innerHTML=lst(v,'v');$('hl2').innerHTML=lst(inY(CF.hol),'h');dren()}
$('dd').value=dk(Date.now());
function yc(k){return CF.vac.filter(function(x){return x.slice(0,4)===k.slice(0,4)}).length}
var DM='';
function dren(){var k=$('dd').value;if(!k)return;var v=CF.vac.indexOf(k)>=0,h=isH(k);$('xv').className='btn'+(v?' p':'');$('xh').className='btn'+(h?' p':'');$('ds').textContent=DM||(h?'Święto: wejście zablokowane':v?'Urlop (zostało '+(CF.allow-yc(k))+' dni w '+k.slice(0,4)+')':'')}
$('dd').onchange=function(){DM='';dren()};
$('dx').onclick=function(){if(!$('dd').value)return;$('xs').textContent='Dotknij zaznaczonej opcji, aby ją cofnąć.';$('mx').classList.add('on')};
$('xc').onclick=function(){$('mx').classList.remove('on')};
$('xv').onclick=function(){var k=$('dd').value;if(!k)return;var i=CF.vac.indexOf(k);DM='';$('mx').classList.remove('on');
 if(i>=0)CF.vac.splice(i,1);
 else{if(isH(k)){DM='Ten dzień jest świętem. Najpierw cofnij oznaczenie święta.';dren();return}
  if(!isBase(k)){DM='To dzień niepracujący według Twoich ustawień, więc urlop się nie liczy.';dren();return}
  CF.vac.push(k)}
 saveC();render()};
$('xh').onclick=function(){var k=$('dd').value;if(!k)return;var i=CF.hol.indexOf(k);DM='';$('mx').classList.remove('on');
 if(i>=0)CF.hol.splice(i,1);else{CF.hol.push(k);CF.vac=CF.vac.filter(function(x){return x!==k})}
 saveC();render()};
function tk(k){return CF.off.filter(function(o){return o.d===k}).reduce(function(t,o){return t+(o.t-o.f)*60000},0)}
function dn(k){return Math.max(0,(isW(k)?nm():0)-tk(k))}
function bank(){var all=days(''),ot=0;Object.keys(all).forEach(function(k){var d=sum(all[k])-dn(k);if(d>0)ot+=d});var tkn=CF.off.reduce(function(t,o){return t+(o.t-o.f)*60000},0),op=(CF.open||0)*3600000;return {ot:ot,tk:tkn,op:op,bal:ot-tkn+op}}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function fdt(t){var d=new Date(t);return dk(t)+' '+p2(d.getHours())+':'+p2(d.getMinutes())+':'+p2(d.getSeconds())}
function pdt(s){var m=/^(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d)(?::(\d\d))?$/.exec(String(s).trim());return m?new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+(m[6]||0)).getTime():NaN}
$('bc').onclick=function(){
 var L=['typ;od;do;wartosc'];
 S.slice().sort(function(a,b){return a.s-b.s}).forEach(function(x){L.push(['wpis',fdt(x.s),x.e?fdt(x.e):'',''].join(';'))});
 CF.vac.slice().sort().forEach(function(k){L.push(['urlop',k,'',''].join(';'))});
 CF.hol.slice().sort().forEach(function(k){L.push(['swieto',k,'',''].join(';'))});
 CF.off.forEach(function(o){L.push(['odbior',o.d+' '+hh(o.f)+':00',o.d+' '+hh(o.t)+':00',''].join(';'))});
 L.push('ustawienie;norma_godzin;;'+CF.norm);L.push('ustawienie;dni_pracujace;;'+CF.days.join('|'));L.push('ustawienie;pula_urlopu;;'+CF.allow);L.push('ustawienie;saldo_poczatkowe;;'+(CF.open||0));
 out('backup-czas-pracy-'+dk(Date.now())+'.csv','\ufeff'+L.join('\r\n'))};
$('ic').onclick=function(){$('fc').click()};
$('fc').onchange=function(){var f=this.files[0];this.value='';if(!f)return;
 f.text().then(function(t){
  var rows=t.replace(/^\ufeff/,'').split(/\r?\n/),ns=0,nv=0,nh=0,no=0,st=0,bad=0;
  rows.forEach(function(r,i){if(!r.trim()||(i===0&&/^typ;/i.test(r)))return;var c=r.split(';'),ty=(c[0]||'').trim().toLowerCase();
   if(ty==='wpis'){var s=pdt(c[1]),e=c[2]&&c[2].trim()?pdt(c[2]):null;if(isNaN(s)||(e!==null&&(isNaN(e)||e<=s))){bad++;return}
    if(S.some(function(x){return x.s===s&&x.e===e}))return;if(e===null&&opn())return;S.push({id:uid(),s:s,e:e});ns++}
   else if(ty==='urlop'||ty==='swieto'){var k=(c[1]||'').trim();if(!/^\d{4}-\d\d-\d\d$/.test(k)){bad++;return}var a=ty==='urlop'?CF.vac:CF.hol;if(a.indexOf(k)<0){a.push(k);if(ty==='urlop')nv++;else nh++}}
   else if(ty==='odbior'){var a1=pdt(c[1]),b1=pdt(c[2]);if(isNaN(a1)||isNaN(b1)||b1<=a1){bad++;return}
    var d=dk(a1),fm=new Date(a1).getHours()*60+new Date(a1).getMinutes(),tn=new Date(b1).getHours()*60+new Date(b1).getMinutes();if(tn<=fm){bad++;return}
    if(CF.off.some(function(o){return o.d===d&&o.f===fm&&o.t===tn}))return;CF.off.push({id:uid(),d:d,f:fm,t:tn});no++}
   else if(ty==='ustawienie'){var n=(c[1]||'').trim(),v=(c[3]||'').trim().replace(',','.');
    if(n==='norma_godzin'&&parseFloat(v)>=0&&parseFloat(v)<=24){CF.norm=parseFloat(v);st++}
    else if(n==='dni_pracujace'){CF.days=v.split('|').filter(function(x){return x!==''}).map(Number).filter(function(x){return x>=0&&x<=6});st++}
    else if(n==='pula_urlopu'&&parseInt(v,10)>=0){CF.allow=parseInt(v,10);st++}
    else if(n==='saldo_poczatkowe'&&!isNaN(parseFloat(v))){CF.open=parseFloat(v);st++}}
   else bad++});
  save();saveC();$('nh').value=CF.norm;wdr();render();
  msg('Backup wczytany. Dodano: wpisy '+ns+', urlopy '+nv+', święta '+nh+', odbiory '+no+', ustawienia '+st+(bad?' (pominięto błędnych wierszy: '+bad+')':'')+'.')
 }).catch(function(){msg('Nie udało się wczytać pliku.')})};
function xdt(v){if(typeof v==='number'){var p=XLSX.SSF.parse_date_code(v);return p?new Date(p.y,p.m-1,p.d,p.H,p.M,Math.round(p.S)).getTime():NaN}
 var s=String(v==null?'':v).trim();if(!s)return NaN;var r=pdt(s);if(!isNaN(r))return r;
 var m=/^(\d{1,2})\.(\d{1,2})\.(\d{4})[ T](\d{1,2}):(\d\d)(?::(\d\d))?$/.exec(s);return m?new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5],+(m[6]||0)).getTime():NaN}
function xd(v){if(typeof v==='number'){var p=XLSX.SSF.parse_date_code(v);return p?p.y+'-'+p2(p.m)+'-'+p2(p.d):''}
 var s=String(v==null?'':v).trim(),m=/^(\d{4})-(\d\d)-(\d\d)/.exec(s);if(m)return m[1]+'-'+m[2]+'-'+m[3];
 m=/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s);return m?m[3]+'-'+p2(+m[2])+'-'+p2(+m[1]):''}
function xm(v){if(typeof v==='number')return v>=1&&v===Math.floor(v)?1440:Math.round((v%1)*1440);var m=/^(\d{1,2}):(\d\d)/.exec(String(v==null?'':v).trim());return m?+m[1]*60+ +m[2]:NaN}
function xrows(wb,n){var ws=wb.Sheets[n];return ws?XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:''}).slice(1).map(function(r){return [r[0]==null?'':r[0],r[1]==null?'':r[1],r[2]==null?'':r[2]]}):null}
$('xe').onclick=function(){
 if(!window.XLSX){msg('Biblioteka Excel się nie załadowała.');return}
 var wb=XLSX.utils.book_new();
 function add(n,rows,w){var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=w.map(function(x){return {wch:x}});XLSX.utils.book_append_sheet(wb,ws,n)}
 add('Wpisy',[['Wejście','Wyjście']].concat(S.slice().sort(function(a,b){return a.s-b.s}).map(function(x){return [fdt(x.s),x.e?fdt(x.e):'']})),[22,22]);
 add('Urlopy',[['Data']].concat(CF.vac.slice().sort().map(function(k){return [k]})),[14]);
 add('Święta',[['Data']].concat(CF.hol.slice().sort().map(function(k){return [k]})),[14]);
 add('Odbiory',[['Data','Od','Do']].concat(CF.off.slice().sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:a.f-b.f}).map(function(o){return [o.d,hh(o.f),hh(o.t)]})),[14,10,10]);
 add('Ustawienia',[['Nazwa','Wartość'],['Norma godzin dziennie',CF.norm],['Dni pracujące (0=nd, 1=pn ... 6=sb, rozdziel znakiem |)',CF.days.join('|')],['Pula urlopu na rok (dni)',CF.allow],['Saldo początkowe (godziny)',CF.open||0]],[52,14]);
 var buf=XLSX.write(wb,{bookType:'xlsx',type:'array'});
 out('backup-czas-pracy-'+dk(Date.now())+'.xlsx',new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}))};
$('xi').onclick=function(){$('fx').click()};
var PQ=null;
$('fx').onchange=function(){var f=this.files[0];this.value='';if(!f)return;
 if(!window.XLSX){msg('Biblioteka Excel się nie załadowała.');return}
 f.arrayBuffer().then(function(buf){
  var wb=XLSX.read(buf,{type:'array'}),W=xrows(wb,'Wpisy');
  if(!W){msg('To nie wygląda na backup: brak arkusza „Wpisy”.');return}
  var bad=0,N={S:[],vac:null,hol:null,off:null,cfg:{}},seen={},hasOpen=false;
  W.forEach(function(r){if(r[0]===''&&r[1]==='')return;var s=xdt(r[0]),e=r[1]===''?null:xdt(r[1]);
   if(isNaN(s)||(e!==null&&(isNaN(e)||e<=s))){bad++;return}
   if(e===null){if(hasOpen){bad++;return}hasOpen=true}
   var key=s+'_'+e;if(seen[key])return;seen[key]=1;N.S.push({id:uid(),s:s,e:e})});
  function dlist(n){var R=xrows(wb,n);if(!R)return null;var a=[];R.forEach(function(r){if(r[0]==='')return;var k=xd(r[0]);if(!k){bad++;return}if(a.indexOf(k)<0)a.push(k)});return a}
  N.vac=dlist('Urlopy');N.hol=dlist('Święta');
  var O=xrows(wb,'Odbiory');if(O){N.off=[];O.forEach(function(r){if(r[0]===''&&r[1]===''&&r[2]==='')return;var d=xd(r[0]),a=xm(r[1]),b=xm(r[2]);
   if(!d||isNaN(a)||isNaN(b)||b<=a||N.off.some(function(o){return o.d===d&&a<o.t&&b>o.f})){bad++;return}N.off.push({id:uid(),d:d,f:a,t:b})})}
  var U=xrows(wb,'Ustawienia');if(U)U.forEach(function(r){var n=String(r[0]).toLowerCase(),raw=r[1],v=parseFloat(String(raw).replace(',','.'));
   if(n.indexOf('norma')===0&&v>=0&&v<=24)N.cfg.norm=v;
   else if(n.indexOf('dni')===0){var dd=String(raw).split(/[|,;\s]+/).filter(function(x){return x!==''}).map(Number).filter(function(x){return x>=0&&x<=6});if(dd.length)N.cfg.days=dd}
   else if(n.indexOf('pula')===0&&v>=0)N.cfg.allow=Math.round(v);
   else if(n.indexOf('saldo')===0&&!isNaN(v))N.cfg.open=v});
  PQ=N;
  $('qt').innerHTML='W pliku: wpisy '+N.S.length+(N.vac?', urlopy '+N.vac.length:'')+(N.hol?', święta '+N.hol.length:'')+(N.off?', odbiory '+N.off.length:'')+(bad?' (pominięto błędnych wierszy: '+bad+')':'')+'.<br>Obecnie w apce: wpisy '+S.length+', urlopy '+CF.vac.length+', święta '+CF.hol.length+', odbiory '+CF.off.length+'.<br><br>Dane z arkuszy w pliku <b>zastąpią</b> obecne. Jeśli nie masz pewności, najpierw zrób backup.';
  $('mq').classList.add('on')
 }).catch(function(){msg('Nie udało się wczytać pliku Excel.')})};
$('qn').onclick=function(){PQ=null;$('mq').classList.remove('on')};
$('qy').onclick=function(){var N=PQ;PQ=null;$('mq').classList.remove('on');if(!N)return;
 S=N.S;if(N.vac)CF.vac=N.vac;if(N.hol)CF.hol=N.hol;if(N.off)CF.off=N.off;
 for(var k in N.cfg)CF[k]=N.cfg[k];
 save();saveC();$('nh').value=CF.norm;wdr();render();msg('Zastąpiono dane danymi z Excela.')};
$('gb').onclick=function(){$('mo').classList.add('on')};$('go').onclick=function(){$('mo').classList.remove('on')};$('mo').onclick=function(e){if(e.target===this)this.classList.remove('on')};
var GL={on:false,cid:'',syn:0,at:0},GT=null,GTE=0,GP=null,GS='https://www.googleapis.com/auth/drive.appdata',GF='czas-pracy-sync.json';
try{var _g=JSON.parse(localStorage.getItem('wtg'));if(_g)GL=Object.assign(GL,_g)}catch(e){}
function gsv(){try{localStorage.setItem('wtg',JSON.stringify(GL))}catch(e){}}
function gm(t){if($('gst'))$('gst').textContent=t;if($('gsn'))$('gsn').textContent=t}
function cfix(){if(!CF||typeof CF!=='object')CF={};if(!(CF.norm>=0))CF.norm=8;if(!Array.isArray(CF.days))CF.days=[1,2,3,4,5];if(!Array.isArray(CF.vac))CF.vac=[];if(!Array.isArray(CF.hol))CF.hol=[];if(!(CF.allow>=0))CF.allow=26;if(!Array.isArray(CF.off))CF.off=[]}
function snapPrev(){try{localStorage.setItem('wtprev',JSON.stringify({S:S,CF:CF}))}catch(e){}}
function gfin(mod){GL.syn=mod;GL.at=Date.now();gsv();try{localStorage.setItem('wtm',String(mod))}catch(e){}}
function gapply(d){snapPrev();S=d.S||[];CF=d.CF;cfix();save();saveC();$('nh').value=CF.norm;wdr();render()}
function gmerge(d){var seen={};S.forEach(function(x){seen[x.s+'_'+x.e]=1});(d.S||[]).forEach(function(x){if(!seen[x.s+'_'+x.e]&&!(x.e===null&&opn()))S.push(x)});
 var c=d.CF||{};['vac','hol'].forEach(function(k){(c[k]||[]).forEach(function(v){if(CF[k].indexOf(v)<0)CF[k].push(v)})});
 (c.off||[]).forEach(function(o){if(!CF.off.some(function(p){return p.d===o.d&&p.f===o.f&&p.t===o.t}))CF.off.push(o)})}
function gload(){return new Promise(function(res,rej){if(window.google&&google.accounts)return res();var sc=document.createElement('script');sc.src='https://accounts.google.com/gsi/client';sc.onload=function(){res()};sc.onerror=function(){rej(new Error('nie udało się załadować logowania Google (brak internetu?)'))};document.head.appendChild(sc)})}
function gtok(silent){return new Promise(function(res,rej){
 if(GT&&Date.now()<GTE){res(GT);return}
 if(!GL.cid){rej(new Error('wpisz Client ID'));return}
 var c=google.accounts.oauth2.initTokenClient({client_id:GL.cid,scope:GS,callback:function(r){if(r&&r.access_token){GT=r.access_token;GTE=Date.now()+((r.expires_in||3600)-60)*1000;res(GT)}else rej(new Error((r&&r.error)||'brak zgody'))},error_callback:function(e){rej(new Error((e&&e.type)||'logowanie przerwane'))}});
 c.requestAccessToken(silent?{prompt:''}:{})})}
async function gapi(url,method,body,ct){var h={Authorization:'Bearer '+GT};if(ct)h['Content-Type']=ct;var r=await fetch(url,{method:method||'GET',headers:h,body:body});if(r.status===401){GT=null;GTE=0;throw new Error('sesja wygasła, spróbuj ponownie')}if(!r.ok)throw new Error('błąd Dysku Google ('+r.status+')');return r}
async function gfind(){var r=await gapi('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name)&q='+encodeURIComponent("name='"+GF+"'"));var j=await r.json();return j.files&&j.files[0]?j.files[0].id:null}
async function gget(id){var r=await gapi('https://www.googleapis.com/drive/v3/files/'+id+'?alt=media');return r.json()}
async function gput(id,obj){var body=JSON.stringify(obj);
 if(id){await gapi('https://www.googleapis.com/upload/drive/v3/files/'+id+'?uploadType=media','PATCH',body,'application/json');return id}
 var bd='wtb'+Date.now(),mp='--'+bd+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify({name:GF,parents:['appDataFolder']})+'\r\n--'+bd+'\r\nContent-Type: application/json\r\n\r\n'+body+'\r\n--'+bd+'--';
 var r=await gapi('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id','POST',mp,'multipart/related; boundary='+bd);return (await r.json()).id}
var GBusy=false,GLast=0;
function gsync(silent){
 if(GBusy)return;
 if(!GL.on||!GL.cid){$('mo').classList.add('on');gm('Włącz synchronizację i wklej Client ID Google.');return}
 if(!navigator.onLine){gm('Brak internetu. Synchronizacja ruszy po połączeniu.');return}
 GBusy=true;GLast=Date.now();
 gm(silent?'Synchronizuję po otwarciu…':'Łączenie z Dyskiem Google…');
 var p=(window.google&&google.accounts)?gtok(!!silent):gload().then(function(){return gtok(!!silent)});
 p.then(async function(){
  var id=await gfind(),rem=id?await gget(id):null,lm=parseInt(localStorage.getItem('wtm'),10)||0,sy=GL.syn||0,lc=lm!==sy,rc=!!rem&&rem.mod!==sy;
  if(!rem){var m=lm||Date.now();await gput(id,{mod:m,d:{S:S,CF:CF}});gfin(m);gm('Wysłano dane na Dysk Google.');return}
  if(!rc&&!lc){gfin(sy);gm('Już zsynchronizowane.');return}
  if(rc&&!lc){gapply(rem.d);gfin(rem.mod);gm('Pobrano nowsze dane z Dysku Google.');return}
  if(!rc&&lc){await gput(id,{mod:lm,d:{S:S,CF:CF}});gfin(lm);gm('Wysłano zmiany na Dysk Google.');return}
  GP={id:id,rem:rem};$('mg').classList.add('on');gm('Wykryto zmiany po obu stronach.')
 }).catch(function(e){var m=(e&&e.message)||String(e);
  if(silent)gm('Przy otwarciu nie udało się połączyć. Stuknij Synchronizuj.');
  else gm('Błąd: '+m)
 }).then(function(){GBusy=false})}
function gauto(){
 if(!GL.on||!GL.cid||!navigator.onLine||GBusy)return;
 if(Date.now()-GLast<45000)return;
 gsync(true)}
$('gde').checked=GL.on;$('gdc').style.display=GL.on?'block':'none';$('gid').value=GL.cid||'';
if(GL.at)gm('Ostatnia synchronizacja: '+fdt(GL.at).slice(0,16)+(GL.on?'. Przy otwarciu synchronizacja rusza sama.':''));
else if(!GL.on)gm('Synchronizacja wyłączona. Stuknij przycisk, żeby ją ustawić.');
else gm('Wklej Client ID Google, potem stuknij Synchronizuj.');
if(GL.on)gload().catch(function(){});
$('gde').onchange=function(){GL.on=this.checked;gsv();$('gdc').style.display=GL.on?'block':'none';if(GL.on){gload().catch(function(){});gm(GL.cid?'Synchronizacja włączona. Ruszy przy następnym otwarciu albo po stuknięciu przycisku.':'Włączone. Wklej Client ID Google.');}else gm('Synchronizacja wyłączona. Stuknij przycisk, żeby ją ustawić.')};
$('gid').onchange=function(){GL.cid=this.value.trim();gsv()};
$('gsy').onclick=function(){gsync(false)};
if($('gsb'))$('gsb').onclick=function(){gsync(false)};
setTimeout(gauto,700);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')gauto()});
$('gdi').onclick=function(){try{if(GT&&window.google&&google.accounts&&google.accounts.oauth2)google.accounts.oauth2.revoke(GT)}catch(e){}GT=null;GTE=0;GL.syn=0;GL.at=0;gsv();gm('Rozłączono. Plik na Dysku został (usuniesz go w ustawieniach Dysku Google).')};
$('gun').onclick=function(){try{var pv=JSON.parse(localStorage.getItem('wtprev'));if(!pv||!pv.CF)throw 0;S=pv.S||[];CF=pv.CF;cfix();save();saveC();$('nh').value=CF.norm;wdr();render();gm('Przywrócono dane sprzed ostatniej synchronizacji. Kolejna synchronizacja wyśle je na Dysk.')}catch(e){gm('Brak zapisanej kopii do przywrócenia.')}};
$('gkc').onclick=function(){GP=null;$('mg').classList.remove('on');gm('Anulowano.')};
$('gkr').onclick=function(){var q=GP;GP=null;$('mg').classList.remove('on');if(!q)return;try{gapply(q.rem.d);gfin(q.rem.mod);gm('Zastąpiono dane tego urządzenia danymi z Dysku.')}catch(e){gm('Błąd: '+((e&&e.message)||e))}};
$('gkl').onclick=async function(){var q=GP;GP=null;$('mg').classList.remove('on');if(!q)return;try{var m=Date.now();await gput(q.id,{mod:m,d:{S:S,CF:CF}});gfin(m);gm('Dane z tego urządzenia wysłano na Dysk.')}catch(e){gm('Błąd: '+((e&&e.message)||e))}};
$('gkm').onclick=async function(){var q=GP;GP=null;$('mg').classList.remove('on');if(!q)return;try{snapPrev();gmerge(q.rem.d);cfix();save();saveC();$('nh').value=CF.norm;wdr();render();var m=Date.now();await gput(q.id,{mod:m,d:{S:S,CF:CF}});gfin(m);gm('Połączono dane z obu stron i wysłano na Dysk.')}catch(e){gm('Błąd: '+((e&&e.message)||e))}};
var VER=[
{v:'2.4',n:'PWA na iPhone’a',d:'20.11.2026',c:['Instrukcja dodawania aplikacji do ekranu głównego','Automatyczne przygotowanie do pracy offline po otwarciu z ikony, z możliwością wyłączenia','Sprawdzanie zapisanych plików offline i lepsze dopasowanie okien do ekranu iPhone’a']},
{v:'2.3',n:'Usprawnienia PWA i walidacja',d:'20.11.2026',c:['Pełny backup JSON (wpisy, urlopy, święta, odbiory godzin i ustawienia)','Walidacja nakładających się wpisów przy dodawaniu i edycji w Historii','Ostrzeżenie na ekranie Dziś, gdy otwarta zmiana trwa ponad 12 godzin','Manifest PWA, ikona PNG (180×180) oraz przezroczysty pasek statusu pod iOS']},
{v:'2.1',n:'Panel opcji',d:'20.11.2026',c:['Kopie zapasowe, wersja i historia zmian przeniesione do panelu pod ikoną trybika w zakładce Raport']},
{v:'2.0',n:'Wersje',d:'19.11.2026',c:['Nazwa wersji i historia zmian na dole zakładki Raport']},
{v:'1.9',n:'Poprawki i kolory',d:'19.11.2026',c:['Naprawiony przycisk „Dodaj święto” (zdublowany identyfikator pola)','Naprawione znikanie danych na zakładkach po rozwinięciu kalendarza (kolizja nazw klas)','Święta w kalendarzu oznaczone na różowo']},
{v:'1.8',n:'Liquid Glass',d:'19.11.2026',c:['Nowy wygląd: szkło, rozmycie tła, pływające dolne menu','Dolne menu jak slider: przesuwająca się pigułka i przeciąganie palcem po pasku']},
{v:'1.7',n:'Backup',d:'19.11.2026',c:['Backup CSV całej historii: eksport i import (import dopisuje brakujące dane)','Backup Excel (.xlsx) z osobnymi arkuszami do edycji; import zastępuje dane po potwierdzeniu','Zapis plików także poza Claude (okno udostępniania) w wersji niezależnej']},
{v:'1.6',n:'Bank godzin',d:'19.11.2026',c:['Zakładka Bank: saldo nadgodzin do odebrania','Odbiór godzin w zakresie od-do wybieranym zegarem oraz saldo początkowe','Odebrane godziny zmniejszają normę danego dnia w raporcie']},
{v:'1.5',n:'Pulpit i kalendarz',d:'14.11.2026',c:['Kółka u góry: pozostały urlop oraz godziny i dni pracy w bieżącym miesiącu','Rozwijany kalendarz: dni z wpisami, urlopy (przerywane kółko) i święta','Historia pokazuje wszystkie miesiące z nagłówkami, a filtr miesiąca jest opcjonalny i wyśrodkowany']},
{v:'1.4',n:'Oznacz dzień',d:'14.11.2026',c:['Wybór Urlop / Święto dla dowolnego dnia na ekranie Dziś, powiązany z zakładką Urlop','Jeden zielony przycisk-kółko z oknem wyboru: Urlop, Święto albo Powrót']},
{v:'1.3',n:'Urlopy i święta',d:'14.11.2026',c:['Zakładka Urlop: pula dni na rok, dodawanie urlopu zakresem dat, lista z usuwaniem','Dni świąteczne blokujące wejście','Urlop i święta nie wliczają się do normy, a ich liczba jest w raporcie']},
{v:'1.2',n:'Norma i nadgodziny',d:'14.11.2026',c:['Norma dzienna (domyślnie 8 h) i wybór dni pracujących','Raport tygodnia i miesiąca','Saldo do normy, nadgodziny ponad normę dzienną i różnica dnia w CSV oraz PDF']},
{v:'1.1',n:'Własna godzina',d:'14.11.2026',c:['„Wejście / Wyjście o innej godzinie” z kalendarzem i zegarem','Edycja wpisu także z ekranu Dziś','Kontrola poprawności: nie w przyszłości, wyjście po wejściu, brak nakładania']},
{v:'1.0',n:'Start',d:'14.11.2026',c:['Przycisk Wejście / Wyjście i wiele wejść w ciągu dnia (liczy się tylko czas w pracy)','Historia z edycją, usuwaniem i ręcznym dodawaniem wpisów','Raport miesiąca z sumą, eksport do CSV (Excel) i PDF','Kopia zapasowa do pliku JSON']}
];
(function(){if($('gdc'))VER.splice(2,0,{v:'2.2',n:'Synchronizacja Google',d:'20.11.2026',c:['Opcjonalna synchronizacja danych między urządzeniami przez ukryty folder aplikacji na Dysku Google (w Opcjach, domyślnie wyłączona)']});var cur=VER[0];
 if($('ofa'))VER.filter(function(x){return x.v==='2.0'})[0].c.push('Tryb offline (tylko wersja na własnym serwerze): zapis apki w pamięci przeglądarki i usuwanie jednym przyciskiem');
 $('vnm').textContent='Wersja '+cur.v+' · '+cur.n;
 $('vlg').innerHTML=VER.map(function(x){return '<div style="margin-bottom:12px"><b>v'+x.v+' · '+x.n+'</b> <span class="mut">'+x.d+'</span><ul style="margin:4px 0 0 18px;padding:0;font-size:14px">'+x.c.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul></div>'}).join('');
 $('vbt').onclick=function(){var o=$('vlg').style.display==='none';$('vlg').style.display=o?'block':'none';$('vbt').textContent='Historia zmian '+(o?'▴':'▾')};
})();
function tmin(v){var p=v.split(':');return +p[0]*60+ +p[1]}
function hh(m){return p2(Math.floor(m/60))+':'+p2(m%60)}
function bren(){var b=bank();$('bb').textContent=sd(b.bal);
 $('bd').innerHTML='Nadgodziny zebrane: '+dur(b.ot)+'<br>Odebrane: '+dur(b.tk)+'<br>Saldo początkowe: '+sd(b.op);
 if(document.activeElement!==$('op'))$('op').value=CF.open||0;
 var L=CF.off.slice().sort(function(a,b){return a.d<b.d?1:a.d>b.d?-1:b.f-a.f});
 $('ol').innerHTML=L.length?L.map(function(o){return '<div class="row"><span>'+dl(o.d)+'.'+o.d.slice(0,4)+' · '+hh(o.f)+' – '+hh(o.t)+'</span><span class="mut">'+dur((o.t-o.f)*60000)+'</span><button class="btn d" data-o="'+o.id+'">Usuń</button></div>'}).join(''):'<span class="mut">Brak odbiorów</span>'}
$('od').value=dk(Date.now());
$('oa').onclick=function(){var d=$('od').value,f=$('of').value,t=$('ot').value;
 if(!d||!f||!t){$('om').textContent='Podaj dzień oraz godziny od i do';return}
 var a=tmin(f),b=tmin(t);if(b<=a){$('om').textContent='Godzina „do” musi być później niż „od”';return}
 if(CF.off.some(function(o){return o.d===d&&a<o.t&&b>o.f})){$('om').textContent='Ten zakres nakłada się na inny odbiór';return}
 CF.off.push({id:Date.now().toString(36),d:d,f:a,t:b});saveC();$('om').textContent='Dodano: '+dur((b-a)*60000);render()};
$('ol').onclick=function(ev){var b=ev.target.closest('[data-o]');if(!b)return;CF.off=CF.off.filter(function(o){return o.id!==b.dataset.o});saveC();render()};
$('op').onchange=function(){var v=parseFloat(String(this.value).replace(',','.'));CF.open=isNaN(v)?0:v;saveC();render()};
var KM=new Date();KM=new Date(KM.getFullYear(),KM.getMonth(),1);
var MNK=['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];
function kren(){var y=KM.getFullYear(),m=KM.getMonth(),n=new Date(y,m+1,0).getDate(),off=(new Date(y,m,1).getDay()+6)%7,ac={},td=dk(Date.now());
 S.forEach(function(x){ac[dk(x.s)]=1});
 var h='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><button class="btn" id="kp">‹</button><b>'+MNK[m]+' '+y+'</b><button class="btn" id="kn">›</button></div><div class="cg">';
 ['Pn','Wt','Śr','Cz','Pt','Sb','Nd'].forEach(function(d){h+='<div class="h">'+d+'</div>'});
 for(var i=0;i<off;i++)h+='<div class="h"></div>';
 for(var d=1;d<=n;d++){var k=y+'-'+p2(m+1)+'-'+p2(d),c=(ac[k]?' a':'')+(CF.vac.indexOf(k)>=0?' vc':'')+(isH(k)?' s':'')+(k===td?' t':'');h+='<div class="'+c.trim()+'">'+d+'</div>'}
 h+='</div><div class="mut" style="margin-top:8px;font-size:12px">Zielone koło: był wpis · przerywane: urlop · różowe: święto</div>';
 $('kc').innerHTML=h}
$('kb').onclick=function(){var o=$('kc').style.display==='none';$('kc').style.display=o?'block':'none';$('ka').textContent=o?'▴':'▾';kren()};
$('kc').onclick=function(ev){var b=ev.target.closest('button');if(!b)return;if(b.id==='kp')KM=new Date(KM.getFullYear(),KM.getMonth()-1,1);else if(b.id==='kn')KM=new Date(KM.getFullYear(),KM.getMonth()+1,1);kren()};
function hren(){var now=new Date(),y=now.getFullYear(),mo=y+'-'+p2(now.getMonth()+1),t=0,d={};
 S.forEach(function(x){var k=dk(x.s);if(k.indexOf(mo)===0){t+=len(x);d[k]=1}});
 $('c1').innerHTML='<b>'+(CF.allow-yc(y+'-01-01'))+'</b><span>dni urlopu</span>';
 $('c2').innerHTML='<b>'+hm(t)+'</b><span>godz. · '+Object.keys(d).length+' dni</span>';if($('kc').style.display!=='none')kren()}
$('yp').onclick=function(){VY--;vren()};$('yn').onclick=function(){VY++;vren()};
$('al').onchange=function(){var v=parseInt(this.value,10);if(v>=0&&v<=366){CF.allow=v;saveC();vren()}};
function rk(a,b){var r=[],d=new Date(a+'T12:00'),e=new Date(b+'T12:00');while(d<=e&&r.length<400){r.push(dk(d));d.setDate(d.getDate()+1)}return r}
$('va').onclick=function(){var a=$('vf').value,b=$('vt').value||a;if(!a||b<a){$('vm').textContent='Wybierz poprawny zakres dat';return}
 var add=rk(a,b).filter(function(k){return isBase(k)&&!isH(k)&&CF.vac.indexOf(k)<0});add.forEach(function(k){CF.vac.push(k)});saveC();
 $('vm').textContent='Dodano dni urlopu: '+add.length+' (pominięto dni niepracujące, święta i duplikaty)';VY=+a.slice(0,4);vren();render()};
$('ha').onclick=function(){var k=$('hd').value;if(!k)return;if(!isH(k))CF.hol.push(k);CF.vac=CF.vac.filter(function(x){return x!==k});saveC();VY=+k.slice(0,4);vren();render()};
$('vl').onclick=function(ev){var b=ev.target.closest('[data-v]');if(!b)return;CF.vac=CF.vac.filter(function(k){return k!==b.dataset.v});saveC();vren();render()};
$('hl2').onclick=function(ev){var b=ev.target.closest('[data-h]');if(!b)return;CF.hol=CF.hol.filter(function(k){return k!==b.dataset.h});saveC();vren();render()};
wdr();
function dl(k){var d=new Date(k+'T12:00');return DN[d.getDay()]+' '+p2(d.getDate())+'.'+p2(d.getMonth()+1)}
function days(m){var g={};S.filter(function(x){var k=dk(x.s);return Array.isArray(m)?m.indexOf(k)>=0:k.indexOf(m)===0}).sort(function(a,b){return a.s-b.s}).forEach(function(x){var k=dk(x.s);(g[k]=g[k]||[]).push(x)});return g}
function sum(a){return a.reduce(function(t,x){return t+len(x)},0)}
function render(){
 var o=opn(),td=dk(Date.now()),ts=S.filter(function(x){return dk(x.s)===td}).sort(function(a,b){return a.s-b.s});
 $('tt').textContent=dur(sum(ts));vren();hren();bren();
 $('st').textContent=o?'W pracy od '+tm(o.s):(isH(td)?'Święto: wejście zablokowane':CF.vac.indexOf(td)>=0?'Dziś urlop':'Poza pracą');
 var ow=$('ow');
 if(o&&Date.now()-o.s>12*3600000){
  ow.style.display='block';
  ow.innerHTML='<div style="color:var(--red);font-weight:600;margin-bottom:6px">⚠️ Otwarta zmiana trwa już '+dur(Date.now()-o.s)+' (od '+dl(dk(o.s))+' '+tm(o.s)+'). Czy zapomniałeś kliknąć Wyjście?</div><button class="btn" id="owb" style="padding:6px 12px;font-size:13px">Ustaw godzinę wyjścia</button>';
  $('owb').onclick=function(){$('cu').click()};
 }else{ow.style.display='none';ow.innerHTML=''}
 var b=$('bg');b.textContent=o?'Wyjście':'Wejście';b.className='big'+(o?' out':'');b.disabled=!o&&isH(td);if(b.disabled)b.textContent='Dzień wolny (święto)';$('cu').textContent=o?'Wyjście o innej godzinie':'Wejście o innej godzinie';
 $('tl').innerHTML=ts.length?ts.map(function(x){return '<div class="row" data-id="'+x.id+'" style="cursor:pointer"><span>'+tm(x.s)+' – '+(x.e?tm(x.e):'trwa')+'</span><span class="mut">'+dur(len(x))+'</span></div>'}).join(''):'<span class="mut">Brak wpisów</span>';
 var g=days($('m1').value),ks=Object.keys(g).sort().reverse(),pm='',MN=['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];
 $('hl').innerHTML=ks.length?ks.map(function(k){var hd='';if(k.slice(0,7)!==pm){pm=k.slice(0,7);hd='<h2>'+MN[+k.slice(5,7)-1]+' '+k.slice(0,4)+'</h2>'}return hd+'<div class="card"><div class="row"><b>'+dl(k)+'</b><b>'+dur(sum(g[k]))+'</b></div>'+g[k].map(function(x){return '<div class="row" data-id="'+x.id+'" style="cursor:pointer"><span>'+tm(x.s)+' – '+(x.e?tm(x.e):'trwa')+'</span><span class="mut">edytuj</span></div>'}).join('')+'</div>'}).join(''):'<p class="mut">Brak wpisów</p>';
 var P=period(),st=stats(P);
 $('mt').textContent=dur(st.tot);$('md2').innerHTML=P.lab+'<br>Norma: '+dur(st.norm)+' ('+CF.norm+' h × dni pracujące)<br>Saldo do normy: <b>'+sd(st.ot)+'</b><br>Nadgodziny ponad normę dzienną: <b>'+dur(ovt(st))+'</b><br>Urlop w okresie: '+cnt(P,CF.vac)+' dni · święta: '+cnt(P,CF.hol)+' dni<br>Bank godzin (saldo łączne): <b>'+sd(bank().bal)+'</b>';
}
$('bg').onclick=function(){var o=opn();if(!o&&isH(dk(Date.now())))return;if(o)o.e=Date.now();else S.push({id:Date.now().toString(36),s:Date.now(),e:null});save();render()};
setInterval(function(){if(opn())render()},20000);
document.querySelectorAll('nav button').forEach(function(b){b.onclick=function(){document.querySelectorAll('nav button').forEach(function(x){x.classList.toggle('on',x===b)});document.querySelectorAll('section.v').forEach(function(v,i){v.classList.toggle('on',i==b.dataset.t)});render()}});
$('m1').onchange=render;$('m2').onchange=render;$('ma').onclick=function(){$('m1').value='';render()};
var NB=Array.prototype.slice.call(document.querySelectorAll('nav button')),NI=0,nvd=null,nav=document.querySelector('nav');
function nvpos(i,px){var n=$('nv');n.style.transition=px==null?'':'none';n.style.transform=px==null?'translateX('+i*100+'%)':'translateX('+px+'px)'}
NB.forEach(function(b,i){var o=b.onclick;b.onclick=function(){o.call(b);NI=i;if(!(nvd&&nvd.m))nvpos(i)}});
function nidx(x){var r=nav.getBoundingClientRect(),w=(r.width-10)/NB.length;return Math.max(0,Math.min(NB.length-1,Math.floor((x-r.left-5)/w)))}
nav.addEventListener('pointerdown',function(e){nvd={x:e.clientX,m:false,id:e.pointerId};try{nav.setPointerCapture(e.pointerId)}catch(_){}});
nav.addEventListener('pointermove',function(e){if(!nvd)return;if(Math.abs(e.clientX-nvd.x)>6)nvd.m=true;if(!nvd.m)return;var r=nav.getBoundingClientRect(),w=(r.width-10)/NB.length;nvpos(0,Math.max(0,Math.min(r.width-10-w,e.clientX-r.left-5-w/2)))});
nav.addEventListener('pointerup',function(e){if(!nvd)return;var d=nvd;nvd=null;try{nav.releasePointerCapture(d.id)}catch(_){}NB[nidx(e.clientX)].click()});
nav.addEventListener('pointercancel',function(){nvd=null;nvpos(NI)});
nvpos(0);
var eid=null;
function lv(t){var d=new Date(t);return dk(t)+'T'+p2(d.getHours())+':'+p2(d.getMinutes())}
function openM(x){eid=x?x.id:null;$('mtl').textContent=x?'Edytuj wpis':'Nowy wpis';$('es').value=x?lv(x.s):'';$('ee').value=x&&x.e?lv(x.e):'';$('er').textContent='';$('dl').style.display=x?'':'none';$('md').classList.add('on')}
$('add').onclick=function(){openM(null)};
$('hl').onclick=function(ev){var r=ev.target.closest('[data-id]');if(r)openM(S.find(function(x){return x.id===r.dataset.id}))};
$('tl').onclick=$('hl').onclick;
$('cn').onclick=function(){$('md').classList.remove('on')};
$('dl').onclick=function(){S=S.filter(function(x){return x.id!==eid});save();$('md').classList.remove('on');render()};
$('sv').onclick=function(){
 var s=$('es').value?new Date($('es').value).getTime():0,e=$('ee').value?new Date($('ee').value).getTime():null;
 if(!s){$('er').textContent='Podaj godzinę wejścia';return}
 if(isH(dk(s))){$('er').textContent='Ten dzień jest oznaczony jako święto';return}
 if(e&&e<=s){$('er').textContent='Wyjście musi być po wejściu';return}
 var o=opn();if(!e&&o&&o.id!==eid){$('er').textContent='Masz już otwarte wejście';return}
 var eEff=e||Math.max(Date.now(),s+1);
 var ov=S.find(function(x){return x.id!==eid&&s<(x.e||Math.max(Date.now(),x.s+1))&&eEff>x.s});
 if(ov){$('er').textContent='Wpis nakłada się na inny wpis ('+dl(dk(ov.s))+' '+tm(ov.s)+' – '+(ov.e?tm(ov.e):'trwa')+')';return}
 if(eid){var x=S.find(function(y){return y.id===eid});x.s=s;x.e=e}else S.push({id:Date.now().toString(36),s:s,e:e});
 save();$('md').classList.remove('on');render()};
$('cu').onclick=function(){var o=opn();$('ct').textContent=o?'Wyjście: wybierz datę i godzinę':'Wejście: wybierz datę i godzinę';$('cv').value=lv(Date.now());$('ce').textContent='';$('mc').classList.add('on')};
$('cc').onclick=function(){$('mc').classList.remove('on')};
$('cs').onclick=function(){var v=$('cv').value;if(!v){$('ce').textContent='Wybierz datę i godzinę';return}
 var t=new Date(v).getTime(),o=opn();
 if(t>Date.now()+60000){$('ce').textContent='Godzina nie może być w przyszłości';return}
 if(o){if(t<=o.s){$('ce').textContent='Wyjście musi być po wejściu ('+dk(o.s)+' '+tm(o.s)+')';return}o.e=t}
 else{if(isH(dk(t))){$('ce').textContent='Ten dzień jest oznaczony jako święto';return}if(S.some(function(x){return x.s>t||(x.e&&t<x.e)})){$('ce').textContent='Ta godzina koliduje z innymi wpisami. Użyj Historia → Dodaj wpis ręcznie.';return}S.push({id:Date.now().toString(36),s:t,e:null})}
 save();$('mc').classList.remove('on');render()};
function msg(t){$('msg').textContent=t}
var appMode=navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;
if(!appMode&&/iPhone|iPad|iPod/.test(navigator.userAgent))$('install').hidden=false;
var swScope=new URL('./',document.baseURI),swScript=new URL('sw.js',swScope).href;
var swPrefix='czas-pracy-pwa:'+swScope.pathname+':',swCache=swPrefix+'2.5';
var swFiles=['./','index.html','manifest.json','icon.svg','icon-180.png'];
var swLibs=Array.from(document.querySelectorAll('head script[src]'),function(s){return s.src});
var swBusy=false;
function swPref(on){
 try{if(typeof on==='boolean')localStorage.setItem('wt-offline:'+swScope.pathname,on?'on':'off');
 return localStorage.getItem('wt-offline:'+swScope.pathname)}catch(e){return null}
}
function swCan(){return window.isSecureContext&&'serviceWorker' in navigator&&'caches' in window}
function swStatus(t){$('ofs').textContent=t}
function swLock(b){swBusy=b;$('ofa').disabled=$('ofr').disabled=b}
async function swOwn(){
 var rs=await navigator.serviceWorker.getRegistrations();
 return rs.find(function(r){
  return r.scope===swScope.href&&[r.active,r.installing,r.waiting].some(function(w){return w&&w.scriptURL===swScript})
 });
}
async function swCheck(warm){
 var r=await swOwn();
 if(!r||!r.active||!(await caches.has(swCache)))return false;
 var c=await caches.open(swCache);
 var check=function(list){return Promise.all(list.map(function(p){return c.match(new URL(p,swScope).href)})).then(function(a){return a.every(Boolean)})};
 if(!(await check(swFiles)))return false;
 var hasLibs=await check(swLibs);
 swStatus('Gotowe do pracy offline.'+(hasLibs?'':' Eksport PDF lub Excel może wymagać internetu przy pierwszym razie.'));
 if(!hasLibs&&warm&&navigator.onLine&&'MessageChannel' in window){
  var channel=new MessageChannel();
  var close=function(){channel.port1.close()};
  var timer=setTimeout(close,10000);
  channel.port1.onmessage=function(){clearTimeout(timer);close();if(swPref()!=='off')swCheck(false).catch(function(){})};
  try{r.active.postMessage('cache-export-libraries',[channel.port2])}catch(e){clearTimeout(timer);close()}
 }
 return true;
}
async function swSetup(manual){
 if(swBusy||!swCan())return;
 swLock(true);swStatus('Przygotowuję aplikację do pracy offline…');
 if(manual)swPref(true);
 try{
  await navigator.serviceWorker.register(swScript,{scope:swScope.href,updateViaCache:'none'});
  for(var i=0;i<40;i++){
   if(await swCheck(true)){
    try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(function(){})}catch(e){}
    return;
   }
   await new Promise(function(resolve){setTimeout(resolve,250)});
  }
  throw new Error('Nie zapisano wszystkich plików');
 }catch(e){swStatus('Nie udało się przygotować trybu offline. Otwórz stronę przez HTTPS i spróbuj ponownie.')}
 finally{swLock(false)}
}
$('ofa').onclick=function(){swSetup(true)};
$('ofr').onclick=async function(){
 if(swBusy||!swCan())return;
 swLock(true);swPref(false);
 try{
  var r=await swOwn();if(r)await r.unregister();
  var ks=await caches.keys();await Promise.all(ks.filter(function(k){return k.indexOf(swPrefix)===0}).map(function(k){return caches.delete(k)}));
  swStatus('Tryb offline wyłączony. Wpisy nie zostały usunięte.');
 }catch(e){swStatus('Nie udało się usunąć plików offline. Spróbuj ponownie.')}
 finally{swLock(false)}
};
async function swStart(){
 if(!swCan()){swLock(true);swStatus('Tryb offline działa po opublikowaniu strony przez HTTPS.');return}
 try{
  if(swPref()==='off'){swStatus('Tryb offline wyłączony.');return}
  if(await swCheck(true))return;
  if((appMode||swPref()==='on')&&navigator.onLine){swSetup(false);return}
  swStatus('Pliki do pracy offline nie zostały jeszcze zapisane.');
 }catch(e){swStatus('Tryb offline jest niedostępny w tym widoku.')}
}
swStart();
async function dlFallback(name,data){
 var ty=name.slice(-4)==='.pdf'?'application/pdf':name.slice(-5)==='.json'?'application/json':name.slice(-5)==='.xlsx'?'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'text/csv';
 var blob=data instanceof Blob?data:new Blob([data],{type:ty});
 try{var f=new File([blob],name,{type:ty});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});msg('');return}}catch(e){if(e&&e.name==='AbortError')return}
 var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000);msg('')}
async function out(name,data){
 var d=null;try{d=window.claude&&await claude.use('downloads')}catch(e){}
 if(!d){await dlFallback(name,data);return}
 try{await d.save({filename:name,data:data});msg('')}catch(e){if(!e||e.code!=='declined')msg('Nie udało się zapisać ('+((e&&e.code)||'błąd')+').')}}
function hm(ms){var m=Math.round(ms/60000);return Math.floor(m/60)+':'+p2(m%60)}
$('csv').onclick=function(){
 var P=period(),st=stats(P),g=st.g,ks=Object.keys(g).sort(),tot=0;
 var L=['Data;Wejścia i wyjścia;Czas (g:mm);Czas (godz.);Różnica do normy dziennej (g:mm)'];
 ks.forEach(function(k){var t=sum(g[k]),df=t-dn(k);tot+=t;L.push([k,g[k].map(function(x){return tm(x.s)+'-'+(x.e?tm(x.e):'')}).join(' | '),hm(t),(t/3600000).toFixed(2).replace('.',','),sh(df)].join(';'))});
 L.push(['SUMA','',hm(tot),(tot/3600000).toFixed(2).replace('.',','),''].join(';'));L.push(['Norma okresu ('+CF.norm+' h dziennie)','',hm(st.norm),(st.norm/3600000).toFixed(2).replace('.',','),''].join(';'));L.push(['Saldo do normy (nadgodziny / niedobór)','','','',sh(st.ot)].join(';'));L.push(['Urlop w okresie (dni)','',String(cnt(P,CF.vac)),'',''].join(';'));L.push(['Święta w okresie (dni)','',String(cnt(P,CF.hol)),'',''].join(';'));L.push(['Nadgodziny ponad normę dzienną','',hm(ovt(st)),(ovt(st)/3600000).toFixed(2).replace('.',','),''].join(';'));
 out('czas-pracy-'+P.fn+'.csv','\ufeff'+L.join('\r\n'))};
function asc(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l').replace(/Ł/g,'L')}
$('pdf').onclick=function(){
 if(!window.jspdf){msg('Biblioteka PDF się nie załadowała.');return}
 var P=period(),st=stats(P),g=st.g,ks=Object.keys(g).sort(),tot=0,doc=new jspdf.jsPDF(),y=20;
 doc.setFontSize(16);doc.text(asc('Raport czasu pracy '+P.lab),15,y);y+=12;
 doc.setFontSize(11);doc.setFont(undefined,'bold');doc.text('Data',15,y);doc.text('Wejscia i wyjscia',55,y);doc.text('Czas',158,y);doc.text('Roznica',181,y);doc.setFont(undefined,'normal');y+=7;
 ks.forEach(function(k){
  var t=sum(g[k]);tot+=t;
  if(y>275){doc.addPage();y=20}
  doc.text(asc(dl(k)),15,y);doc.text(g[k].map(function(x){return tm(x.s)+'-'+(x.e?tm(x.e):'...')}).join(', '),55,y,{maxWidth:100});doc.text(hm(t),158,y);doc.text(sh(t-dn(k)),181,y);y+=7});
 y+=4;if(y>250){doc.addPage();y=20}doc.setFont(undefined,'bold');
 doc.text('Przepracowano: '+hm(st.tot)+' h, dni z praca: '+ks.length,15,y);y+=7;
 doc.text('Norma okresu: '+hm(st.norm)+' h ('+CF.norm+' h dziennie)',15,y);y+=7;
 doc.text('Saldo do normy: '+sh(st.ot)+' h',15,y);y+=7;
 doc.text('Nadgodziny ponad norme dzienna: '+hm(ovt(st))+' h',15,y);y+=7;doc.text('Urlop: '+cnt(P,CF.vac)+' dni, swieta: '+cnt(P,CF.hol)+' dni',15,y);
 out('czas-pracy-'+P.fn+'.pdf',doc.output('blob'))};
$('bk').onclick=function(){out('czas-pracy-kopia-'+dk(Date.now())+'.json',JSON.stringify({v:1,exportedAt:new Date().toISOString(),S:S,CF:CF}))};
$('im').onclick=function(){$('fi').click()};
$('fi').onchange=function(){var f=this.files[0];this.value='';if(!f)return;f.text().then(function(t){try{var d=JSON.parse(t);
 if(Array.isArray(d)){S=d;save();render();msg('Wczytano '+d.length+' wpisów (starszy format kopii).');return}
 if(!d||typeof d!=='object'||!Array.isArray(d.S))throw 0;
 S=d.S;
 if(d.CF&&typeof d.CF==='object'){CF=d.CF;cfix();saveC();$('nh').value=CF.norm;wdr()}
 save();render();
 msg('Wczytano pełną kopię: wpisy '+S.length+', urlopy '+CF.vac.length+', święta '+CF.hol.length+', odbiory '+CF.off.length+'.')
}catch(e){msg('Nieprawidłowy plik kopii.')}})};
render();

