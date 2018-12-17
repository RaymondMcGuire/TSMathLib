/// <reference path="../lib/matrix.ts" />
/// <reference path="../lib/interface.ts" />
module ECvLib{

    export class MatHxWx3 {
        private  readonly _CHANNEL:number = 3;
        private _H: number;
        private _W: number;
        private _DATA: Array<EMathLib.Matrix>;

        constructor(imData:any, height:number, width:number){
            this._H = height;
            this._W = width;

            let r = new EMathLib.Matrix(height,width);
            let g = new EMathLib.Matrix(height,width);
            let b = new EMathLib.Matrix(height,width);

            for(var _h=0;_h<height;_h++){
                for(var _w=0;_w<width;_w++){
                    var index = (_h * width + _w) * 4;
                    r.setDataByIndexs(_h,_w,imData.data[index + 0]);
                    g.setDataByIndexs(_h,_w,imData.data[index + 1]);
                    b.setDataByIndexs(_h,_w,imData.data[index + 2]);
                }
            }

            this._DATA = new Array<EMathLib.Matrix>(this._CHANNEL);
            this._DATA[0] = r;
            this._DATA[1] = g;
            this._DATA[2] = b;

        }

        forEachIndex(indexs: EMathLib.MatrixIndex) {
            for (var _j = 0; _j < this._H; _j++) {
                for (var _i = 0; _i < this._W; _i++) {
                    indexs(_j, _i);
                }
            }
        }

        getDataByIndexs(j:number,i:number){
            let r = this.R().getDataByIndexs(j,i);
            let g = this.G().getDataByIndexs(j,i);
            let b = this.B().getDataByIndexs(j,i);
            return [r,g,b];
        }

        setDataByIndexs(j:number,i:number,v:Array<number>){
            this.R().setDataByIndexs(j,i,v[0]);
            this.G().setDataByIndexs(j,i,v[1]);
            this.B().setDataByIndexs(j,i,v[2]);
        }

        shape(){
            return [this._H,this._W,this._CHANNEL];
        }

        R(){
            return this._DATA[0];
        }

        G(){
            return this._DATA[1];
        }

        B(){
            return this._DATA[2];
        }
    }

    export class ImLoad{

        image:any;

        constructor(path:string){
            this.image = new Image();
            this.image.src = path;
        }

    }
}