import { ok, err } from 'cs544-js-utils';

/** return pair [label, index] (wrapped within a Result) of the
 *  training LabeledFeatures trainLabeledFeatures having the most
 *  common label of the k training features closest to subject
 *  testFeatures.
 *
 *  Errors:
 *    BAD_FMT: trainLabeledFeatures has features bytes with length 
 *             different from length of subject testFeatures.
 */

function comparingFeatures(test,train) {
  for(var i=0;i<test.length;i++){
    if(!(test[i]===train[i]['features'].length)){
      console.log(test[i]+' '+train[i]['features'].length);
      return err('not compatible length',{code:'BAD_FMT'})
    }
  }
}

export default function  knn(testFeatures, trainLabeledFeatures, k=3) {
  comparingFeatures(testFeatures,trainLabeledFeatures);
  // return err('knn() not implemented', { code: 'NO_IMPL' });
}
