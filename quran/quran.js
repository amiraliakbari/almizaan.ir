var SURAH = [
    {},
    {name: 'حمد', len: 7},
    {name: 'بقره', len: 3},
];

var lastHash = '1:1';

var page = {
    surah: 1,
    ayah: 1,
    surahName: '',
    surahLen: 1,
    headings: [],
    headingPositions: [],
    scrollY: 0,
    hOffset: 0,
};


function hashHandler() {
    var ref = window.location.hash.substr(1).split(':');
    if (ref.length != 2) {
        ref = ['1', '1'];
        window.location.hash = lastHash;
    } else {
        var surah = ref[0] || 1;
        var ayah = ref[1] || 1;
        lastHash = surah + ':' + ayah;
        loadAyah(surah, ayah);
    }
}

function detectHeading() {
    var y = window.scrollY;
    if (y === page.scrollY) return;
    var i = 1;
    if (!page.headings.length) {
        document.getElementById('menu-text').innerText = '';
        return;
    }
    while (i<page.headingPositions.length && y + page.hOffset >= page.headingPositions[i]) {
        i++;
    }
    document.getElementById('menu-text').innerText = page.surah + '.' + page.ayah + '.' + i + ' ' + page.headings[i - 1];
    page.scrollY = y;
}

function refreshPage() {
    page.scrollY = -1;
    page.headings = [];
    page.headingPositions = [];
    document.getElementById('title').innerText = 'تفسیر المیزان: سوره ' + page.surahName + ' آیه ' + page.ayah;
    document.querySelectorAll('#content h2').forEach(function (el) {
        page.headings.push(el.innerText);
        page.headingPositions.push(el.offsetTop);
    });
    detectHeading();
}

function loadAyah(surah, ayah) {
    ayah = Number(ayah);
    surah = Number(surah);
    $.ajax({
        url: '/data/' + surah + '/' + ayah + '.html',
        success: function(data) {
            page.surah = surah;
            page.ayah = ayah;
            page.surahName = surah < SURAH.length ? SURAH[surah].name : surah;
            page.surahLen = surah < SURAH.length ? SURAH[surah].len : 1;
            $('#content').html(data);
            refreshPage();
        },
        dataType: 'html'
    });
}

function loadNextAyah() {
    var s = page.surah;
    var a = page.ayah + 1;
    if (a > page.surahLen) {
        a = 1;
        s += 1;
    }
    if (s >= SURAH.length) {
        return;
    }
    gotoAyah(s, a);
}

function loadPrevAyah() {
    var s = page.surah;
    var a = page.ayah - 1;
    if (a < 1) {
        s -= 1;
        a = s < SURAH.length ? SURAH[s].len : 1;
    }
    if (s < 1) {
        return;
    }
    gotoAyah(s, a);
}

function gotoAyah(surah, ayah) {
    window.location.hash = surah + ':' + ayah;
}

$(function() {
    page.hOffset = Math.floor(document.documentElement.clientHeight * 0.3);
    window.addEventListener('hashchange', hashHandler, false);
    hashHandler();
    setInterval(detectHeading, 1000);
    $('#button-next').click(loadNextAyah);
    $('#button-prev').click(loadPrevAyah);
});
