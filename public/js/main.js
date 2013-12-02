$(function() {

    $('.remove-wish').click(function() {
        var $this = $(this);
        $.post( '/admin/delete', { id: $this.data('id') }, function(data) {
            $this.parents('tr').addClass('deleted');    
        });
    });

});