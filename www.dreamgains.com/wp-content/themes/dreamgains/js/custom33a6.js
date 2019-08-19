var selected_services = {};

function set_active_testimonial(ix){
    var testimonials = $('#testimonials > .col-md-3 > .row');
    $.each(testimonials, function(ix, value){
        $(value).removeClass('active');
    });
    $(testimonials[ix]).addClass('active');
    $('#testimonials > .col-md-9').html("<iframe src='" + $(testimonials[ix]).attr('data-iframe') + "'></iframe>");
}

function scroll_content(id, ele){
    $.each($(ele).parents('ul.sub_nav').find('a'), function(ix, value){
        $(value).removeClass('active');
    });
    $(ele).addClass('active');
    var offset = $('#' + id).offset();
    $.scrollTo(offset.top - 80, 800, {queue:true});
    return false;
}

function free_trial_submit(ele){
    var success_msg = $(ele).parents('form').find('input[name=success_msg]').val();
    var error_msg = $(ele).parents('form').find('input[name=error_msg]').val();
    var data = {
        name: $(ele).parents('form').find('input[name=name]').val(),
        mobile: $(ele).parents('form').find('input[name=phone_number]').val(),
        action: 'new_post_free_trial' };
    if($(this).parents('form').find('input[name=campaign_code]')) {
        data.campaign_code = $(ele).parents('form').find('input[name=campaign_code]').val();
    }
    $.post( "", data).success(function(){
        $('#success_modal .status_icon').removeClass('success');
        $('#success_modal .status_icon').removeClass('error');
        $('#success_modal h3').html(success_msg);
        $('#success_modal .status_icon').addClass('success');
        $('#success_modal').modal();
    }).error(function(){
        $('#success_modal .status_icon').removeClass('success');
        $('#success_modal .status_icon').removeClass('error');
        $('#success_modal h3').html(error_msg);
        $('#success_modal .status_icon').addClass('error');
        $('#success_modal').modal();
    });
    return false;
}

function get_track_records(on_page){
    $('#track_record_modal #start_date').datepicker({ autoclose: true });
    $('#track_record_modal #end_date').datepicker({ autoclose: true });
    var start_date = $('#start_date').val();
    var end_date = $('#end_date').val();
    var tr_option = $('#track_record_options').val();
    $('#track_record_modal iframe').attr('src','/track-record-results?start_date=' + start_date + '&end_date=' + end_date + "&track_record_options=" + tr_option);
    $('#track_record_modal').modal();
    console.log(start_date, end_date, tr_option);
}

function select_category(ele){
    $(ele).parents('ul').find('a.active').removeClass('active');
    $(ele).addClass('active');
    var option = $(ele).attr('data-option');
    if(option == '' || option == 'all'){
	$('a.svc_box').show();
    } else {
        $('a.svc_box').hide();
        $('a.svc_box.' + option).show();
    }
    return false;
}

function select_bank(ele){
    ele = $(ele).find('option:selected');
    $('.bank_display_details .account_name span').html(ele.attr('data-name'));
    $('.bank_display_details .account_no span').html(ele.attr('data-number'));
    $('.bank_display_details .branch .col-md-6:first-child span').html(ele.attr('data-branch'));
    $('.bank_display_details .branch .col-md-6:last-child span').html(ele.attr('data-isfc'));
}

function slide_testimonial(ix){
    $('#twitter_feed > .row').hide();
    $($('#twitter_feed > .row')[ix]).show();
}

function slide_our_story(year, ele){
    $('#our_story > section > .row').hide();
    $('#our_story > section > .row' + '#' + year + '_content').show();
    $(ele).parents('#timeline').find('a').removeClass('active');
    $(ele).addClass('active');
}

function slide_top_services(ele, op){
    if($(ele).hasClass('disabled')) { return false; }
    else {
        var sibling = op == '-' ? $('.top_service_item:visible').prev() : $('.top_service_item:visible').next();
        console.log(sibling);
        $('.top_service_item').hide();
        $(sibling).show();
        if($(sibling).attr('data-index') == 0) { $('.prev_btn').addClass('disabled'); } else { $('.prev_btn').removeClass('disabled'); }
        if($(sibling).attr('data-index') == ($(sibling).attr('data-count') - 1)) { $('.next_btn').addClass('disabled'); } else { $('.next_btn').removeClass('disabled'); }
    }
}

function show_answer(ele, show){
    $(ele).parents('ol').find('li').removeClass('open');
    if(show) { $(ele).parents('li').addClass('open'); }
}

function select_service(post_id){
    var ele = $('#' + post_id);
    ele.parents('.price_col').find('.checkbox_col').removeClass('selected');
    ele.parents('.checkbox_col').addClass('selected');
    selected_services[ele.attr('data-service-id')] = {
        html_id: post_id,
        id: ele.attr('data-service-id'),
        icon: ele.attr('data-service-icon'),
        title: ele.attr('data-service-title'),
        price: { title: ele.attr('data-service-price-name'), amount: ele.attr('data-service-price-amount') }
    };
    reload_cart();
}

function deselect_service(post_id, id){
    var ele = $('#' + post_id);
    ele.parents('.checkbox_col').removeClass('selected');
    delete selected_services[id];
    reload_cart();
}

function reload_cart(){
    if(_.isEmpty(selected_services)) {
        $('.cart .cart_body').html('You haven’t selected any product');
        $('.cart .cart_body').addClass('no_data');
        $('#price_options').hide();
        $('input#final_amount').val(0);
    } else {
        $('#price_options').show();
        $('.cart .cart_body').removeClass('no_data');
        var html = "", amount = 0.0;
        $.each(selected_services, function(ix, value){
           html += "<div class='row clearfix cart_item'>";
           html += "<div class='col-md-10'>";
           html += "<h4><span class='icon icon-" + value.icon + "'>&nbsp;</span>" + value.title  + "</h4>";
           html += value.price.title + " Rs. " + value.price.amount;
           html = html + "</div><div class='col-md-2 text-right'><a onclick='deselect_service(\"" + value.html_id + "\",\"" + value.id + "\")'><i class='fa fa-times-circle'></i></a></div></div>";
           if(!_.isEmpty(value.price.amount)) { amount += parseFloat(value.price.amount.replace(',','')); }
        });
        html += "<div class='total-row clearfix'><div class='col-md-6'>Total</div><div class='col-md-6 text-right orange'>Rs. " + accounting.formatMoney(amount, '', 0); + "</div></div>";
        $('input#final_amt').val(amount);
        $('.cart .cart_body').html(html);
    }
}

function toggle_career(ele){
    $('.career_list .career_item .desc').hide();
    $(ele).find('.desc').show();
}

function toggle_career_category(ele, cat){
    $(ele).parents('.sub_nav').find('a').removeClass('active');
    $(ele).addClass('active');
    $('.career_item').hide();
    $(".career_item[data-career-cat='" + cat + "']").show();
    $(".career_item .desc").hide();
    $($(".career_item[data-career-cat='" + cat + "']")[0]).find('.desc').show();
}

function trigger_sms_pricing(){
    send_sms($("#bank_details_ddl option:selected").attr('data-id'), $("#bd_mobile").val());
}

function trigger_sms_payment(id, mobile_id){
    send_sms(id, $("#" + mobile_id).val());
}

function send_sms(id, mobile){
    $.get( "/?send_sms=true&bank_id=" + id + "&mobile=" + mobile, function(){});
    $('#success_modal .status_icon').removeClass('success');
    $('#success_modal .status_icon').removeClass('error');
    $('#success_modal h3').html("SMS Sent Successfully");
    $('#success_modal .status_icon').addClass('success');
    $('#success_modal').modal();
}

function select_payment(ele){
    var is_selected = $(ele).hasClass('checkbox_selected');
    $(ele).parents('.payment_methods').find('.col-md-6 > div').html('');
    $(ele).parents('.payment_methods').find('.col-md-6 > div').removeClass('checkbox_selected');
    $(ele).parents('.payment_methods').find('.col-md-6 > div').addClass('checkbox');
    $(ele).parents('.payment_methods').find('.col-md-6').removeClass('active');
    $('#price_options .payment_col').hide();
    if(!is_selected){
        $(ele).removeClass('checkbox').addClass('checkbox_selected').html("<i class='fa fa-check'></i>");
        $(ele).parents('.col-md-6').addClass('active');
        $('#price_options').find('.' + $(ele).attr('data-container')).show();
    } else {
        $(ele).removeClass('checkbox_selected').addClass('checkbox').html("");
    }
}
