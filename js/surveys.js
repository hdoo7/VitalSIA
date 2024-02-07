/**
 * Created by SpeedGrapher on 4/1/2017.
 */
function highlight(elem) {
    var p = document.getElementsByTagName('p');
    for (i = 0; i < p.length; i++) {
        p[i].classList.remove('myClass')
    }
    elem.classList.add('myClass');
}