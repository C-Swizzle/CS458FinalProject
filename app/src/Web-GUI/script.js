$( document ).ready(function() {

$(document).on( 'click','#flexCheckChecked', function () { 
    $("#slider-row").toggle() 
    $("#win-con").toggle()
    updateWinningNumbers()
});

$(document).on( 'change','#guess', function () { 
    updateWinningNumbers()
});


$(document).on( 'change','#rangeValue1', function () { 
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
    $("#win-odds").text(`${leeway*2+1}% or ${((100-(leeway*2+1))/(leeway*2+1)).toFixed(2)}:1`);
    $("#return-odds").text(`${(((100-(leeway*2+1))/(leeway*2+1)) - 0.05 * ((100-(leeway*2+1))/(leeway*2+1))).toFixed(2)}:1`)

    } else{
        $("#num-range").text(`${numGuess}`)
        $("#win-odds").text("1% or 99.00:1");
        $("#return-odds").text(`80.00:1`)
    }

}







});