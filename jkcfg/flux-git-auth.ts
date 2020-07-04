import { sealedSecret } from '@dpu/jkcfg-k8s';
import { Encoding, read } from '@jkcfg/std';

const base = './jkcfg/sealed-secret-data/';

export default async () => {
  return sealedSecret('flux-git-auth', {
    encryptedData: {
      GIT_AUTHUSER: await read(`${base}/github-flux-user.txt`, {
        encoding: Encoding.String,
      }),
      GIT_AUTHKEY: await read(`${base}/github-flux-token.txt`, {
        encoding: Encoding.String,
      }),
    },
    template: {},
  });
};
