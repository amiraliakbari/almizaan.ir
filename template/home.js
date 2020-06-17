$(function () {
    $('#surah-list .card').click(function () {
        var surah = $(this).closest('.card').data('surah');
        window.location = '/quran/' + surah + '/1/';
    });
});
