import { hostname, letsencrypt } from '../constants';
import NextCloud from '../internal/nextcloud';

export default NextCloud({
  ingress: {
    enabled: true,
    annotations: letsencrypt.issuers.prod.annotations,
    tls: 'nextcloud-ingress',
  },
  host: 'nextcloud.' + hostname.external,
  persistence: {
    enabled: true,
    size: '500Gi',
  },
});
