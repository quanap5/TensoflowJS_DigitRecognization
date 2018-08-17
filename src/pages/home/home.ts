import { Component , ViewChild , ElementRef, Renderer } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import * as tf from '@tensorflow/tfjs';
import { tensor1d } from '@tensorflow/tfjs';
// import { DrawableDirective } from './drawable.directive';
import { DrawableDirective } from '../../directives/drawable/drawable';
import { ChartComponent } from '../../components/chart/chart';
import { rendererTypeName } from '@angular/compiler';

// declare var tf;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  linearModel : tf.Sequential;
  prediction : any;
  InputTaken : any;
  model : tf.Model;
  ctx: CanvasRenderingContext2D;
  pos = { x: 0, y: 0 };
  canvasElement : any;

  @ViewChild(DrawableDirective) canvas;

  constructor(public navCtrl: NavController , public el : ElementRef , public renderer : Renderer , public platform : Platform) {
  }

  ionViewDidLoad(){
    this.loadModel();
  }


  async loadModel(){
    console.log('Before load model');
    // load trained model from local
    this.model = await tf.loadModel('./assets/model.json');

    // load model from cloud bucket
    //this.model = await tf.loadModel('https://firebasestorage.googleapis.com/v0/b/worldcup-e58fd.appspot.com/o/model.json?alt=media&token=93278154-045e-4809-9c42-05a54ea71a5f');
    console.log('After load model');
  }

  async predict(imageData: ImageData) {

    const pred = await tf.tidy(() => {

      // Convert the canvas pixels to 
      let img = tf.fromPixels(imageData, 1);
      img = img.reshape([1, 28, 28, 1]);
      img = tf.cast(img, 'float32');

      // Make and format the predications
      const output = this.model.predict(img) as any;

      // Save predictions on the component
      this.prediction = Array.from(output.dataSync()); 

      // this.prediction = [1,0,0,0,0.5,0,0,0,0,1];
       console.log('ketqua', this.prediction);
    });

  }

  eraseButton(){
    this.prediction = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01];
    this.canvas.clear();
    console.log('Delete function');
    
  }

}