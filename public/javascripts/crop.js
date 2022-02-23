<script>
    var c;
    var galleryImagesContainer = document.getElementById('galleryImages');
    var imageCropFileInput = document.getElementById('imageCropFileInput');
    var cropperImageInitCanvas = document.getElementById('cropperImg');
    var cropImageButton = document.getElementById('cropImageBtn');
    // Crop Function On change
    function imagesPreview(input) {
        var cropper;
        galleryImagesContainer.innerHTML = '';
        var img = [];
        if (cropperImageInitCanvas.cropper) {
            cropperImageInitCanvas.cropper.destroy();
            cropImageButton.style.display = 'none';
            cropperImageInitCanvas.width = 0;
            cropperImageInitCanvas.height = 0;
        }
        if (input.files.length) {
            var i = 0;
            var index = 0;
            for (let singleFile of input.files) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    var blobUrl = event.target.result;
                    img.push(new Image());
                    img[i].onload = function (e) {
                        // Canvas Container
                        var singleCanvasImageContainer = document.createElement('div');
                        singleCanvasImageContainer.id = 'singleImageCanvasContainer' + index;
                        singleCanvasImageContainer.className = 'singleImageCanvasContainer';
                        // Canvas Close Btn
                        var singleCanvasImageCloseBtn = document.createElement('button');
                        var singleCanvasImageCloseBtnText = document.createTextNode('Close');
                        // var singleCanvasImageCloseBtnText = document.createElement('i');
                        // singleCanvasImageCloseBtnText.className = 'fa fa-times';
                        singleCanvasImageCloseBtn.id = 'singleImageCanvasCloseBtn' + index;
                        singleCanvasImageCloseBtn.className = 'singleImageCanvasCloseBtn';
                        singleCanvasImageCloseBtn.onclick = function () { removeSingleCanvas(this) };
                        singleCanvasImageCloseBtn.appendChild(singleCanvasImageCloseBtnText);
                        singleCanvasImageContainer.appendChild(singleCanvasImageCloseBtn);
                        // Image Canvas
                        var canvas = document.createElement('canvas');
                        canvas.id = 'imageCanvas' + index;
                        canvas.className = 'imageCanvas singleImageCanvas';
                        canvas.width = e.currentTarget.width;
                        canvas.height = e.currentTarget.height;
                        canvas.onclick = function () { cropInit(canvas.id); };
                        singleCanvasImageContainer.appendChild(canvas)
                        // Canvas Context
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(e.currentTarget, 0, 0);
                        // galleryImagesContainer.append(canvas);
                        galleryImagesContainer.appendChild(singleCanvasImageContainer);
                        while (document.querySelectorAll('.singleImageCanvas').length == input.files.length) {
                            var allCanvasImages = document.querySelectorAll('.singleImageCanvas')[0].getAttribute('id');
                            cropInit(allCanvasImages);
                            break;
                        };
                        urlConversion();
                        index++;
                    };
                    img[i].src = blobUrl;
                    i++;
                }
                reader.readAsDataURL(singleFile);
            }
            // addCropButton();
            // cropImageButton.style.display = 'block';
        }
    }
    imageCropFileInput.addEventListener("change", function (event) {
        imagesPreview(event.target);
    });
    // Initialize Cropper
    function cropInit(selector) {
        c = document.getElementById(selector);
        console.log(document.getElementById(selector));
        if (cropperImageInitCanvas.cropper) {
            cropperImageInitCanvas.cropper.destroy();
        }
        var allCloseButtons = document.querySelectorAll('.singleImageCanvasCloseBtn');
        for (let element of allCloseButtons) {
            element.style.display = 'block';
        }
        c.previousSibling.style.display = 'none';
        // c.id = croppedImg;
        var ctx = c.getContext('2d');
        var imgData = ctx.getImageData(0, 0, c.width, c.height);
        var image = cropperImageInitCanvas;
        image.width = c.width;
        image.height = c.height;
        var ctx = image.getContext('2d');
        ctx.putImageData(imgData, 0, 0);
        cropper = new Cropper(image, {
            aspectRatio: 5 / 6,
            preview: '.img-preview',
            crop: function (event) {
                cropImageButton.style.display = 'block';
            }
        });

    }
    // Initialize Cropper on CLick On Image
    // function cropInitOnClick(selector) {
    //   if(cropperImageInitCanvas.cropper){
    //       cropperImageInitCanvas.cropper.destroy();
    //       // cropImageButton.style.display = 'none';
    //       cropInit(selector);
    //       // addCropButton();
    //       // cropImageButton.style.display = 'block';
    //   } else {
    //       cropInit(selector);
    //       // addCropButton();
    //       // cropImageButton.style.display = 'block';
    //   }
    // }
    // Crop Image
    function image_crop() {
        if (cropperImageInitCanvas.cropper) {
            var cropcanvas = cropperImageInitCanvas.cropper.getCroppedCanvas({ width: 250, height: 250 });
            // document.getElementById('cropImages').appendChild(cropcanvas);
            var ctx = cropcanvas.getContext('2d');
            var imgData = ctx.getImageData(0, 0, cropcanvas.width, cropcanvas.height);
            // var image = document.getElementById(c);
            c.width = cropcanvas.width;
            c.height = cropcanvas.height;
            var ctx = c.getContext('2d');
            ctx.putImageData(imgData, 0, 0);
            cropperImageInitCanvas.cropper.destroy();
            cropperImageInitCanvas.width = 0;
            cropperImageInitCanvas.height = 0;
            cropImageButton.style.display = 'none';
            var allCloseButtons = document.querySelectorAll('.singleImageCanvasCloseBtn');
            for (let element of allCloseButtons) {
                element.style.display = 'block';
            }
            urlConversion();
            // cropperImageInitCanvas.style.display = 'none';
        } else {
            alert('Please select any Image you want to crop');
        }
    }
    cropImageButton.addEventListener("click", function () {
        image_crop();
    });
    // Image Close/Remove
    function removeSingleCanvas(selector) {
        selector.parentNode.remove();
        urlConversion();
    }
    // Dynamically Add Crop Btn
    // function addCropButton() {
       // add crop button
    //    var cropBtn = document.createElement('button');
    //    cropBtn.setAttribute('type', 'button');
    //     cropBtn.id = 'cropImageBtn';
    //     cropBtn.className = 'btn btn-block crop-button';
    //     var cropBtntext = document.createTextNode('crop');
    //     cropBtn.appendChild(cropBtntext);
    //     document.getElementById('cropper').appendChild(cropBtn);
    //     cropBtn.onclick = function() { image_crop(cropBtn.id); };
    // }
    // Get Converted Url
    function urlConversion() {
        var allImageCanvas = document.querySelectorAll('.singleImageCanvas');
        var convertedUrl = '';
        for (let element of allImageCanvas) {
            convertedUrl += element.toDataURL('image/jpeg');
            convertedUrl += 'img_url';
        }

        document.getElementById('profile_img_data').value = convertedUrl;
    }
</script>



<style>
   #galleryImages, #cropper{
  width: 100%;
  float: left;
}
canvas{
  max-width: 100%;
  display: inline-block;
}
#cropperImg{
  /*max-width: 0;
  max-height: 0;*/
}
#cropImageBtn{
  display: none;
}
img{
  width: 100%;
}
.img-preview{
  float: left;
}
.singleImageCanvasContainer{
  max-width: 200px;
  max-height: 200px;
  display: inline-block;
  position: relative;
  margin: 2px;
}
.singleImageCanvasCloseBtn{
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
