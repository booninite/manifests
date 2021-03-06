import { Name, Namespace, Persistence } from '@dpu/jkcfg-k8s/parameters';
import { HelmChart } from '@dpu/jkcfg-k8s/rancher-helm';
import * as k8s from '@jkcfg/kubernetes/api';
import { Boolean, String } from '@jkcfg/std/param';
import { merge } from 'lodash-es';

export const params = {
  name: Name('nextcloud'),
  namespace: Namespace('nextcloud'),
  // TODO: allow partially overriding (e.g., only provide version)
  chartRef: String(
    'chartRef',
    'https://kubernetes-charts.storage.googleapis.com/nextcloud-1.9.1.tgz'
  ),
  ingress: {
    enabled: Boolean('ingress.enabled', false),
    annotations: Object('ingress.annotations'),
    tls: Object('ingress.tls'),
  },
  host: String('host'),
  persistence: {
    enabled: Boolean('persistence.enabled', true),
    ...Persistence('500Gi'),
  },
};

const nextcloud = (p) => {
  const { name, namespace, chartRef, ingress, persistence, host } = merge(
    params,
    p
  );
  if (!host) throw new Error('Must define host for nextcloud server');

  const values = {
    nextcloud: { host },
    ingress: ingress.enabled
      ? {
          enabled: 'true',
          annotations: ingress.annotations ? ingress.annotations : {},
          tls: ingress.tls ? ingress.tls : [],
        }
      : {},
    persistence: persistence.enabled
      ? {
          ...persistence,
          // ensure all final values are string cuz this software sucks
          enabled: 'true',
        }
      : {},
  };

  // TODO: properly extend KubernetesObject to make more flexible
  const resources: any[] = [
    HelmChart(name, { chart: chartRef, valuesContent: values }, namespace),
  ];

  if (namespace !== 'default') {
    resources.push(new k8s.core.v1.Namespace(namespace));
  }

  return resources;
};

export default nextcloud;
