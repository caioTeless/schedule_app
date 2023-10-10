var app = new Vue({
    el: '#app',
    data: {
        confirmModal: false,
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

            var initialTimeZone = 'UTC';
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
                timeZone: 'UTC',
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

                    var selectedDuration = eventInfo.end - eventInfo.start;

                    self.modalMethod = 'addSchedule';
                    var events = calendar.getEvents();
                    var currentDate = new Date();
                    currentDate = moment(currentDate).format('YYYY/MM/DD HH:mm')
                    var formatStartDate = moment.utc(eventInfo.startStr).format('YYYY/MM/DD HH:mm')

                    var isOverlap = events.some(function (existingEvent) {
                        return (
                            eventInfo.start < existingEvent.end && eventInfo.end > existingEvent.start
                        );
                    });
                    if (selectedDuration === 60 * 60 * 1000) {
                        if (formatStartDate > currentDate) {
                            if (!isOverlap) {
                                $('#confirmModal').modal('show');
                                $('#confirmModalButton').off('click').on('click', function () {
                                    this.eventData = {
                                        user_id: $("#iuShow")[0].innerHTML,
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
                                                title: $("#userName")[0].innerHTML,
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
                    } else {
                        alert('Selecione apenas um horário por vez');
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
                                    if (moment.utc(x.start).format('YYYY/MM/DD HH:mm') == moment.utc(info.event.startStr).format('YYYY/MM/DD HH:mm')) {
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
                            },
                            error: function (e) {
                                if (e.status = 422) {
                                    alert('Você não está autorizado')
                                }
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
                            title: newData.first_name + ' ' + newData.last_name,
                            start: newData.start,
                            end: newData.end,
                            user_id: newData.user_id
                        })
                    });
                },
                error: function () {
                    failureCallback('Error fetching events');
                }
            });
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        showAlert() {
            this.dismissCountDown = this.dismissSecs
        }

    },
    computed: {
        modalTitle() {
            return this.modalMethod === 'addSchedule' ? 'Agendar' : 'Remover';
        },
        modalMessage() {
            return this.modalMethod === 'addSchedule' ? 'Confirma o agendamento ? ' : 'Deseja remover o agendamento ?';
        },
        alertTitle() {
            return this.modalMethod === 'addSchedule' ? 'Adicionado com sucesso' : 'Removido com sucesso';
        },
    },

    mounted() {
        this.renderScheduleCalendar();
    },
});

