var input = document.getElementById("autoComplete");
var content = document.querySelectorAll('div.content');
var contentParagraph = document.querySelectorAll('div.content > p');
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
input.addEventListener('keyup', paragraphCheck);
function paragraphCheck()
{
    if (input.value !== "" && input.value.length > 3)
    {
        for(i = 0; i < contentParagraph.length; i++)
        {
            if (contentParagraph[i].textContent.toLowerCase().includes(input.value.toLowerCase()))
            {
                content[i].style.visibility = "visible";
                content[i].style.display = "block";
            }
            else
            {
                content[i].style.visibility = "hidden";
                content[i].style.display = "none";
            }
        }
    }
}
function buttonSearching(buttonText)
{
    var buttonWrapperButtons = document.querySelectorAll('#buttonWrapper > button');
    var a=0;
    for(j = 0; j < buttonWrapperButtons.length; j++)
    {
        if(buttonWrapperButtons[j].textContent === buttonText && buttonWrapperButtons[j].value === 'false')
        {
            input.value = buttonText;
            buttonWrapperButtons[j].setAttribute('value', 'true');
            a=j;
        }
        else
        {
            buttonWrapperButtons[j].setAttribute('value', 'false');
        }
    }
    for(i = 0; i < content.length; i++)
    {
        if(buttonWrapperButtons[a].value==='true')
        {
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
        else
        {
            input.value = "";
            content[i].style.visibility = "visible";
            content[i].style.display = "block";
        }
    }
}