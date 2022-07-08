import { MongoClient } from 'mongodb';

import { ok, err } from 'cs544-js-utils';

import { b64ToUint8Array, uint8ArrayToB64 } from './uint8array-b64.mjs';

function getUniqueId(){
  return Date.now().toString();
}

export default async function makeFeaturesDao(dbUrl) {
  return AuthDao.make(dbUrl);
  // return err('unimplemented makeFeaturesDao()', { code: 'UNIMP' });
}


class AuthDao {
  constructor(params) {  Object.assign(this, params); }

  static async make(dbUrl) {
    const params = {};
    try {
      params._client = await (new MongoClient(dbUrl)).connect();
      await params._client.connect();
      const db = params._client.db();
      const users = db.collection(USERS_COLLECTION);
      params.users = users;
      // params.count = await users.countDocuments();
      return ok(new AuthDao(params));
    }
    catch (error) {
      return err(error.message, { code: 'DB' });
    }
  }

  async add(features,isB64,label){
    // console.log("add ",features.length);
    try {
      if(!isB64){
        features=uint8ArrayToB64(features);      
      }
      const _id=getUniqueId();
      const insertObj={ "_id": _id ,"features": features,"label":label};
      await this.users.insertOne(insertObj);
      // console.log(val)
      return ok(_id,{hasErrors:false});
    } catch (error) {
        return err(error.message, { code: 'NOT_FOUND' }); 
    }
  }

  async get(id,isB64){
    try {
      const returnedId=await this.users.findOne({_id:id});
      if(returnedId.length =0){
        return err(error.message, {code: 'DB' }); 
      }
      if(isB64){
        return ok({"features":returnedId['features'],"label":returnedId['label']},{hasErrors:false});
      } else {
        return ok({"features":b64ToUint8Array(returnedId.features),"label":returnedId['label']},{hasErrors:false});
      }
    } catch (error) {
        return err(error.message, { hasErrors:true,code: 'NOT_FOUND' }); 
    }
  }

  async getAllTrainingFeatures(){
    try {
      const val=await this.users.find();
      // console.log("train ",val.length);
      if(isB64){
        if(val.label !== '' ){
          return ok({"features":b64ToUint8Array(val.features),"label":val.label},{hasErrors:false});
        }
      }else{
        if(val.label !== '' ){
          return ok({"features":val.features,"label":val.label},{hasErrors:false});
        }
      }
    } catch (error) {
        return err(error.message, { code: 'DB' }); 
    }
  }
  
  async clear() {
    try {
      const val = await this.users.deleteMany({});
      return ok(val,{hasErrors:false});
    }
    catch (e) {
      return err(e.message, { hasErrors:true,code: 'DB' });
    }
  }

  async close() {
    try {
      await this._client.close();
    }
    catch (e) {
      err(e.message, { hasErrors:true,code: 'DB' });
    }
  }

} //class AuthDao

const USERS_COLLECTION = 'users';

