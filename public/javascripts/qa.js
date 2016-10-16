$(function(){
    // 分頁
    $('.question1').each(function(index) {
        if (index < 4) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    $("#paginator-1").paginate({
        count       : Math.round(parseInt($('#total-num-1').text(), 10) / 4 + 0.49),
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
            $('.question1').each(function(index) {
                var min = (page - 1) * 4;
                var max = (page) * 4;
                if (index >= min && index < max) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    });

    $("#paginator-2").paginate({
        count       : Math.round(parseInt($('#total-num-2').text(), 10) / 4 + 0.49),
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
                var min = (page - 1) * 4;
                var max = (page) * 4;
                if (index >= min && index < max) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    });

    var fbTool = new FBTool(182353911918205);

    $('#checktime').datepicker();

    $('[data-toggle=tooltip]').tooltip({
        trigger : 'manual'
    });

    $('#tabs').tabs();
    $('#useFB').change(function(){
        var inputField = $('input').not('#useFB');
        if (this.checked) {
            inputField.each(function() {
                $(this).next('.hint').get(0).style.display = 'none';
            });

            var identity = fbTool.getIdentity();
            if (identity != null) {
                $('#name').val(identity.name);
                $('#email').val(identity.email);
            } else {
                this.checked = false;
            }
        } else {
            checkEmailField();
            checkNameField();
        }
    });

    $('input').not('#useFB').each(function() {
        this.onchange = function() {
            checkEmailField();
            checkNameField();
        }
    });

    $('#submit').click(function(){
        var flag = false;
        $('td[data-toggle=tooltip]').each(function() {
            if ($(this).find('input').val() == '' || $(this).find('select').val() == -1 || $(this).find('textarea').val() == '') {
                // 初始化提示
                $(this).tooltip('show');
                flag = false;
            } else {
                $(this).tooltip('hide');
                flag = true;
            }
        });

        if (flag) {
            $.ajax({
                url : '/api.php',
                data : {
                    action : 'sendQuestion',
                    token : $('#token').text(),
                    name : $('#name').val(),
                    sex : $('#sex').val(),
                    age : $('#age').val(),
                    email : $('#email').val(),
                    phone : $('#phone').val(),
                    location : $('input[name=location]').val(),
                    contact : $('input[name=contact]').val(),
                    checktime : $('#checktime').val(),
                    question_title : $('#questionTitle').val(),
                    question_content : $('#questionContent').val(),
                },
                type : 'POST',
                dataType : 'json',
                success : function(data, textStatus, jqXHR) {
                    if (data.status == 'success') {
                        alertify.set({
                            labels : {
                                ok : '確認',
                                cancel : '取消'
                            }
                        });
                        alertify.alert('<label style="font-size:18px;font-weight:bold;display:inline-block">謝謝你的提問！我們將會於24小時內儘快回覆您</label>');
                        $('#token').text(data.message);
                    }
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    try {
                        var response = JSON.parse(jqXHR.responseText);
                        alertify.alert('<label style="font-size:18px;font-weight:bold;display:inline-block">' + response.message + '</label>');
                    } catch (exception) {
                    }
                },
                beforeSend : function() {
                    openMask(true);
                },
                complete : function() {
                    closeMask();
                }
            });
        }

        // var useFB = document.getElementById('useFB').checked;

        // if (((!useFB) ? (checkNameField() && checkEmailField()) : useFB) && checkQuestionTitle()) {
        //     $.ajax({
        //         url : '/api.php',
        //         type : 'GET',
        //         data : {
        //             action : 'sendQuestion',
        //             email : document.getElementById('email').value,
        //             name : document.getElementById('name').value,
        //             question_title : document.getElementById('questionTitle').value,
        //             question_content : document.getElementById('questionContent').value,
        //             token : document.getElementById('token').innerHTML
        //         },
        //         dataType : 'json',
        //         beforeSend : function() {
        //             openMask(true);
        //         },
        //         complete : function() {
        //             closeMask();
        //         },
        //         success : function(data, textStatus, jqXHR) {
        //             if (data.status == 'success') {
        //                 alertify.set({
        //                     labels : {
        //                         ok : '確認',
        //                         cancel : '取消'
        //                     }
        //                 });
        //                 alertify.alert('<label style="font-size:18px;font-weight:bold;display:inline-block">謝謝你的提問！我們將會於24小時內儘快回覆您</label>');
        //             }
        //         },
        //         error : function(jqXHR, textStatus, errorThrown) {
        //             var response = JSON.parse(jqXHR.responseText);
        //             document.getElementById('textStatus').innerHTML = response.message;
        //         }
        //     });
        // }
    });

    var checkEmailField = function() {
        var emailField = document.getElementById('email');
        if (emailField.value == '' || !emailField.value.match(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})*$/)) {
            // $(this).tooltip({
            //     title : '請輸入正確的信箱格式'
            // }).tooltip('show');
            return false;
        } else {
        }
        return true;
    }
    var checkNameField = function() {
        var nameField = document.getElementById('name');
        if (nameField.value == '') {

            return false;
        } else {
        }
        return true
    }
    var checkQuestionTitle = function() {
        var nameField = document.getElementById('questionTitle');
        if (nameField.value == '') {
            return false;
        } else {
        }
        return true
    }
});