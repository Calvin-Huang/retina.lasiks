$(document).ready(function(){
    // boostrap tooltip初始化
    $('#add-common').tooltip('show');
    $('#questions').tooltip('show');

    var template = '<div class="alert alert-info">';
        template+= '<button type="button" class="close" data-dismiss="alert">&times;</button>';
        template+= '<h4>請選擇顯示在前台的問題</h4>';
        template+= '建議最高顯示數量為10則問題';
        template+= '</div>';
        template+= '<input id="question-title" class="field" type="text" placeholder="請輸入標題" style="width:100%" />'
        template+= '<textarea id="question-content" class="field" placeholder="請輸入內容" style="width:100%"></textarea>';
        template+= '<span id="token" style="display:none"></span>';

    alertify.set({
        labels : {
            ok : '確認',
            cancel : '取消'
        }
    });

    $('#panel').scroll(function(){
        $('#questions').tooltip('hide');
        $('#add-common').tooltip('hide');
    });

    $('#add-common').click(function(){
        $.ajax({
            url : '/admin/question/add-question',
            type : 'GET',
            data : {

            },
            dataType : 'html',
            success : function(data, textStatus, jqXHR) {
                alertify.confirm(data, function(e) {
                    if (e) {
                        $.ajax({
                            url : '/api.php',
                            type : 'POST',
                            data : {
                                action : 'addCommonQuestion',
                                question_title : $('#question-title').val(),
                                question_content : $('#question-content').val(),
                                question_answer : $('#question-answer').val(),
                                token : $('#token').text()
                            },
                            dataType : 'json',
                            success : function(data, textStatus, jqXHR) {
                                setTimeout(function() {
                                    alertify.alert('增加成功', function() {
                                        setTimeout(function() {
                                            window.location.href = '';
                                        }, 500);
                                    });
                                }, 500);
                            },
                            error : function(jqXHR, textStatus, errorThrown) {
                                try {
                                    var response = JSON.parse(jqXHR.responseText);
                                    setTimeout(function() {
                                        alertify.alert(response.message);
                                    }, 500);
                                } catch (exception) {

                                }
                            }
                        });
                    }
                    
                });
            },
            error : function(jqXHR, textStatus, errorThrown) {
                try {
                    var response = JSON.parse(jqXHR.responseText);
                    setTimeout(function() {
                        alertify.alert(response.message);
                    }, 500);
                } catch (exception) {

                }
            }
        });
        // alertify.confirm(template, function(e) {
        // });
    });

    $('.edit').each(function(){
        $(this).click(function(){
            var id = $(this).data('index');
            $.ajax({
                url : '/admin/question/common-detail',
                type : 'GET',
                data : {
                    id : id
                },
                dataType : 'html',
                success : function(data, textStatus, jqXHR) {
                    alertify.confirm(data, function(e) {
                        if (e) {
                            $('#token').text($('#new-token').text());
                            $.ajax({
                                url : '/api.php',
                                type : 'POST',
                                data : {
                                    action : 'modifyCommonQuestion',
                                    token : document.getElementById('token').innerHTML,
                                    id : id,
                                    question_title : document.getElementById('question-title').value,
                                    question_content : document.getElementById('question-content').value,
                                    question_answer : $('#question-answer').val(),
                                },
                                dataType : 'json',
                                success : function(data, textStatus, jqXHR) {
                                    setTimeout(function() {
                                        alertify.alert('修改成功', function() {
                                            setTimeout(function() {
                                                window.location.href = '';
                                            }, 500);
                                        });
                                    }, 500);
                                },
                                error : function(jqXHR, textStatus, errorThrown) {
                                    try {
                                        var response = JSON.parse(jqXHR.responseText);
                                        setTimeout(function() {
                                            alertify.alert(response.message);
                                        }, 500);
                                    } catch (exception) {

                                    }
                                }
                            });
                        }
                    });
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    try {
                        var response = JSON.parse(jqXHR.responseText);
                        setTimeout(function() {
                            alertify.alert(response.message);
                        }, 500);
                    } catch (exception) {

                    }
                }
            });
        });
    });

    $('.remove').each(function() {
        $(this).click(function() {
            var id = $(this).data('index');
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
                                    action : 'removeCommonQuestion',
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

    var setSortButton = $('#set-sort');

    $('#questions').sortable({
        sort : function(event, ui) {
            // setSortButton.removeClass('disabled');
        },
    }).disableSelection();

    setSortButton.click(function(event) {
        var rows = $('#questions').find('li');
        var sort = '';
        for (var i = 0; i < rows.length; i ++) {
            sort += 'sort[]=' + rows[i].getAttribute('data-index') + '&';
        }

        // window.location.href = this.href + '?' + sort;
        $.ajax({
            url : '/api.php?' + sort,
            type : 'POST',
            data : {
                action : 'modifyCommonSort',
                token : $('#token').text(),
            },
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                setTimeout(function() {
                    alertify.alert('排序儲存成功', function() {
                        $('#token').text(data.message);
                    });
                }, 500);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                try {
                    var response = JSON.parse(jqXHR.responseText);
                    setTimeout(function() {
                        alertify.alert(response.message);
                    }, 500);
                } catch (exception) {
                }
            }
        });
    });
});