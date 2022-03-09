import { Monerod } from '@dpu/monero-node';
import { hostname, letsencrypt } from '../constants';

const moneroHost = 'monerod.' + hostname.external;
export default Monerod({
  ingress: {
    enabled: true,
    annotations: letsencrypt.issuers.prod.annotations,
    tls: 'monero-ingress',
    host: moneroHost,
  },
  image: 'shimmerjs/monero:latest',
});
