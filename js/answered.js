$(document).ready(function() {
    $('#questions').on('click', '.detail', function() {
        var id = $(this).data('index');
        $.ajax({
            url : '/admin/question/answered-detail',
            data : {
                id : id
            },
            type : 'GET',
            dataType : 'html',
            success : function(data, textStatus, jqXHR) {
                alertify.alert(data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                try {
                    var response = JSON.parse(jqXHR.responseText);
                    alertify.alert('<label style="font-size:18px;font-weight:bold;display:inline-block">' + response.message + '</label>');
                } catch (exception) {
                }
            }
        });
    });

    $('#questions').on('click', '.remove', function() {
        var id = $(this).data('index');
        $.ajax({
            url : '/api.php',
            data : {
                id : id,
                token : $('#token').text(),
                action : 'removeAnsweredQuestion'
            },
            type : 'POST',
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                alertify.alert('刪除成功', function() {
                    setTimeout(function() {
                        window.location.href = '';
                    }, 500);
                });
            },
            error : function(jqXHR, textStatus, errorThrown) {
                try {
                    var response = JSON.parse(jqXHR.responseText);
                    alertify.alert('<label style="font-size:18px;font-weight:bold;display:inline-block">' + response.message + '</label>');
                } catch (exception) {
                }
            }
        });
    });
});