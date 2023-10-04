var app = new Vue({
    el: '#app',
    data: {
        confirmModal: false,
        user: {
            email: '',
            username: '',
        },
        eventData: {
            userId: '',
            start: '',
            end: '',
        },
        start: '',
        events: null,
        infoDate: false,
    },
    methods: {
        validateAndShowAlert() {
            debugger
            if (validationPasses) {
                this.infoDate = true; 
            } else {
                this.infoDate = false; 
            }
        },
        hideAlert() {
            this.infoDate = false;
        },
        renderScheduleCalendar() {
            var initialTimeZone = 'UTC';
            var timeZoneSelectorEl = document.getElementById('time-zone-selector');
            var loadingEl = document.getElementById('loading');
            var calendarEl = document.getElementById('calendar');

            var calendar = new FullCalendar.Calendar(calendarEl, {
                locale: 'pt-br',
                buttonText: {
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Hoje',
                    list: 'Lista'
                },
                slotLabelFormat: 'HH:mm',
                timeZone: 'America/Sao_Paulo',
                initialView: 'timeGridWeek',
                slotDuration: '1:00:00',
                firstDay: 1,
                weekends: false,
                allDaySlot: false,
                navLinks: true,
                eventOverlap: false,
                editable: false,
                selectable: true,
                dayMaxEvents: true,
                dayHeaderFormat: this.dayHeaderFormatUsingMoment,
                dayMaxEventRows: true,

                contentHeight: 455,
                aspectRatio: 1,
                views: {
                    week: {
                        dayHeaderFormat: {
                            weekday: 'long',
                        },
                    },
                },
                slotMinTime: "06:00:00",
                slotMaxTime: "23:00:00",

                loading: function (bool) {
                    if (bool) {
                        loadingEl.style.display = 'inline';
                    } else {
                        loadingEl.style.display = 'none';
                    }
                },

                select: function (eventInfo) {
                    var events = calendar.getEvents();
                    var currentDate = new Date();
                    var isOverlap = events.some(function (existingEvent) {
                        return (
                            eventInfo.start < existingEvent.end && eventInfo.end > existingEvent.start
                        );
                    });
                    if (eventInfo.start > currentDate) {
                        if (!isOverlap) {
                            $('#confirmModal').modal('show');
                            $('#confirmModalButton').off('click').on('click', function () {
                                this.eventData = {
                                    user_id: $("#userId")[0].innerHTML,
                                    start: eventInfo.startStr,
                                    end: eventInfo.endStr
                                }
                                
                                $.ajax({
                                    url: "events",
                                    type: 'POST',
                                    data: { event: this.eventData },
                                    success: function (e) {
                                        calendar.addEvent({
                                            title: $("#username")[0].innerHTML,
                                            start: eventInfo.startStr,
                                            end: eventInfo.endStr,
                                        });
                                        this.eventData = null;
                                        return;
                                    },
                                    error: function (e) {
                                        alert('Erro ajax');
                                    }
                                });

                                $('#confirmModal').modal('hide');
                            });
                        };
                    } else {
                        alert('Não é possível agendar em datas passadas ou já existe agendamento !');
                    }
                },

                eventClick: function (info) {
                    $.ajax({
                        url: 'event/' + info.event.extendedProps.event_id,
                        type: 'DELETE',
                        success: function (data) {
                            info.event.remove();
                            alert('success');
                        },
                        error: function (e) {
                            debugger
                            alert('Error ajax')
                        }
                    })
                  },

            });
            calendar.render();
            $.ajax({
                url: 'get_events',
                type: 'GET',
                success: function (data) {
                    data.forEach(function (newData, i) {
                        calendar.addEvent({
                            event_id: newData.event_id,
                            title: newData.username,
                            start: newData.start,
                            end: newData.end,
                            user_id: newData.user_id
                        })
                    })
                },
                error: function () {
                    failureCallback('Error fetching events');
                }
            });
        },
    },

    mounted() {
        this.renderScheduleCalendar();
    },
});