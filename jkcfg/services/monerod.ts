import Monero from '@dpu/monero-node';
import { hostname, letsencrypt } from '../constants';

const moneroHost = 'monerod.' + hostname.external;
export default Monero({
  ingress: {
    enabled: true,
    annotations: letsencrypt.issuers.prod.annotations,
    tls: 'monero-ingress',
    host: moneroHost,
  },
  image: 'xmrto/monero:v0.17.0.1',
}).resources;
