var app = new Vue({
    el: '#app',
    data: {
        confirmModal: false,
        eventData: {
            userId: '',
            startAt: '',
            endAt: '',
        },
        errorMessage: '',
        error: false,
        modalMethod: '',
        loading: false,
        disabledInput: 0,
        inputReasonValue: '',
    },
    methods: {
        renderScheduleCalendar() {
            var self = this;
            let myToast = document.querySelector('.toast');
            let bAlert = new bootstrap.Toast(myToast, {delay: 3000,});

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
                navLinks: false,
                eventOverlap: false,
                editable: false,
                selectable: true,
                dayMaxEvents: true,
                dayHeaderFormat: this.dayHeaderFormatUsingMoment,
                dayMaxEventRows: true,

                contentHeight: 508,
                aspectRatio: 1,
                views: {
                    week: {
                        dayHeaderFormat: {
                            weekday: 'long',
                            day: 'numeric'
                        },
                    },
                },
                slotMinTime: "05:00:00",
                slotMaxTime: "23:59:00",

                loading: function (bool) {
                    if (bool) {
                        self.loading = true;
                    } else {
                        self.loading = false;
                    }
                },

                select: function (eventInfo) {
                    self.inputReasonValue = '';
                    self.error = false;   
                    var selectedDuration = eventInfo.end - eventInfo.start;
                    self.disabledInput = 0;

                    self.modalMethod = 'addSchedule';
                    var events = calendar.getEvents();
                    var currentDate = new Date();
                    currentDate = self.formatDate(currentDate, false);
                    var formatStartDate = self.formatDate(eventInfo.startStr, true);

                    var isOverlap = events.some(function (existingEvent) {
                        return (
                            eventInfo.start < existingEvent.endAt && eventInfo.end > existingEvent.startAt
                        );
                    });
                    if (selectedDuration === 60 * 60 * 1000) {
                        if (formatStartDate > currentDate) {
                            if (!isOverlap) {
                                $('#confirmModal').modal('show');
                                $('#confirmModalButton').off('click').on('click', function () {
                                    this.eventData = {
                                        user_id: $("#iuShow")[0].innerHTML,
                                        reason: self.inputReasonValue,
                                        startAt: eventInfo.startStr,
                                        endAt: eventInfo.endStr
                                    }
                                    $.ajax({
                                        url: "events",
                                        type: 'POST',
                                        data: { event: this.eventData },
                                        success: function (e) {
                                            bAlert.show();
                                            calendar.addEvent({
                                                id: e.event_id,
                                                title: $("#userName")[0].innerHTML,
                                                reason: self.inputReasonValue,
                                                start: eventInfo.startStr,
                                                end: eventInfo.endStr,
                                            });
                                        },
                                        error: function (e) {
                                            self.error = true;
                                            self.errorMessage = "Não foi possível incluir o agendamento, recarregue a página e tente novamente !";
                                        }
                                    });
                                    $('#confirmModal').modal('hide');
                                });
                            };
                        } else {
                            self.error = true;
                            self.errorMessage = "Não é possível agendar em datas passadas !";
                        }
                    } else {
                        self.error = true;
                        self.errorMessage = "Selecione apenas um horário por vez !";
                    }
                },

                eventDidMount: function(info) {
                    $(info.el).popover({
                        title: 'Descrição',
                        placement: 'top',
                        trigger: 'hover',
                        content: info.event._def.extendedProps.reason,
                        container: 'body'
                    });
                  },
                

                eventClick: function (info) {
                    var currentDate = new Date();
                    self.error = false;
                    self.modalMethod = 'delSchedule';
                    self.disabledInput = 1;
                    
                    currentDate = self.formatDate(currentDate, false);
                    var formatStartDate = self.formatDate(info.event.startStr, true);

                    var id = info.event.extendedProps.event_id;
                    var reason = info.event.extendedProps.reason;

                    if (formatStartDate > currentDate){
                        if (!id > 0 || id === undefined) {
                            $.ajax({
                                url: 'get_events',
                                type: 'GET',
                                success: function (data) {
                                    data.map(function (x) {
                                        if (self.formatDate(x.startAt) == self.formatDate(info.event.startStr)) {
                                            id = x.event_id;
                                            self.inputReasonValue = x.reason;
                                        }
                                    });
                                },
                                error: function () {
                                    self.error = true;
                                    self.errorMessage = "Erro ao carregar os eventos, recarregue a página ou tente novamente mais tarde !";
                                }
                            });
                        }    
                        self.inputReasonValue = reason;                    
                        $('#confirmModal').modal('show');        
                        $('#confirmModalButton').off('click').on('click', function () {
                            $.ajax({
                                url: 'events/' + id,
                                type: 'DELETE',
                                success: function (data) {
                                    info.event.remove();
                                    bAlert.show();
                                },
                                error: function (e) {
                                    self.error = true;
                                    if (e.status == 422) {
                                        self.errorMessage = "Somente o usuário administrador ou o próprio usuário do agendamento podem remover !";
                                    }
                                    else{
                                        self.errorMessage = "Ocorreu um erro na remoção do agendamento";
                                    }  
                                }
                            })
                            $('#confirmModal').modal('hide');
                        })
                    }else {
                        self.error = true;
                        self.errorMessage = "Apenas é possível visualizar agendamentos passados !";
                    }
                },

            });
            calendar.render();

            $.ajax({
                url: 'get_events',
                type: 'GET',
                success: function (data) {
                    data.forEach(function (newData, i) {
                        calendar.addEvent({
                            reason: newData.reason,
                            event_id: newData.event_id,
                            title: newData.first_name + ' ' + newData.last_name,
                            start: newData.startAt,
                            end: newData.endAt,
                            user_id: newData.user_id
                        })
                    });
                },
                error: function () {
                    self.error = true;
                    self.errorMessage = "Erro ao tentar carregar os eventos, recarregue a página e tente novamente !";
                }
            });
        },
        formatDate(date, isEventDate) {
            if(!isEventDate) {
                return moment(date).format('DD/MM/YYYY HH:mm')
            } 
            return moment(date).utc().format('DD/MM/YYYY HH:mm')
        }

    },
    computed: {
        modalTitle() {
            return this.modalMethod === 'addSchedule' ? 'Agendar' : 'Remover';
        },
        modalMessage() {
            return this.modalMethod === 'addSchedule' ? 'Confirma o agendamento ? ' : 'Deseja remover o agendamento ? ';
        },
        alertTitle() {
            return this.modalMethod === 'addSchedule' ? 'Adicionado com sucesso' : 'Removido com sucesso';
        },
    },

    mounted() {
        this.renderScheduleCalendar();
    },
});

