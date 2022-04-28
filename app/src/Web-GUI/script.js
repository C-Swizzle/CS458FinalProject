$( document ).ready(function() {

$(document).on( 'click','#flexCheckChecked', function () { 
    $("#slider-row").toggle() 
    $("#win-con").toggle()
    updateWinningNumbers()
});

$(document).on( 'change','#guess', function () { 
    updateWinningNumbers()
});

$(document).on( 'click','#slider-row', function () { 
   updateWinningNumbers()
});


$(document).on( 'click','#send-button', function () { console.log('click') });


function updateWinningNumbers(){
    var guess = $("#guess").val();
    var leeway = $("#leeway").val();
    var numGuess = Number(guess);
    var numLeeway = Number(leeway);
    var min = numGuess - numLeeway;
    if(min<1){
        min+=100;
    }
    var max = numGuess + numLeeway;
    if(max>100){
        max-=100;
    }
    if($("#flexCheckChecked").is(":checked")){
    $("#num-range").text(`${min} - ${max}`)
    } else{
        $("#num-range").text(`${numGuess}`)
    }

}







});