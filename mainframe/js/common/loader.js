//display loading animation before it's ready
jQuery(function($){
$(document).ready(function () {
    if ($('.loading-container').length) {

        //to show loading animation
        $imgloader = $('.loading-container');
        $loadingimg = $('<div id="canvasloader-container" class="onepix-imgloader"></div>');

//          $loadingimg.attr("src","images/flexslider/loading.gif");
        $imgloader.prepend($loadingimg);

//          canvasloader code
        var cl = new CanvasLoader('canvasloader-container');
        cl.setColor('#9dbf15'); // default is '#000000'
        //cl.setBackgroundColor('#222222');
        cl.setShape('spiral'); // default is 'oval'
        cl.setDiameter(46); // default is 40
        cl.setDensity(48); // default is 40
        cl.setRange(1.4); // default is 1.3
        cl.setSpeed(1); // default is 2
        cl.setFPS(37); // default is 24
        cl.show(); // Hidden by default

    }

});
});
