$(document).ready(function(){
    function getInputValue(){
        var charInput = $('#chatInput');
        var data = charInput.val();
        charInput.val('');
        return data;
    }
    var server = io();

    $(window).bind('beforeunload',function(){
        server.emit('userleft');
    });

    server.on('connect', function(data){
        var nickName = prompt('What is your nickname','anonymous');
        server.emit('join', nickName);
    });

    server.on('message', function(data){
       console.log('data : '+ data);
        $('#history').append('<span style="color: '+data.color+'">' + data.nickname +'</span> -> '+ data.msg +"<br/>");
    });
    server.on('newUser', function(data){
        console.log('data : '+ data);
        $('#history').append('<span style="color: '+data.color+'">' + data.nickname +'</span> just joined...<br/>');
        $('#users').append('<li class="list-group-item" id="'+data.id+'" style="color: '+data.color+'">'+data.nickname+'</li>');
    });

    server.on('userleft', function(data){
        console.log('data : '+ data);
        $('#history').append('<span style="color: '+data.color+'">' + data.nickname +'</span> just left...<br/>');
        $('#'+data.id).remove();
    });

    $('#send').on('click',function(event){
        var input = getInputValue();
        if(input ) {
            server.emit('message', input);
        }
    });

});
