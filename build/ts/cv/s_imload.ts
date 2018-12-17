/// <reference path="../ds/hashset.ts" />
module ECvLib{

    export class SimpleImageLoadSystem{

        private images:EDsLib.HashSet<any>;
        private numImages:number;
        private loadedImages:number;

        constructor(paths:EDsLib.HashSet<string>,callback:any){
            let images = new EDsLib.HashSet<any>();
            this.loadedImages = 0;
            this.numImages = paths.len();

            paths.forEach((k,v)=>{
                images.set(k,new Image());
                images.get(k).onload = ()=> {
                  if(++this.loadedImages >= this.numImages) {
                    console.log("images loaded!");
                    callback(images);
                  }
                };
                images.get(k).src = v;
            });

            this.images = images;
        }
    }
}