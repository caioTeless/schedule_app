// $(document).on('turbolinks:load', function (e) {
//     var initialTimeZone = 'UTC';
//     var timeZoneSelectorEl = document.getElementById('time-zone-selector');
//     var loadingEl = document.getElementById('loading');
//     var calendarEl = document.getElementById('calendar');

//     var calendar = new FullCalendar.Calendar(calendarEl, {
//         locale: 'pt-br',
//         buttonText: {
//             today: 'Hoje',
//             month: 'Mês',
//             week: 'Semana',
//             day: 'Hoje',
//             list: 'Lista'
//         },
//         slotLabelFormat: 'HH:mm',
//         timeZone: 'America/Sao_Paulo',
//         initialView: 'timeGridWeek',
//         firstDay: 1,
//         weekends: false,
//         allDaySlot: false,
//         navLinks: true,
//         editable: true,
//         selectable: true,
//         dayMaxEvents: true,
//         dayHeaderFormat: this.dayHeaderFormatUsingMoment,
//         dayMaxEventRows: true,

//         contentHeight: 680,
//         aspectRatio: 2,
//         views: {
//             week: {
//                 dayHeaderFormat: {
//                     weekday: 'long',
//                 },
//             },
//         },
//         slotMinTime: "06:00:00",
//         slotMaxTime: "19:00:00",

//         loading: function (bool) {
//             if (bool) {
//                 loadingEl.style.display = 'inline';
//             } else {
//                 loadingEl.style.display = 'none';
//             }
//         },
//     });
//     calendar.render();

// });