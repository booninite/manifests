import { Tautulli } from '@dpu/tautulli';
import { hostname, letsencrypt } from '../constants';

export default Tautulli({
  namespace: 'default',
  ingress: {
    enabled: true,
    annotations: letsencrypt.issuers.prod.annotations,
    tls: 'tautulli-ingress',
    host: 'tautulli.' + hostname.external,
  },
});
