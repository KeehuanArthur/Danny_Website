var dir = "./img/gallery/";
var fileextension = ".png";
var img_regex = new RegExp("/gif|png|jpg");
var special_regex_width = new RegExp("specialwidth");
var special_regex_length = new RegExp("speciallength");
var image_dict = {}
var image_idx_src = "./img/gallery/index.json"

// var modal = document.getElementById('image_modal');
var modal = document.getElementById('myModal')
var modalImg = document.getElementById("image_in_modal");

function wrap_thumbnail(id, inner_html) {
    var html = "<div class='gallery_thumb_outer_frame img-responsive col-lg-4 col-md-4 col-sm-6 col-xs-12'>";
    html += "<div " + "id='" + id + "'class='gallery_thumb_frame panel panel-default flex-col'>";
    html += inner_html + "</div> </div>";
    return html;
    // return "<div class='gallery_thumb_outer_frame img-responsive col-lg-4 col-md-4 col-sm-6 col-xs-12'> <div " + "id='" + id + "'class='gallery_thumb_frame panel panel-default flex-col'>" + inner_html + "</div> </div>";    
}

function flex_wrap_body(html_string) {
    return '<div class="panel-body panel-custom flex-grow"> <div class="flex-frame">' + html_string + '</div> </div>';
}

function flex_wrap_footer(html_string) {
    return '<div class="panel-footer panel-custom">' + html_string + '</div>';
}

function remove_spaces(string) {
    return string.replace(/\//g, '');
}

function add_thumbnail(json) {
    var id = remove_spaces(json.title);
    var thumb_image = "<img class='gallery_thumb img-responsive' src='" + dir + json.src[0] + "' id='" + id + "'>";    
    var thumb_title = "<span class='caption'>" + json.title + "</span>";

    var inner_html = flex_wrap_body(thumb_image) + flex_wrap_footer(thumb_title);
    var thumb_html = wrap_thumbnail(id, inner_html);

    $("#gallery_images").append(thumb_html);
}

function add_onclick_listeners() {
    $(".gallery_thumb").click(function() {
        $("#myModalBody").empty();
        $("#myModal").find(".modal-title").text(image_dict[this.id].title);

        for (var i = 0; i < image_dict[this.id].src.length; i++) {
            $("#myModalBody").append("<img class='modal-dialog-img' src='" + dir + image_dict[this.id].src[i] + "'>")            
        }

        $("#myModalBody").append("<p>" + image_dict[this.id].description + "</p>");
        
        $("#myModal").modal();
    });
}

$(window).on("navigate", function (event, data) {
    var direction = data.state.direction;
    if (direction == 'back') {
        alert("mobile back pressed");
    }
  });

  /**
   * get index.json file and place the images according to that file.
   */
$.getJSON(
    image_idx_src,
    function(json) {
    
        /* Add each image into the html body */
        for (var i = 0; i < json.length; i++) {
            add_thumbnail(json[i]);

            image_dict[remove_spaces(json[i].title)] = json[i];
        }

        /* Attach onclicklisteners to all of the images */
        add_onclick_listeners();
    }
)