var input = document.getElementById("autoComplete");
var content = document.querySelectorAll('div.content');
var contentParagraph = document.querySelectorAll('div.content > p');
var contentTitle = document.querySelectorAll('div.content > h4');
var buttonWrapperButtons = document.querySelectorAll('#buttonWrapper > button');
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
input.addEventListener('keyup',buttonSearching(this.value));
//checks the paragraphs of the cards
function paragraphCheck()
{
    var searchContainer = document.getElementById("autoComplete_list_1");
    var searchList = document.querySelectorAll('#autoComplete_list_1 > li');
    var searchLength = searchList.length;
    var a = 0;
    if (input.value !== "" && input.value.length >= 3)
    {
        for(i = 0; i < (contentParagraph.length); i++)
        {
            if (contentParagraph[i].textContent.toLowerCase().includes(input.value.toLowerCase()))
            {
                    var duplicateCheck = false;
                    var x = document.createElement("li");
                    var t = document.createTextNode(contentTitle[i].textContent);
                    x.setAttribute("role", "option");
                    x.appendChild(t);
                    content[i].style.visibility = "visible";
                    content[i].style.display = "block";
                    try
                    {
                    if(document.body.contains(document.querySelector('.no_result')))
                        {
                            document.querySelector('.no_result').style.visibility = "hidden";
                            document.querySelector('.no_result').style.display = "none";
                        }
                    }
                    catch(e)
                    {
                        console.log(e);
                    }
                    //check if there is a duplicate in searchList            
                    for(j = 0; j < searchList.length; j++)
                    {
                        console.log(searchList[j].textContent);
                        console.log(contentTitle[i].textContent);
                        console.log(searchList[j].textContent === contentTitle[i].textContent);
                        if(searchList[j].textContent === contentTitle[i].textContent)
                        {
                            duplicateCheck = true;
                        }
                    }
                    //if the duplicate check isnt activated      
                    if(!duplicateCheck)
                    { 
                        //if the LI in question is clicked, then the following div will show up
                        x.onclick = function(){
                        var justify = this.textContent;
                        input.value = justify;
                        console.log(justify);
                        for(i = 0; i < content.length; i++)
                        {
                            if(contentTitle[i].textContent === justify)
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
                        
                        console.log(a);
                        x.setAttribute("id", "autoComplete_result_"+(a + searchLength));
                        a++;
                        searchContainer.appendChild(x);
                    }
            }
        }
    }
}
//starts when the buttons are pressed
function buttonSearching(buttonText)
{
    var a=0;
    for(j = 0; j < buttonWrapperButtons.length; j++)
    {
        if(buttonWrapperButtons[j].textContent === buttonText)
        {
            input.value = buttonText;
            buttonWrapperButtons[j].style.color = "white"
            buttonWrapperButtons[j].style.backgroundColor = "#c9467f";
            a=j;
        }
        else
        {
            buttonWrapperButtons[j].style.color = "#c9467f";
            buttonWrapperButtons[j].style.backgroundColor = "white"
        }
    }
    for(i = 0; i < content.length; i++)
    {
        if(buttonWrapperButtons[a].value==='true')
        {
            if(buttonText === content[i].getAttribute('data-tag'))
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
            buttonWrapperButtons[0].style.color = "white"
            buttonWrapperButtons[0].style.backgroundColor = "#c9467f";
            buttonWrapperButtons[1].style.color = "white"
            buttonWrapperButtons[1].style.backgroundColor = "#c9467f";
            buttonWrapperButtons[2].style.color = "white"
            buttonWrapperButtons[2].style.backgroundColor = "#c9467f";
        }
    }
}