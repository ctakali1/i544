import { ok, err } from 'cs544-js-utils';

/** parse byte streams in imageBytes: { images: Uint8Array, labels:
 *  Uint8Array } as per imageSpecs { images: HeaderSpec[], labels:
 *  HeaderSpec[] } to return a list of LabeledFeatures (wrapped within
 *  a Result).
 *
 *  Errors:
 *    BAD_VAL: value in byte stream does not match value specified
 *             in spec.
 *    BAD_FMT: size of bytes stream inconsistent with headers
 *             or # of images not equal to # of labels.
 */

function handleHeaders(specs,bytes){
  var header={};

  for(var i=0;i<specs.images.length;i++){
    var keyName=specs['images'][i]['name'];
    var keyValue=specs['images'][i]['value'];
    header[keyName]=keyValue;
  }

  for(var i=0;i<bytes.images.byteLength;i++){
    if(i<16){
      var ImagearrayBuffer = bytes.images.buffer.slice(i,i+4);                //Slicing an array in a group of 4
      var Imagebit32int=(new DataView(ImagearrayBuffer)).getInt32();
      if(Object.values(header)[i/4]!=undefined && Imagebit32int != Object.values(header)[i/4]){
        return err('BAD_VAL');                                                //return err
      }
      i+=3;
    }
  }
  var RestImagearrayBuffer = new Array(bytes.images.buffer.slice(16,bytes.images.byteLength+1))    //managing Rest Array

  // console.log(header);
  // console.log(RestImagearrayBuffer);
  return ok(header,RestImagearrayBuffer);           //return ok
}

export default function parseImages(imageSpecs, imageBytes) {
  return handleHeaders(imageSpecs,imageBytes);     //handling headers
}

