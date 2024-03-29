import { ok, err } from 'cs544-js-utils';

export default function makeKnnWsClient(wsUrl) {
  return new KnnWsClient(wsUrl);
}

class KnnWsClient {
  constructor(wsUrl) {
    this.wsUrl=wsUrl;
  }

  /** Given a base64 encoding b64Img of an MNIST compatible test
   *  image, use web services to return a Result containing at least
   *  the following properties:
   *
   *   `label`: the classification of the image.
   *   `id`: the ID of the training image "closest" to the test
   *         image.
   * 
   *  If an error is encountered then return an appropriate
   *  error Result.
   */
  async classify(b64Img) {
    if(b64Img==='') return;
    try {
      const result=await
      (await fetch(this.wsUrl+'/knn/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(b64Img)
      })).json();
      return result; 
    } catch (error) {
      let resp=error.message;
      throw resp;
    }
  }

  /** Return a Result containing the base-64 representation of
   *  the image specified by imageId.  Specifically, the success
   *  return should be an object containing at least the following
   *  properties:
   *
   *   `features`:
   *     A base-64 representation of the retrieved image bytes.
   *   `label`:
   *     The label associated with the image (if any).
   *
   *  If an error is encountered then return an appropriate
   *  error Result.
   */
  async getImage(imageId) {
    try {
      const res=await(await fetch(this.wsUrl+`/knn/labels/${imageId}`)).json();
      return res; 
    } catch (error) {
      let resp=JSON.parse(error);
      throw resp;
    }
  }

  /** convert an erroneous JSON web service response to an error Result. */
  wsError(jsonRes) {
    return err(jsonRes.errors[0].message, jsonRes.errors[0].options);
  }

}

