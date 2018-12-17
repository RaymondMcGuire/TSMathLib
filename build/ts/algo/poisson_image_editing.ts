/// <reference path="../lib/conjugate_grad.ts" />
/// <reference path="../lib/vector.ts" />
/// <reference path="../lib/matrix.ts" />
/// <reference path="../ds/hashset.ts" />
/// <reference path="../cv/s_imload.ts" />
/// <reference path="../cv/matHW3.ts" />

var cvs_target = <HTMLCanvasElement>document.getElementById("cvs_target");
var cvs_mask = <HTMLCanvasElement>document.getElementById("cvs_mask");
var cvs_source = <HTMLCanvasElement>document.getElementById("cvs_source");
var cvs_synthesis = <HTMLCanvasElement>document.getElementById("cvs_synthesis");

var paths = new EDsLib.HashSet<string>();
paths.set("mona_target","./images/mona-target.jpg");
paths.set("mona_mask","./images/mona-mask.jpg");
paths.set("leber_source","./images/leber-source.jpg");


function clip(v:number,min:number,max:number){
    if(v<min)v=min;
    if(v>max)v=max;
    return v;
}

var ImagesLoadSys = new ECvLib.SimpleImageLoadSystem(paths,(images:EDsLib.HashSet<any>)=>{
    var mona_target = images.get("mona_target");
    var mona_mask = images.get("mona_mask");
    var leber_source = images.get("leber_source");


    cvs_target.height = mona_target.height;
    cvs_target.width = mona_target.width;

    var height = cvs_target.height;
    var width = cvs_target.width;

    cvs_mask.height = mona_mask.height;
    cvs_mask.width = mona_mask.width;

    cvs_source.height = leber_source.height;
    cvs_source.width = leber_source.width;


    var context_target =  cvs_target.getContext('2d');
    context_target.drawImage(mona_target, 0, 0);
    var imageData_target = context_target.getImageData(0,0,cvs_target.width,cvs_target.height);
    var mona_target_image = new ECvLib.MatHxWx3(imageData_target,cvs_target.height,cvs_target.width);

    var context_mask =  cvs_mask.getContext('2d');
    context_mask.drawImage(mona_mask, 0, 0);
    var imageData_mask = context_mask.getImageData(0,0,cvs_mask.width,cvs_mask.height);
    var mona_mask_image = new ECvLib.MatHxWx3(imageData_mask,cvs_mask.height,cvs_mask.width);

    var context_source =  cvs_source.getContext('2d');
    context_source.drawImage(leber_source, 0, 0);
    var imageData_source = context_source.getImageData(0,0,cvs_source.width,cvs_source.height);
    var leber_source_image = new ECvLib.MatHxWx3(imageData_source,cvs_source.height,cvs_source.width);

    var maskidx2Corrd = new Array<[number,number]>();
    //record order
    var Coord2indx = new EMathLib.Matrix(height,width);
    Coord2indx.setValues(-1);
    // left, right, top, botton pix in mask or not
    var if_strict_interior = new Array<[boolean,boolean,boolean,boolean]>();

    var idx = 0;
    mona_mask_image.forEachIndex((j,i)=>{
        if(mona_mask_image.getDataByIndexs(j,i)[0] == 255){
            maskidx2Corrd.push([j, i]);
            if_strict_interior.push([
                j > 0 && mona_mask_image.getDataByIndexs(j-1,i)[0] == 255,
                j < height - 1 && mona_mask_image.getDataByIndexs(j+1,i)[0] == 255,
                i > 0 && mona_mask_image.getDataByIndexs(j,i-1)[0] == 255,
                i < width - 1 && mona_mask_image.getDataByIndexs(j,i+1)[0] == 255
            ]);
            Coord2indx.setDataByIndexs(j,i,idx);
            idx+=1;
        }
    });

    console.log("converted image coordniates to index...");

    var N = idx;
    var b = new EMathLib.Matrix(N,3);
    var A = new EMathLib.Matrix(N,N);

    for(var i=0;i<N;i++){
        A.setDataByIndexs(i,i,4);
        var r = maskidx2Corrd[i][0];
        var c = maskidx2Corrd[i][1];

        if(if_strict_interior[i][0])A.setDataByIndexs(i,Coord2indx.getDataByIndexs(r-1, c),-1);
        if(if_strict_interior[i][1])A.setDataByIndexs(i,Coord2indx.getDataByIndexs(r+1, c),-1);
        if(if_strict_interior[i][2])A.setDataByIndexs(i,Coord2indx.getDataByIndexs(r, c-1),-1);
        if(if_strict_interior[i][3])A.setDataByIndexs(i,Coord2indx.getDataByIndexs(r, c+1),-1);
    }
    
    for(var i=0;i<N;i++){
        var flag = if_strict_interior[i].map(b=>!b).map(b=>b?1:0);

        var r = maskidx2Corrd[i][0];
        var c = maskidx2Corrd[i][1];

        for(var _c=0;_c<3;_c++){
            var sVal = 4 * leber_source_image.getDataByIndexs(r,c)[_c] - leber_source_image.getDataByIndexs(r-1,c)[_c]- leber_source_image.getDataByIndexs(r+1,c)[_c]- leber_source_image.getDataByIndexs(r,c-1)[_c]- leber_source_image.getDataByIndexs(r,c+1)[_c];
            b.setDataByIndexs(i,_c,sVal);

            var tVal = b.getDataByIndexs(i,_c) + flag[0] * mona_target_image.getDataByIndexs(r-1,c)[_c] + flag[1] * mona_target_image.getDataByIndexs(r+1,c)[_c] + flag[2] * mona_target_image.getDataByIndexs(r,c-1)[_c] + flag[3] * mona_target_image.getDataByIndexs(r,c+1)[_c];
            b.setDataByIndexs(i,_c,tVal);
        }
    }

    console.log("initialized A matrix and b array...");

    var color_array = new Array<EMathLib.Vector>();
    b.forEachCol((col)=>{
        color_array.push(new EMathLib.Vector(col.length,col));
    })
    let R = EMathLib.conjugate_grad(A,color_array[0]);
    let G = EMathLib.conjugate_grad(A,color_array[1]);
    let B = EMathLib.conjugate_grad(A,color_array[2]);

    var synthesis_image = mona_target_image;
    for(var i=0;i<N;i++){
        var r = maskidx2Corrd[i][0];
        var c = maskidx2Corrd[i][1];

        var color = [clip(R.data()[i],0,255),clip(G.data()[i],0,255),clip(B.data()[i],0,255)]
        synthesis_image.setDataByIndexs(r,c,color);
    }

    
    cvs_synthesis.height = height;
    cvs_synthesis.width = width;
    var context_synthesis =  cvs_synthesis.getContext('2d');
    context_synthesis.clearRect(0, 0, width, height);

    let imgData = context_synthesis.getImageData(0,0,width,height);
    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var index = (j * width + i) * 4;
            var Val_r = synthesis_image.R().getDataByIndexs(j,i);
            var Val_g = synthesis_image.G().getDataByIndexs(j,i);
            var Val_b = synthesis_image.B().getDataByIndexs(j,i);
        
            imgData.data[index + 0] = Val_r;
            imgData.data[index + 1] = Val_g;
            imgData.data[index + 2] = Val_b;
            imgData.data[index + 3] = 255;
        }
    }
    context_synthesis.putImageData(imgData, 0, 0);

    console.log("poisson image editing finished...");
});






