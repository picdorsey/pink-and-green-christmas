$(function() {

    $('.remove-wish').click(function() {
        var $this = $(this);
        $.post( '/admin/delete', { id: $this.data('id') }, function(data) {
            if(data == 'success') {
                if($this.parents('tr').hasClass('deleted')){
                    $this.parents('tr').removeClass('deleted');
                }
                else {
                    $this.parents('tr').addClass('deleted');
                }
            }
            else {
                alert('error');
            }
        });
    });
});