$(document).ready(function(){
    // boostrap tooltip初始化
    $('#choice-popular').tooltip('show');
    $('#questions').tooltip('show');

    $('#panel').scroll(function(){
        $('#questions').tooltip('hide');
        $('#choice-popular').tooltip('hide');
    });

    var template = '<input id="question-title" class="field" type="text" placeholder="請輸入標題" style="width:100%" />'
        template+= '<textarea id="question-content" class="field" placeholder="請輸入內容" style="width:100%"></textarea>';
        template+= '<span id="token" style="display:none"></span>';

    alertify.set({
        labels : {
            ok : '確認',
            cancel : '取消'
        }
    });

    $('.edit').each(function(){
        $(this).click(function(){
            var id = $(this).data('index');
            $.ajax({
                url : '/admin/question/popular-detail',
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
                                    action : 'modifyPopularQuestion',
                                    token : $('#new-token').text(),
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
                                    action : 'removePopularQuestion',
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
    
    $('#choice-popular').on('click', function() {
        $.ajax({
            url : '/admin/question/list-popular',
            data : {

            },
            type : 'GET',
            dataType : 'html',
            success : function(data, textStatus, jqXHR) {
                alertify.confirm(data, function(e) {
                    if (e) {
                        var selectedAnswered = [];
                        var token = $('#token').text();

                        $('.popular-display:checked').each(function(index) {
                            selectedAnswered.push(this.value);
                        });

                        $.ajax({
                            url : '/api.php',
                            type : 'POST',
                            data : {
                                action : 'modifyPopularDisplay',
                                answered_id : selectedAnswered,
                                token : token
                            },
                            dataType : 'json',
                            success : function(data, textStatus, jqXHR) {
                                setTimeout(function() {
                                    alertify.alert('修改顯示成功', function() {
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

                // 除了正在顯示的頁數之外其他不顯示
                $('#data-table').find('tr').each(function(index) {
                    if (index >= 6) {
                        this.style.display = 'none';
                    }
                });

                // 分頁
                $("#paginator").paginate({
                    count       : Math.round(parseInt($('#total-num').text(), 10) / 6 + 0.5),
                    start       : 1,
                    display     : 10,
                    border                  : false,
                    images                  : false,
                    text_color              : '#888',
                    background_color        : '#EEE',   
                    text_hover_color        : 'black',
                    background_hover_color  : '#CFCFCF',
                    onChange                : function(page) {
                        var page = parseInt(page, 10);
                        $('#data-table').find('tr').each(function(index) {
                            var min = (page - 1) * 6;
                            var max = (page) * 6;
                            if (index >= min && index < max) {
                                $(this).show();
                            } else {
                                $(this).hide();
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
                action : 'modifyPopularSort',
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