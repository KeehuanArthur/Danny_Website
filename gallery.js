var dir = "./img/gallery/";
var fileextension = ".png";
var img_regex = new RegExp("/gif|png|jpg");
var special_regex_width = new RegExp("specialwidth");
var special_regex_length = new RegExp("speciallength");
var image_dict = {}

// var modal = document.getElementById('image_modal');
var modal = document.getElementById('myModal')
var modalImg = document.getElementById("image_in_modal");

function wrap_div_frame(html_string) {
    return "<div class='gallery_thumb_outer_frame img-responsive col-lg-4 col-md-4 col-sm-6 col-xs-12'> <div class='gallery_thumb_frame panel panel-default flex-col'>" + html_string + "</div> </div>";
}

function wrap_long_div_frame(html_string) {
    return "<div class='gallery_thumb_long_outer_frame img-responsive col-lg-4 col-md-4 col-sm-6 col-xs-12'> <div class='gallery_thumb_frame'>" + html_string + "</div></div>";
}

function wrap_wide_div_frame(html_string) {
    return "<div class='gallery_thumb_outer_frame img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12'> <div class='gallery_thumb_frame'>" + html_string + "</div></div>";    
}

function flex_wrap_body(html_string) {
    return '<div class="panel-body panel-custom flex-grow"> <div class="flex-frame">' + html_string + '</div> </div>';
}

function flex_wrap_footer(html_string) {
    return '<div class="panel-footer panel-custom">' + html_string + '</div>';
}

function make_outer_frame(id) {
    return "<div class='gallery_thumb_outer_frame img-responsive col-lg-4 col-md-4 col-sm-6 col-xs-12'> <div " + "id='" + id + "'class='gallery_thumb_frame panel panel-default flex-col'> </div> </div>";
}


/**
 * Adds the image thumb in the gallery with the title under the thumb.
 * 
 * To do this, first get the description.txt from the folder and find any special characteristics
 * of the image. Then use the characteristics to determine what kind of html wrapper to use. Also
 * look in the description.txt to extract the title and the description. After adding the image,
 * add the title and description in the dictionary.
 * 
 * The dictionary is used when displaying the modal. It uses the image id as the key and the
 * value will be an object containing the title and the description
 * 
 * @param {the location of the images and description} file_path 
 * @param {XMLHTTPRequest instance} request
 */
function add_image_add_description( file_path, handler ) {
    thumb_path = file_path + "thumb.jpg";
    description_path = file_path + "description.txt";
    
    var request = new XMLHttpRequest();

    request.onload = handler;
    request.open("GET", description_path, true);  // <--- you have to keep this async using third parameter
    request.send();
}

/**
 * This is a function factory that returns customized handler functions for xmlhttprequests. This is necessary because
 * the image thumbnails are loaded onto the html dynamically when the text file comes in. If we didn't have
 * a function factory, the thumb src would be the same every time the handler is called.
 * 
 * Also, when we receive data for the last item, we also want to apply onclickhandlers to all the image thumbnails.
 * Onclickhandlers for a general class are not applied to dynamic html, so we need to apply them as they come
 * in. We also want to only apply the handler to the class only once or else multiple handlers will be applied.
 * @param {where the thumbnail image is stored} thumb_src 
 * @param {if this is the last item that was requested} last_item 
 */
function create_handler(img_src, last_item) {
    return function() {
        if (this.status == 200) {
            description = this.responseText.split('\n');
            var img_type = description[0];
            var img_title = description[1];
            var img_description = description[2];
            var extra_images_tmp = []

            if (description.length > 3) {
                extra_images_tmp = description[3].split(' ');
            }
            
            /* store information about the image in global dictionary */
            image_dict[img_src] = {
                title: img_title,
                description: img_description,
                extra_imgs: extra_images_tmp
            }


            /* create the dynamic html and add it to the body */
            var thumb_src = img_src + "thumb.jpg";
            var thumb_html = "<img class='gallery_thumb img-responsive' src='" + thumb_src + "' id='" + img_src + "'>";
            var caption_html = '<span class="caption">' + img_title + '</span>';
            var inner_html = flex_wrap_body(thumb_html) + flex_wrap_footer(caption_html);
            var id = img_src;
            id = id.replace(/\//g, '');
            id = id.replace(/\./g, '');
            $("#" + id).append(inner_html);
        
            /* create the onclickhandler for the thumbnail */
            if (last_item) {
                $(".gallery_thumb").click( function() {
                    $("#myModalBody").empty();

                    $("#myModal").find('.modal-title').text(image_dict[this.id].title);
                    $("#myModalBody").append("<img class='modal-dialog-img' src='" + this.src + "'>")

                    img_urls = image_dict[this.id].extra_imgs;
                    for (var i = 0; i < img_urls.length; i++) {
                        $("#myModalBody").append("<img class='modal-dialog-img' src='" + this.id + img_urls[i] + "'>")                        
                    }

                    $("#myModalBody").append("<p>" + image_dict[this.id].description + "</p>");
                    
                    /* display the modal */
                    $("#myModal").modal();
                });
            }
    
        } else {
            console.log("xmlhttprequest errror...");
        }
    }
}

$(document).keyup(function(e) {
    if (e.keyCode == 27) { 
        $("#myModal").modal('toggle');
    }
});

$(window).on("navigate", function (event, data) {
    var direction = data.state.direction;
    if (direction == 'back') {
        alert("mobile back pressed");
    }
  });

/**
 * this is the jquery version of doing xmlhttprequest. You're basically thowing a js object to jquery with
 * a url and a callback function for success. you can also add other callback functions i think.
 */
$.ajax({
    /**
     * This will retrieve the contents of dir if the folder is configured as 'browsable.' On retrieval
     * success, it will run the function and feed the results into (data)
     */
    url: dir,
    success: function (data) {
        /**
         * data is the html that would be displayed if the folder was accessed. each element in the folder is
         * in a surrounded by <li><a href="filename">filename</a></li>
         */
         var num_items = $(data).find("a").length;
         var cur_count = 0;

        /**
         * apparently in namecheap servers, it includes the parent directory in the list of files when you ask
         * for the the list of items in path. So you need to make sure you're not working with the name
         * Parent Directory.
         */
        $(data).find("a").each(function() {
            var sub_folder = $(this).text().replace(/\s/g, '');
            if (sub_folder != "ParentDirectory") {
                cur_count += 1;
                var new_handler;
                var id = dir + sub_folder;
                id = id.replace(/\//g, '');
                id = id.replace(/\./g, '');
                $("#gallery_images").append(make_outer_frame(id));

                if (cur_count < num_items-1) {
                    new_handler = create_handler(dir + sub_folder, false)
                } else {
                    new_handler = create_handler(dir + sub_folder, true)                
                }
                add_image_add_description(dir + sub_folder, new_handler);
            }
        });

    }
});
