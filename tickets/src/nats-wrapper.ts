import nats, {Stan} from 'node-nats-streaming';

class NatsWrapper {
  //question mark tells ts that _client variable may be undefined for a while
  private _client?: Stan;

  //using this get function we can access _client variable which is private as client outside the class
  get client(){
    if(!this._client){
      throw new Error('Cannot access NATS client before connection is established.');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string){
    this._client=nats.connect(clusterId,clientId,{url});
    return new Promise<void>((resolve,reject)=>{
      this.client!.on('connect',()=>{
        console.log('Connected to NATS');
        resolve();
      });
      this.client!.on('error',(err)=>{
        reject(err);
      });
    })
  }

}

export const natsWrapper= new NatsWrapper();