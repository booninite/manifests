// TODO: move this all to nfs namespace
import { K3s } from '@dpu/jkcfg-k8s/labels';
import { NfsServer } from '@dpu/nfs-server';
import { NodeNames } from '../constants';

const bookmanNfs = NfsServer({
  hostPath: '/media',
  name: 'plex-nfs',
  nodeSelector: { [K3s.Hostname]: NodeNames.bookman },
  clusterIP: '10.43.22.22',
  namespace: 'nfs',
  image: 'shimmerjs/nfs-alpine-server:amd',
  servicePort: 2050,
});

// print(bookmanNfs, {});

export default bookmanNfs;
