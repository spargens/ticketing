
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL);

    //we cannot have this graceful shutdown code written inside natsWrapper.connect 
    //because if the natsWrapper code is in common lib and is being used by diff microservices
    //one microservice getting down will close all nats connection

    natsWrapper.client.on('close',()=>{
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT',()=>natsWrapper.client.close());
    process.on('SIGTERM',()=>natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();

  } catch (err) {
    console.error(err);
  }


};

start();
