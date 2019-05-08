var streams = [];
var fadeInterval = 1.5;
var myCanvas;


function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}



function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);

  var x = 0;
  for (var i = 0; i <= width*2 / options.Size; i++) {          
    y = random(-width*1.5,0);
    var stream = new Stream();
    stream.generateSymbols(x,y);
    streams.push(stream);
    x += options.Size;
  }
}



function draw() {
  if(options.Direction == 'freeAngle' ){
    push();
    translate(width/2,height/2);    
    rotate(radians(options.RotateAngle)); 
    push();  
    translate(-width/2,-height/2);    
    drawMatrix();
    pop();
    pop();         
  }
  else{
    drawMatrix();
  }
}


function drawMatrix(){
  var rgb = hexToRgb(options.Background);
 background(rgb.r,rgb.g,rgb.b,options.Opacity);
 if(options.isPNG == true){
  clear();
}

textSize(options.Size);
streams.forEach(function(stream) {
 stream.render();
});
}


function Symbol(x, y, speed, first, opacity) {
  this.x = x;
  this.y = y;
  this.value;

  this.speed = 2;
  this.first = first;
  this.opacity = opacity;

  this.setToRandomSymbol = function() {
    var charType = round(random(1, 5));
    var switchInterval = round(random(50-options.TextSpeed, 50));
    if (frameCount % switchInterval == 0) {
     if(options.Unicode == 'Katakana'){
       this.value = String.fromCharCode(            
        0x30A1 + round(random(0, 96))       
        );
     } else if(options.Unicode == 'BoxDrawing'){
      this.value = String.fromCharCode(
        0x2500 + round(random(0, 96))
        );
    } else if(options.Unicode == 'Braille'){
      this.value = String.fromCharCode(
       0x2803+ round(random(0, 60))
       );
    } else if(options.Unicode == 'CJK Radicals Supplement'){
      this.value = String.fromCharCode(
       0x2E81+ round(random(0, 60))
       );
    }else if(options.Unicode == 'Kanbun'){
      this.value = String.fromCharCode(
       0x3190+ round(random(0, 11))
       );
    }else if(options.Unicode == 'Yi Syllables'){
      this.value = String.fromCharCode(
       0xA000+ round(random(0, 200))
       );
    } else if(options.Unicode  == "Text"){
     var s = options.Text;
     var l = s.length;
     this.value = s.charAt(random(0,l));       
   }
 }
}


this.rain = function() {
  if(options.Direction == '↓'){
   this.y = (this.y >= height) ? this.y = this.y-height : this.y += options.DropSpeed;
 }else if(options.Direction == '↑'){
   this.y = (this.y <= 0) ? this.y = this.y+height: this.y -= options.DropSpeed;
 }else if(options.Direction == 'freeAngle'){ 
   this.y = (this.y >= height*2) ? -height*2 : this.y += options.DropSpeed;
 }else if(options.Direction == '→'){ 
  this.y = (this.y >= width) ? this.y = this.y-width: this.y += options.DropSpeed;
}else if(options.Direction == '←'){ 
  this.y = (this.y <= 0) ? this.y = this.y+width : this.y -= options.DropSpeed;
}
}

}


function Stream() {
  this.symbols = [];
  this.totalSymbols = round(random(5, 45));
  this.speed = random(options.DropSpeed);

  this.generateSymbols = function(x,y) {
    var opacity = 255;
    var first = round(random(0, 4)) == 1;
    for (var i =0; i <= this.totalSymbols; i++) {
      symbol = new Symbol(
        x,
        y,
        this.speed,
        first,
        opacity
        );

      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      opacity -= (255 / this.totalSymbols) / fadeInterval;
      y -= options.Size;
      first = false;
    }
  }



  this.render = function() {
    this.symbols.forEach(function(symbol) {
      var rgb = hexToRgb(options.Color);
      if (symbol.first) {
        fill(rgb.r,rgb.g,rgb.b,symbol.opacity);
      } else {
        fill(rgb.r+50, rgb.g+50, rgb.b+50, symbol.opacity);
      }

      if(options.Direction == '→' || options.Direction == '←'){
       text(symbol.value, symbol.y+options.DropSpeed, symbol.x);
     }else{
      text(symbol.value,symbol.x+options.DropSpeed, symbol.y);
    }
    symbol.rain();
    symbol.setToRandomSymbol();
  });
  }
}