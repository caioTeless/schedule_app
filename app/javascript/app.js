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
        modalMethod: '',
        eventId: 0,
    },
    methods: {
        renderScheduleCalendar() {
            var self = this;
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
                    self.modalMethod = 'addSchedule';

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
                                            id: e.event_id,
                                            title: $("#username")[0].innerHTML,
                                            start: eventInfo.startStr,
                                            end: eventInfo.endStr,
                                        });
                                    },
                                    error: function (e) {
                                        alert('Erro ajax');
                                    }
                                });

                                $('#confirmModal').modal('hide');
                                setTimeout(function () {
                                    $("#alert").fadeOut();
                                }, 3000);
                            });
                        };
                    } else {
                        alert('Não é possível agendar em datas passadas ou já existe agendamento !');
                    }
                },

                eventClick: function (info) {
                    self.modalMethod = 'delSchedule';
                    var id = info.event.extendedProps.event_id;
                    if (!id > 0) {
                        $.ajax({
                            url: 'get_events',
                            type: 'GET',
                            success: function (data) {
                                data.map(function (x) {
                                    if (x.start.substring(0, 19) == info.event.startStr) {
                                        id = x.event_id
                                    }
                                });
                            },
                            error: function () {
                                failureCallback('Error fetching events');
                            }
                        });
                    }
                    $('#confirmModal').modal('show');
                    $('#confirmModalButton').off('click').on('click', function () {
                        $.ajax({
                            url: 'events/' + id,
                            type: 'DELETE',
                            success: function (data) {
                                info.event.remove();
                                $("#alert").fadeIn();
                            },
                            error: function (e) {
                                alert('Error ajax ' + e.message)
                            }
                        })

                        $('#confirmModal').modal('hide');
                    })
                    setTimeout(function () {
                        $("#alert").fadeOut();
                    }, 3000);
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
    computed: {
        modalTitle() {
            return this.modalMethod === 'addSchedule' ? 'Agendar' : 'Remover';
        },
        modalMessage() {
            return this.modalMethod === 'addSchedule' ? 'Confirma o agendamento para' : 'Deseja remover o agendamento de';
        },
        alertTitle() {
            return this.modalMethod === 'addSchedule' ? 'Adicionado com sucesso' : 'Removido com sucesso';
        },
    },

    mounted() {
        this.renderScheduleCalendar();
    },
});