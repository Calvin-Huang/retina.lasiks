$(document).ready(function(){
    $('.reply').each(function(){
        $(this).click(function(){
            alertify.set({
                labels : {
                    ok : '送出回覆',
                    cancel : '取消'
                }
            });
            var id = $(this).attr('key');
            $.ajax({
                url : '/admin/question/not-answered-detail',
                type : 'GET',
                data : {
                    id : id
                },
                dataType : 'html',
                success : function(data, textStatus, jqXHR) {
                    alertify.confirm(data, function(e) {
                        if (e) {
                            sendAnswer()
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
            alertify.set({
                labels : {
                    ok : '確認',
                    cancel : '取消'
                }
            });
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
    
    $('#set-mail-sender').click(function() {
        alertify.set({
            labels : {
                ok : '測試連線',
                cancel : '取消'
            }
        });
        $.ajax({
            url : '/api.php',
            type : 'GET',
            data : {
                action : 'getMailManager'
            },
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                var template = '<h4>請使用Gmail帳號</h4>';
                    template+= '<div id="name"><input type="text" class="field" value="' + data.message.name + '" /></div>';
                    template+= '<div id="username" style="background-position:11px -41px;"><input type="text" class="field" value="' + data.message.username + '" /></div>';
                    template+= '<div id="password"><input type="password" class="field" placeholder="新密碼" /></div>';
                    template+= '<div id="token" style="display:none">' + data.message.token + '</div>';
                var name = data.message.name;
                var username = data.message.username;
                var password = data.message.password;

                alertify.confirm(template, function(e) {
                    if (e) {
                        setTimeout(function(){
                            alertify.set({
                                labels : {
                                    ok : '確認',
                                    cancel : '取消'
                                }
                            });
                            $.ajax({
                                url : '/api.php',
                                type : 'GET',
                                data : {
                                    action : 'checkMailAccount',
                                    username : $('#username').find('input').val(),
                                    password : $('#password').find('input').val(),
                                    name : $('#name').find('input').val(),
                                    token : document.getElementById('token').innerHTML,
                                },
                                dataType : 'json',
                                beforeSend : function() {
                                    openMask(true);
                                },
                                complete : function() {
                                    closeMask();
                                },
                                success : function(data, textStatus, jqXHR) {
                                    alertify.confirm('測試連線成功，確定要更改設定嗎', function(e) {
                                        if (e) {
                                            setTimeout(function() {
                                                $.ajax({
                                                    url : '/api.php',
                                                    type : 'POST',
                                                    data : {
                                                        action : 'modifyMailManager',
                                                        name : name,
                                                        token : data.message,
                                                    },
                                                    dataType : 'json',
                                                    success : function(data, textStatus, jqXHR) {
                                                        alertify.alert('修改成功');
                                                    },
                                                    error : function(jqXHR, textStatus, errorThrown) {

                                                    }
                                                });
                                            }, 500);
                                        }
                                    });
                                },
                                error : function(jqXHR, textStatus, errorThrown) {
                                    alertify.alert('測試連線失敗，請檢查賬號密碼');
                                }
                            });
                        }, 500);
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

    $('#set-mail-receiver').on('click', function() {
        var appendField = function() {
            $('#data-table').on('click', '.receiver:last', function() {
                $(this).after('<tr class="receiver" ><td><input class="name" placeholder="請輸入姓名" type="text" /></td><td><input class="email" placeholder="請輸入信箱" type="email" /></td></tr>');
            });
        };
        alertify.set({
            labels : {
                ok : '確認',
                cancel : '取消'
            }
        });
        $.ajax({
            url : '/admin/question/mail-receiver',
            data : {
            },
            type : 'GET',
            dataType : 'html',
            success : function(data, textStatus, jqXHR) {
                setTimeout(function() {
                    appendField();
                }, 750);
                alertify.confirm(data, function(e) {
                    if (e) {

                        var names = '';
                        var emails = '';
                        $('.receiver').each(function(index) {
                            if ($(this).find('.name').val() != '' && $(this).find('.email').val() != '' && !$(this).find('.delete').is(':checked')) {
                                names += 'names[]=' + $(this).find('.name').val() + '&';
                                emails += 'emails[]=' + $(this).find('.email').val() + '&';
                            }
                        });

                        $.ajax({
                            url : '/api.php?' + names + emails,
                            data : {
                                action : 'setMailReceiver',
                                token : $('#token').text(),
                            },
                            type : 'POST',
                            dataType : 'json',
                            success : function(data, textStatus, jqXHR) {
                                setTimeout(function() {
                                    alertify.alert('修改收信設定成功');
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

    var sendAnswer = function() {
        alertify.set({
            labels : {
                ok : '確認',
                cancel : '取消'
            }
        });
        if (document.getElementById('question-answer').value == '<br>' || document.getElementById('question-answer').value == '') {
            setTimeout(function(){
                alertify.alert('<label style="font-size:18px;font-weight:bold;display:inline-block">請確認已經填寫回覆內容！</label>');
            }, 500);
            return;
        }
        $.ajax({
            url : '/api.php',
            type : 'GET',
            data : {
                action : 'sendAnswer',
                token : $('#token').text(),
                question_id : $('#id').text(),
                answer_content : document.getElementById('question-answer').value
            },
            dataType : 'json',
            beforeSend : function() {
                openMask(true);
            },
            complete : function() {
                closeMask();
            },
            success : function(data, textStatus, jqXHR) {
                alertify.alert('<label style="font-size:18px;font-weight:bold;display:inline-block">問題回覆已經成功寄出！</label>', function(e) {
                    setTimeout(function(){
                        window.location.href = '';
                    }, 500);
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
    };
});