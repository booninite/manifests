// TODO: move this all to nfs namespace
import { K3s } from '@dpu/jkcfg-k8s/labels';
import { NfsServer } from '@dpu/nfs-server';
import { NodeNames } from '../constants';

const ripleyNfs = NfsServer({
  image: 'shimmerjs/nfs-alpine-server:arm',
  hostPath: '/media',
  nodeSelector: { [K3s.Hostname]: NodeNames.ripley },
});

// print(ripleyNfs, {});

export default ripleyNfs;
