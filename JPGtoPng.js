const Jimp= require("jimp");
const fs =  require("fs");
const directoryPath = "./img"
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        if(/.jpg/.test(file))
        {   
            console.log(file)
            //We will first read the JPG image using read() method. 
Jimp.read(directoryPath+"/"+file, function (err, image) {
    //If there is an error in reading the image, 
    //we will print the error in our terminal
    if (err) {
      console.log(err)
    } 
    
    //Otherwise we convert the image into PNG format 
    //and save it inside images folder using write() method.
    else {
      image.write(directoryPath+"/"+file.replace(/.jpg/,".png"))
      fs.unlink(directoryPath+"/"+file,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
   });  
    }
  })
        }
        if(/removebg/.test(file)){
            console.log(file)
            fs.rename(directoryPath+"/"+file, directoryPath+"/"+file.replace("-removebg-preview",""), function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
        }
        if(/leggins/.test(file)){
            console.log(file)
            fs.rename(directoryPath+"/"+file, directoryPath+"/"+file.replace("leggins","leggings"), function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
        }
        
    });
 });
