var app = new Vue({
    el: '#app',
    data: {
        confirmModal: false,
    },
    methods: {
        showModal(e) {
            this.confirmModal = true;
        },
        scheduleHour(){
            $.ajax({
                url: "rooms",
                type: 'GET',
                success: function(e) {
                  alert('Ok ajax');
                },
                error: function(e) {
                  alert('Erro ajax');
                }
            })
        }
    }
});