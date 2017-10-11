var dir = "./img/hs_gallery/";
var fileextension = ".png";
var img_regex = new RegExp("/gif|png|jpg");
var special_regex = new RegExp("special");

var modal = document.getElementById('image_modal');
var modalImg = document.getElementById("image_in_modal");

function wrap_div_frame(html_string) {
    return "<div class='gallery_thumb_outer_frame img-responsive col-lg-4 col-md-4 col-sm-6 col-xs-12'> <div class='gallery_thumb_frame'>" + html_string + "</div> </div>";
}

$(document).keyup(function(e) {
    if (e.keyCode == 27) { 
        document.getElementById("image_modal").style.display = "none";
    }
});

$.ajax({
    //This will retrieve the contents of the folder if the folder is configured as 'browsable'
    url: dir,
    success: function (data) {
        //List all .png file names in the page
        $(data).find("a").attr("href", function (i, val) {
            console.log(this);
            if ( img_regex.test($(this).text()) ) {
                if ( special_regex.test($(this).text()) ){
                    $("#gallery_images").append("<img src='" + dir + val + "' class='gallery_thumb img-responsive'>");                    
                } else {
                    $("#gallery_images").append(wrap_div_frame("<img src='" + dir + val + "' class='gallery_thumb img-responsive'>"));                    
                }
            }
        });

        $(".gallery_thumb").click( function() {
            modal.style.display = "block";
            modalImg.src = this.src;
        });
    }
});

