var input = document.getElementById("autoComplete");
function thing(){
    //test.style.opacity = "0.1";

    if(document.getElementById("page_wrapper").className=="wrapper resources")
    {
        $(".nav-container").css('opacity', 1);
        $("#contentAndHeaderContainer").css('opacity',0.1);
        document.getElementById("contentAndHeaderContainer").style.transition="opacity 0.5s";
        $("#container").css('opacity',0.1);
        $(".container").css('opacity',0.1);
        $("footer").css('opacity',0.1);
    }
    else
    {
        $("#contentAndHeaderContainer").css('opacity',1);
        $("#container").css('opacity',1);
        $(".container").css('opacity',1);
        $("footer").css('opacity',1);
    }
}
input.addEventListener('keyup', (event) => {
    const keyName = event.key;
    if (keyName === 'Enter')
    {
        input.blur();
    }
  });
function buttonSearching(buttonText)
{
    console.log(buttonText);
    var content = document.querySelectorAll('div.content');
    for(i = 0; i < content.length; i++)
    {
        console.log(content[i].getAttribute('value'));
        if(buttonText === content[i].getAttribute('value'))
        {
            content[i].style.visibility = "visible";
            content[i].style.display = "block";
        }
        else
        {
            content[i].style.visibility="hidden";
            content[i].style.display = "none";
        }
    }
}