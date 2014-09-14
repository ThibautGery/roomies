$(document).ready(function(){
    function getInputValue(){
        var charInput = $('#chatInput');
        var data = charInput.val();
        charInput.val('');
        return data;
    }
    var server = io();

    server.on('connect', function(data){
        var nickName = prompt('What is your nickname','anonymous');
        server.emit('join', nickName);
    });

    server.on('message', function(data){
       console.log('data : '+ data);
        $('#history').append(data.nickname +' -> '+ data.msg +"<br/>");
    });

    $('#send').on('click',function(event){
        var input = getInputValue();
        if(input ) {
            server.emit('message', input);
        }
    });

});
