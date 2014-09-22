$(document).ready(function(){
    function getInputValue(){
        var charInput = $('#chatInput');
        var data = charInput.val();
        charInput.val('');
        return data;
    }
    var getChatName = function(){
        var pathname = window.location.pathname;
        return pathname.split('/')[2];
    };

    var getRandomColor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };


    var server = io();
    var user = { };

    server.on('connect', function(data){
        user.nickName = prompt('What is your nickname','anonymous') || 'anonymous';
        user.color = getRandomColor();
        server.emit('join', user.nickName, getChatName(), user.color);
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

    server.on('oldUser', function(data){
        console.log('data : '+ data);
        $('#users').append('<li class="list-group-item" id="'+data.id+'" style="color: '+data.color+'">'+data.nickname+'</li>');
    });

    server.on('userleft', function(data){
        console.log('data : '+ data);
        $('#history').append('<span style="color: '+data.color+'">' + data.nickname +'</span> just left...<br/>');
        $('#'+data.id).remove();
    });

    server.on('roomNotExisting', function(data){
        console.log('roomNotExisting : '+ data);
        alert("This chat doesn't exist " +data);
    });

    $('#send').on('click',function(event){
        var input = getInputValue();
        if(input ) {
            server.emit('message', input);
            $('#history').append('<span style="color: '+user.color+'">'+user.nickName+'</span> -> '+ input +"<br/>");
        }
    });

});
