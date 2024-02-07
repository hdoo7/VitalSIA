/**
 * Created by ejhen on 5/2/2017.
 */

function reaction() {
    var para = document.getElementById("reactionBAC");
    var paraText;

    if (document.getElementById('awie').checked && !chpw.checked && !htie.checked && !iamc.checked) {
        paraText = "You seem to be in touch with the effects alcohol has on you.  Think about whether or not you have " +
            "any concerns about the blood alcohol levels you reach when you drink.";
    } else if (document.getElementById('chpw').checked && !awie.checked && !htie.checked && !iamc.checked) {
        paraText = "Some people feel relieved that they can reach relatively high blood alcohol levels without feeling " +
            "the effects.  They believe this means their bodies handle alcohol safely and efficiently.  Unfortunately, " +
            "this higher tolerancce for alchol can put us at risk for doing more damage to ourselves without getting the" +
            " the message that we are reachin potentially dangerous blood alchol levels.";
    } else if (document.getElementById('htie').checked && !chpw.checked && !awie.checked && !iamc.checked) {
        paraText = "It can be surprising to see how high your blood alcohol levels can get, even during what you " +
            "consider normal drinking situations.  Remember that anyone can develop tolerance to alcohol over time.  " +
            "Think about other reactions you might be having to this new information.";
    } else if (document.getElementById('iamc').checked && !chpw.checked && !htie.checked && !awie.checked) {
        paraText = "It can be surprising to see how high your blood alcohol levels can get, even during what you " +
            "consider normal drinking situations.  Remember that anyone can develop tolerance to alcohol over time.  " +
            "Think about other reactions you might be having to this new information.";
    } else
        paraText = "Error.  Please choose only one choice from the list."

    if (para.style.display == 'block')
        para.style.display = 'none';
    else {
        para.innerHTML = paraText;
        para.style.display = 'block';
    }


}

