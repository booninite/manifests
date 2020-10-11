import { addNamespace, sealedSecret } from '@dpu/jkcfg-k8s';
import { Encoding, read } from '@jkcfg/std';

const base = './jkcfg/sealed-secret-data/';

export default async () => {
  return addNamespace('monitoring')(
    sealedSecret('telegram-token', {
      encryptedData: {
        token: await read(`${base}/telegram-token.txt`, {
          encoding: Encoding.String,
        }),
      },
      template: {},
    })
  );
};
