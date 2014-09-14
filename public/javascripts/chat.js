$(document).ready(function(){
    function getInputValue(){
        var charInput = $('#chatInput');
        var data = charInput.val();
        charInput.val('');
        return data;
    }
    var server = io();

    server.on('message', function(data){
       console.log('data : '+ data);
        $('#history').append(data+"<br/>");
    });

    $('#send').on('click',function(event){
        var input = getInputValue();
        if(input ) {
            server.emit('message', input);
        }
    });

});
