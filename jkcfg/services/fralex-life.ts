import { Container } from '@dpu/jkcfg-k8s/container';
import { Deployment } from '@dpu/jkcfg-k8s/deployment';
import { Ingress } from '@dpu/jkcfg-k8s/ingress';
import { appNameSelector } from '@dpu/jkcfg-k8s/labels';
import { VolumeTypes } from '@dpu/jkcfg-k8s/models';
import { svcPort } from '@dpu/jkcfg-k8s/service';
import { finalize } from '@dpu/jkcfg-k8s/util';
import * as k8s from '@jkcfg/kubernetes/api';
import { merge } from 'lodash-es';
import { constants } from '../constants';

const name = 'fralex-life';
const namespace = 'fralex-life';
const selector = appNameSelector(name);
const port = 5000;

const config = new k8s.core.v1.ConfigMap(name, {
  data: {
    ['serve.json']: `
      {
        "directoryListing": false
      }
    `,
  },
});

const service = new k8s.core.v1.Service(name, {
  spec: {
    ports: [svcPort(port)],
    selector,
  },
});

const backend = {
  paths: {
    backend: {
      serviceName: name,
      servicePort: port,
    },
  },
};

const ingress = Ingress(name, {
  annotations: constants.letsencrypt.issuers.prod.annotations,
  hosts: {
    [constants.hostname.fralex]: backend,
  },
  tls: {
    [constants.hostname.fralex]: 'fralex-life',
  },
});

const { deployment, addContainer, addVolume } = Deployment(name, {
  labels: selector,
});
addVolume(name, VolumeTypes.configMap);
addContainer(
  merge(
    Container({
      name,
      port,
      image:
        'shimmerjs/fralex.life:bigday-21ff6d4d445d37c80a5e96fd2d260eda4367b3f0',
      command: ['serve'],
      args: ['site'],
    }),
    {
      volumeMounts: [
        {
          name,
          mountPath: '/site/serve.json',
          subPath: 'serve.json',
        },
      ],
    }
  )
);

export default finalize([config, service, deployment, ingress], {
  labels: selector,
  namespace,
});
