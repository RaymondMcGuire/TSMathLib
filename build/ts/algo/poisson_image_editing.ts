/// <reference path="../lib/conjugate_grad.ts" />



var image = new Image();
image.src = "./images/mona-target.jpg";

image.onload = function(){
    var cvs = <HTMLCanvasElement>document.getElementById("cvs");
    cvs.height = image.height;
    cvs.width = image.width;
    var context =  cvs.getContext('2d');
    context.drawImage(image, 0, 0);

    var imageData = context.getImageData(0,0,cvs.width,cvs.height);
    //console.log(imageData);
    var imageDataBuffer = new Array(cvs.height);
    for (var j = 0; j < cvs.height; j++) {
        imageDataBuffer[j]=new Array(cvs.width);
        for (var i = 0; i < cvs.width; i++) {
            var index = (j * cvs.width + i) * 4;
            imageDataBuffer[j][i] = new Array(4);
            imageDataBuffer[j][i][0] =imageData.data[index + 0];
            imageDataBuffer[j][i][1] =imageData.data[index + 1];
            imageDataBuffer[j][i][2] =imageData.data[index + 2];
            imageDataBuffer[j][i][3] =imageData.data[index + 3];
        }
    }
    //console.log(imageDataBuffer);
}
