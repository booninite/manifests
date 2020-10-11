import { Syncthing } from '@dpu/syncthing';
import { hostname, letsencrypt } from '../constants';

export default Syncthing({
  ingress: {
    enabled: true,
    annotations: letsencrypt.issuers.prod.annotations,
    tls: 'syncthing-ingress',
    host: 'syncthing.' + hostname.external,
  },
});
