
const E = [
    { y: 1902, t: "استرداد الرياض", p: [46.72, 24.63], d: "دخل الملك عبدالعزيز الرياض في 5 شوال 1319هـ (15 يناير 1902م) مع رجاله واستعاد قصر المصمك، فكانت بداية تأسيس الدولة السعودية الثالثة." },
    { y: 1906, t: "توحيد القصيم", p: [43.97, 26.33], d: "انتصر في معركة روضة مهنا عام 1906م وقُتل أمير حائل عبدالعزيز بن متعب، فاستقر له حكم القصيم وتوطدت سلطته في نجد." },
    { y: 1913, t: "ضم الأحساء", p: [49.58, 25.38], d: "استعاد الملك عبدالعزيز الأحساء من العثمانيين عام 1913م، فامتد حكمه إلى ساحل الخليج العربي." },
    { y: 1920, t: "ضم عسير", p: [42.51, 18.22], d: "ضُمّت منطقة عسير في الجنوب الغربي إلى حكم الملك عبدالعزيز." },
    { y: 1921, t: "ضم حائل", p: [41.69, 27.52], d: "دخل الملك عبدالعزيز حائل فانتهى حكم آل رشيد في جبل شمر، وأصبح لقبه سلطان نجد وملحقاتها." },
    { y: 1924, t: "دخول مكة المكرمة", p: [39.83, 21.42], d: "دخلت قوات الملك عبدالعزيز مكة المكرمة في أكتوبر 1924م بعد سيطرتها على الطائف." },
    { y: 1925, t: "المدينة المنورة وجدة", p: [39.61, 24.47], d: "سلّمت المدينة المنورة في ديسمبر 1925م ثم جدة، لتنتهي حقبة حكم الأشراف في الحجاز." },
    { y: 1926, t: "ملكًا على الحجاز", d: "بويع الملك عبدالعزيز ملكًا على الحجاز في 8 يناير 1926م في المسجد الحرام." },
    { y: 1927, t: "مملكة الحجاز ونجد", d: "أُعلن عام 1927م قيام مملكة الحجاز ونجد وملحقاتها، واعترفت بريطانيا باستقلالها في معاهدة جدة." },
    { y: 1932, t: "المملكة العربية السعودية", p: [46.72, 24.63], d: "صدر أمر ملكي بتسمية الدولة «المملكة العربية السعودية» ابتداءً من 23 سبتمبر 1932م (21 جمادى الأولى 1351هـ)، وهو اليوم الوطني." }
];

const G = [[34.9, 29.4], [36.1, 29.2], [37, 30], [38.2, 31.2], [39.2, 32.1], [41.2, 30.9], [43.5, 29.4], [44.7, 29.1], [46.55, 29.1], [48.5, 28.4], [49.1, 27.6], [49.7, 27.1], [50.2, 26.6], [50.2, 26], [50.5, 25.2], [50.85, 24.7], [51.6, 24.3], [52, 23], [55.2, 22.7], [55.7, 22], [55, 20], [52, 19], [49, 18], [47, 17.3], [44, 17.3], [43.1, 17.3], [42.75, 16.9], [41.6, 18.2], [41.1, 19.1], [40.3, 20.1], [39.2, 21.5], [39, 22.8], [38.1, 24.1], [37.3, 25], [36.5, 26.2], [35.7, 27.4], [35, 28.6]];
const $ = i => document.getElementById(i);
const sl = $("yearSlider"), map = $("map"), side = $("side"), veil = $("veil"), btn = $("menuBtn"), pl = $("play");
const P = g => [(g[0] - 34) * 28, (33 - g[1]) * 28];

let tm = null;

map.innerHTML = '<polygon class="land" id="land" points="' + G.map(g => P(g).join(",")).join(" ") + '"/>'
    + '<text class="sea" x="78" y="300">البحر الأحمر</text><text class="sea" x="525" y="165">الخليج العربي</text>'
    + '<polyline class="route" id="route"/>'
    + E.map((e, i) => { if (!e.p) return ""; const c = P(e.p); return '<g class="pt" data-i="' + i + '" transform="translate(' + c[0] + ' ' + c[1] + ')"><circle class="ring" r="8"/><circle r="8"/><text y="-16">' + e.t + '</text></g>' }).join("");

function show(v) {
    const y = +v;
    sl.value = y;
    let k = 0;
    E.forEach((e, i) => { if (e.y <= y) k = i });
    const e = E[k], f = (y - 1902) / 30, pts = [];
    $("yr").textContent = y;
    $("ttl").textContent = e.t;
    $("txt").textContent = e.d;
    $("cnt").textContent = "الحدث " + (k + 1) + " من " + E.length + " في سنة " + e.y;
    $("bar").style.width = f * 100 + "%";
    $("land").style.fillOpacity = .3 + .7 * f;
    $("land").classList.toggle("done", y === 1932);
    map.querySelectorAll(".pt").forEach(g => {
        const i = +g.dataset.i;
        g.classList.toggle("off", E[i].y > y);
        g.classList.toggle("cur", i === k);
        if (E[i].y <= y) pts.push(P(E[i].p).join(","));
    });
    $("route").setAttribute("points", pts.join(" "));
    document.querySelectorAll(".ticks button,.ev").forEach(b => {
        const i = +b.dataset.i;
        b.classList.toggle("p", E[i].y <= y);
        b.classList.toggle("c", i === k);
    });
}

function stop() {
     clearInterval(tm); tm = null; pl.textContent = "تشغيل" 
}

function go(y) {
     stop(); show(y) 
}

function menu(o) {
    side.classList.toggle("open", o);
    veil.classList.toggle("on", o);
    btn.setAttribute("aria-expanded", o);
}
function cur() {
    let k = 0; E.forEach((e, i) => { if (e.y <= +sl.value) k = i }); return k 
}

E.forEach((e, i) => {
    const t = document.createElement("button");
    t.dataset.i = i;
    t.title = e.y + " - " + e.t;
    t.setAttribute("aria-label", e.y + " " + e.t);
    t.style.setProperty("inset-inline-start", (e.y - 1902) / 30 * 100 + "%");
    t.onclick = () => go(e.y);
    $("ticks").appendChild(t);
    const m = document.createElement("button");
    m.className = "ev";
    m.dataset.i = i;
    m.innerHTML = "<b>" + e.y + "</b><strong>" + e.t + "</strong><span>" + e.d + "</span>";
    m.onclick = () => { go(e.y); menu(false) };
    $("events").appendChild(m);
});

sl.oninput = () => go(sl.value);

map.onclick = ev => {
    const g = ev.target.closest(".pt"); if (g) go(E[g.dataset.i].y) 
};

$("next").onclick = () => go(E[Math.min(cur() + 1, E.length - 1)].y);
$("prev").onclick = () => {
    const k = cur(); go(E[+sl.value > E[k].y ? k : Math.max(k - 1, 0)].y) 
};

pl.onclick = () => {
    if (tm) return stop();
    if (+sl.value >= 1932) show(1902);
    pl.textContent = "إيقاف";
    tm = setInterval(() => { if (+sl.value >= 1932) return stop(); show(+sl.value + 1) }, 450);
};

btn.onclick = () => menu(true);

$("close").onclick = () => menu(false);

veil.onclick = () => menu(false);

document.addEventListener("keydown", ev => { if (ev.key === "Escape") menu(false) });

show(1902);
