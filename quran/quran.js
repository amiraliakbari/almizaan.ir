var SURAH = [
    {},
    {name: 'حمد', len: 7},
    {name: 'بقره', len: 5},
];

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
    var surah = 1;
    var ayah = 1;
    // Check hash as default value
    var h = window.location.hash.match(RegExp(/#(\d+)\/(\d+)\//));
    if (h) {
      surah = h[1];
      ayah = h[2];
    }
    // Check url and replace if not set or invalid
    var m = window.location.pathname.match(RegExp(/\/quran\/(\d+)\/(\d+)\//));
    if (m) {
        surah = m[1];
        ayah = m[2];
    } else {
        window.history.replaceState({surah: surah, ayah: ayah}, title, '/quran/' + surah + '/' + ayah + '/');
    }
    var title = 'تفسیر المیزان: سوره ' + (surah < SURAH.length ? SURAH[surah].name : surah) + ' آیه ' + ayah;
    document.title = title;
    loadAyah(surah, ayah);
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

function insertToc() {
    $('<div id="toc" class="card-deck"></div>').insertAfter('#content translation');
    page.headings.forEach(function (heading, i) {
        $('#toc').append('<div class="card" data-section="'+i+'"><div class="card-body"><p>'+heading+'</p></div></div>');
    });
    $('#toc .card').click(function () { gotoSection($(this).data('section')); });
}

function refreshPage() {
    page.surahName = page.surah < SURAH.length ? SURAH[page.surah].name : page.surah;
    page.surahLen = page.surah < SURAH.length ? SURAH[page.surah].len : 1;
    page.scrollY = -1;
    page.headings = [];
    page.headingPositions = [];
    document.getElementById('title').innerText = 'تفسیر المیزان: سوره ' + page.surahName + ' آیه ' + page.ayah;
    document.querySelectorAll('#content h2').forEach(function (el) {
        page.headings.push(el.innerText);
    });
    insertToc();
    document.querySelectorAll('#content h2').forEach(function (el) {
        page.headingPositions.push(el.offsetTop);
    });
    detectHeading();
}

function loadAyah(surah, ayah) {
    ayah = Number(ayah);
    surah = Number(surah);

    // Check if data is preloaded
    var currentAyah = Number($('#content ayah').attr('number'));
    var currentSurah = Number($('#content ayah').attr('surah'));
    if (currentSurah === surah && currentAyah === ayah) {
        page.surah = surah;
        page.ayah = ayah;
        refreshPage();
        return;
    }

    // Fetch page data
    $.ajax({
        url: '/data/' + surah + '/' + ayah + '.html',
        success: function(data) {
            page.surah = surah;
            page.ayah = ayah;
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
    window.history.pushState({surah: surah, ayah: ayah}, title, '/quran/' + surah + '/' + ayah + '/');
    hashHandler();
    gotoTop();
}

function gotoSection(section) {
    window.scrollTo(0, page.headingPositions[section] || 0);
}

function gotoTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}

$(function() {
    page.hOffset = Math.floor(document.documentElement.clientHeight * 0.3);
    hashHandler();
    window.addEventListener('popstate', hashHandler);
    setInterval(detectHeading, 1000);
    $('#button-next').click(loadNextAyah);
    $('#button-prev').click(loadPrevAyah);
});
