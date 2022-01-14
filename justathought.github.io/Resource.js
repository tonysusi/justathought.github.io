//start of code. probably name it lol
//blurs and unblurs the whole body
function thing(){
    //test.style.opacity = "0.1";

    if(document.getElementById("page_wrapper").className=="wrapper resources")
    {
        $(".nav-container").css('opacity', 1);
        $(".contentAndHeaderContainer").css('opacity',0.1);
        document.getElementsByClassName("contentAndHeaderContainer").style.transition="opacity 0.5s";
        $(".cardResources").css('opacity',0.1);
        $(".container").css('opacity',0.1);
        $("footer").css('opacity',0.1);
    }
    else
    {
        $(".contentAndHeaderContainer").css('opacity',1);
        $(".cardResources").css('opacity',1);
        $(".container").css('opacity',1);
        $("footer").css('opacity',1);
    }
}
//when website has been loaded, call this function.
//adds events to autocomplete searchbar
function resourceOnload(){
    input = document.getElementById("autoComplete");
    content = document.querySelectorAll('div.cardResources');
    contentParagraph = document.querySelectorAll('div.cardResources > p');
    contentTitle = document.querySelectorAll('div.cardResources > h4');
    buttonWrapperButtons = document.querySelectorAll('#buttonWrapper > button');
    input.addEventListener('keyup', (event) => {
        const keyName = event.key;
        if (keyName === 'Enter')
        {
            input.blur();
        }
      });
    buttonsPressed = false;
}

//checks the paragraphs of the cards
// function paragraphCheck(matchArrayList, resultsArrayList)
// {
//     var searchContainer = document.getElementById("autoComplete_list_1");
//     var searchList = document.querySelectorAll('#autoComplete_list_1 > li');
//     var searchLength = searchList.length;
//     var a = 0;
//     if (input.value !== "" && input.value.length >= 3)
//     {
//         for(i = 0; i < (contentParagraph.length); i++)
//         {
//             if (contentParagraph[i].textContent.toLowerCase().includes(input.value.toLowerCase()))
//             {
//                     var duplicateCheck = false;
//                     var x = document.createElement("li");
//                     var t = document.createTextNode(contentTitle[i].textContent);
//                     x.setAttribute("role", "option");
//                     x.appendChild(t);
//                     content[i].style.visibility = "visible";
//                     content[i].style.display = "block";
//                     try
//                     {
//                     if(document.body.contains(document.querySelector('.no_result')))
//                         {
//                             document.querySelector('.no_result').style.visibility = "hidden";
//                             document.querySelector('.no_result').style.display = "none";
//                         }
//                     }
//                     catch(e)
//                     {
//                         console.log(e);
//                     }
//                     //check if there is a duplicate in searchList            
//                     for(j = 0; j < searchList.length; j++)
//                     {
//                         if(searchList[j].textContent === contentTitle[i].textContent)
//                         {
//                             duplicateCheck = true;
//                         }
//                     }
//                     //if the duplicate check isnt activated      
//                     if(!duplicateCheck)
//                     { 
//                         //pushes the list into the result and list array so the library can count the matches in the paragraph check
//                         matchArrayList.push(contentTitle[i].textContent);
//                         resultsArrayList.push(contentTitle[i].textContent);
//                         //if the LI in question is clicked, then the following div will show up
//                         x.onclick = function(){
//                         var justify = this.textContent;
//                         input.value = justify;
//                         for(i = 0; i < content.length; i++)
//                         {
//                             if(contentTitle[i].textContent === justify)
//                             {
//                                 content[i].style.visibility = "visible";
//                                 content[i].style.display = "block";
//                             }
//                             else
//                             {
//                                 content[i].style.visibility = "hidden";
//                                 content[i].style.display = "none";
//                             }
//                         }
//                     }
//                         x.setAttribute("id", "autoComplete_result_"+(a + searchLength));
//                         a++;
//                         searchContainer.appendChild(x);
//                     }
//             }
//         }
//     }
// }

//input.addEventListener('keyup', buttonSearching(input.value));
//starts when the buttons are pressed
//searches if texts in the button is the same as the value of input/buttons
//and shows the cards up
function buttonPressed(buttonValue)
{
    if(buttonValue.getAttribute("buttonStatus") === "notPressed")
    {   
        
        input.value = buttonValue.textContent;
        buttonsPressed = true;
        $('#autoComplete').keyup();
        //buttonSearching(buttonValue.textContent);
    }
    else
    {
        input.value = "";
        buttonsPressed = false;
        $('#autoComplete').keyup();
        buttonValue.setAttribute("buttonStatus","notPressed");
        //buttonChange(0,buttonsPressed);
    }
    
}
//checks if input is zero or not
//if it is, then show every content
function inputZero(valueLength)
{
    if(valueLength === 0)
    {
        input.setAttribute('class', 'magnifyingGlass');
        $('.cardResources').css('visibility', 'visible');
        $('.cardResources').css('display','block');
    }
    else
    {
        input.setAttribute('class', 'noGlass');
    }
}
    //deletes the value of autoComplete bar
    function clearAutoComplete(event, eleTest)
    {
        var rect = eleTest.getBoundingClientRect();
        var x = event.clientX;
        if(input.className==='noGlass')
        {
            // &&(y<rect.y + rect.height && y < rect.y+rect.height-55)
            if(x < (rect.x + rect.width) && x > (rect.x + rect.width - 55))
            {
                input.value = "";
                $('ul').empty();
                $('ul').css("visibility","hidden");
                $('#autoComplete').keyup();
            }
        }
    }
function arrayRemove(arr,value)
{
    return arr.filter(function(ele)
    {
        return ele!=value;
    });
}
//matches the buttons pressed and looks the matches for everything
function buttonSearching(buttonText)
{
    buttonsPressed = false;
    var a=0;
    for(j = 0; j < buttonWrapperButtons.length; j++)
    {
        if(buttonWrapperButtons[j].textContent.toLowerCase() === buttonText.toLowerCase())
        {
            buttonWrapperButtons[j].setAttribute('buttonStatus', 'pressed');
            buttonWrapperButtons[j].style.color = "white";
            buttonWrapperButtons[j].style.backgroundColor = "#c9467f"
            a=j;
            buttonsPressed = true;
        }
        else
        {
            buttonWrapperButtons[j].setAttribute('buttonStatus', 'notPressed');
            buttonWrapperButtons[j].style.color = "#c9467f";
            buttonWrapperButtons[j].style.backgroundColor = "white"
        }
    }
    buttonChange(a, buttonsPressed);
}
//shows which button to show when buttons are pressed
function buttonChange(buttonIndex, buttonsPressed)
{
    if(buttonsPressed)
    {
        for(i = 0; i < content.length; i++)
        {
            if(input.value === content[i].getAttribute('data-tag'))
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
    else
    {
        for(i = 0; i < buttonWrapperButtons.length; i++)
        {
            buttonWrapperButtons[i].style.color = "#c9467f";
            buttonWrapperButtons[i].style.backgroundColor = "white"
        }
    }
    
}