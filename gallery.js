var dir = "./img/gallery/";
var fileextension = ".png";
var img_regex = new RegExp("/gif|png|jpg");
var special_regex_width = new RegExp("specialwidth");
var special_regex_length = new RegExp("speciallength");

var modal = document.getElementById('image_modal');
var modalImg = document.getElementById("image_in_modal");

function wrap_div_frame(html_string) {
    return "<div class='gallery_thumb_outer_frame img-responsive col-lg-4 col-md-4 col-sm-6 col-xs-12'> <div class='gallery_thumb_frame'>" + html_string + "</div> </div>";
}

function wrap_long_div_frame(html_string) {
    return "<div class='gallery_thumb_long_outer_frame img-responsive col-lg-4 col-md-4 col-sm-6 col-xs-12'> <div class='gallery_thumb_frame'>" + html_string + "</div></div>";
}

function wrap_wide_div_frame(html_string) {
    return "<div class='gallery_thumb_outer_frame img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12'> <div class='gallery_thumb_frame'>" + html_string + "</div></div>";    
}

$(document).keyup(function(e) {
    if (e.keyCode == 27) { 
        document.getElementById("image_modal").style.display = "none";
    }
});

$(window).on("navigate", function (event, data) {
    var direction = data.state.direction;
    if (direction == 'back') {
        alert("mobile back pressed");
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
                if ( special_regex_width.test($(this).text()) ){
                    $("#gallery_images").append(wrap_wide_div_frame("<img src='" + dir + val + "' class='gallery_thumb img-responsive'>"));  

                } else if (special_regex_length.test($(this).text())) {
                    $("#gallery_images").append(wrap_long_div_frame("<img src='" + dir + val + "' class='gallery_thumb'>"));

                } else {

                    $("#gallery_images").append(wrap_div_frame("<img src='" + dir + val + "' class='gallery_thumb'>"));                  
                }
            }
        });

        $(".gallery_thumb").click( function() {
            modal.style.display = "block";
            modalImg.src = this.src;
        });
    }
});



