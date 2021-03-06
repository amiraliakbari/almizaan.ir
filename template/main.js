if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then((reg) => {
    console.log('SW registered');
  }).catch((error) => {
    console.log('SW Registration failed with ' + error);
  });
}

window.q = document.querySelector.bind(document);
window.qAll = document.querySelectorAll.bind(document);

$(function () {
  $('#surah-list .card').click(function () {
    var surah = $(this).closest('.card').data('surah');
    window.location = '/quran/#' + surah + '/1/';
  });
});
