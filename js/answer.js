$(document).ready(function(){
    // $('#editor').cleditor({width:'595px', height:'300px'})[0].focus();
    $('#submit').click(function(){
        if (document.getElementById('editor').value == '<br>' || document.getElementById('editor').value == '') {
            alertify.set({
                labels : {
                    ok : '確認',
                    cancel : '取消'
                }
            });
            setTimeout(function(){
                alertify.alert('<label style="font-size:18px;font-weight:bold;display:inline-block">請確認已經填寫回覆內容！</label>')
            }, 500);
            return;
        }
        $.ajax({
            url : '/api.php',
            type : 'POST',
            data : {
                action : 'sendAnswer',
                token : document.getElementById('token').innerHTML,
                question_id : document.getElementById('questionId').innerHTML,
                answer_content : document.getElementById('editor').value
            },
            dataType : 'json',
            beforeSend : function() {
                openMask(true);
            },
            complete : function() {
                closeMask();
            },
            success : function() {
                alertify.set({
                    labels : {
                        ok : '返回未回覆問題列表',
                        cancel : '留在本頁'
                    }
                });
                alertify.confirm('<label style="font-size:18px;font-weight:bold;display:inline-block">問題回覆已經成功寄出！</label>', function(e) {
                    if (e) {
                        setTimeout(function(){
                            window.location.href = document.getElementById('listUrl').innerHTML;
                        }, 500);
                    } else {
                        // do notthing
                    }
                });
            },
            error : function() {

            }
        });
    });
    
    $('.remove').each(function() {
        $(this).click(function() {
            var id = $(this).attr('key');
            $.ajax({
                url : '/api.php',
                type : 'GET',
                data : {
                    action : 'getToken'
                },
                dataType : 'json',
                success : function(data, textStatus, jqXHR) {
                    var token = data.message;
                    alertify.confirm('確定要刪除嗎', function(e) {
                        if (e) {
                            $.ajax({
                                url : '/api.php',
                                type : 'POST',
                                data : {
                                    action : 'removeNotAnsweredQuestion',
                                    id : id,
                                    token : token
                                },
                                dataType : 'json',
                                success : function(data, textStatus, jqXHR) {
                                    setTimeout(function() {
                                        alertify.alert('已經刪除', function() {
                                            setTimeout(function() {
                                                window.location.href = '';
                                            }, 500);
                                        });
                                    }, 500);
                                },
                                error : function(jqXHR, textStatus, errorThrown) {

                                }
                            });
                        }
                    });
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    
                }
            });
        });
    });
    
    $('#set-mail-sender').click(function() {
        $.ajax({
            url : '',
            type : 'GET',
            data : {

            },
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                var template = '';
                console.log(data.message.username + '\n' + data.message.name);
            },
            error : function(jqXHR, textStatus, errorThrown) {

            }
        });
    });
});