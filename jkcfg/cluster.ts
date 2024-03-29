import { ProductionAcme, StagingAcme } from '@dpu/jkcfg-k8s/cluster-issuer';
import * as k8s from '@jkcfg/kubernetes/api';
import { valuesForGenerate } from '@jkcfg/kubernetes/generate';
import { constants } from './constants';
import fluxGitAuth from './flux-git-auth';
import blog from './services/blog';
import fralexLife from './services/fralex-life';
import monero from './services/monerod';
import nextcloud from './services/nextcloud';
import plexNfs from './services/plex-nfs';
import ripNfs from './services/ripley-nfs';
import spotifyd from './services/spotifyd';
import syncthing from './services/syncthing';
import tautulli from './services/tautulli';

const cluster = async () => {
  const { letsencrypt } = constants;
  const { issuers, email } = letsencrypt;
  const certManagerNs = new k8s.core.v1.Namespace('cert-manager');

  const resources = [
    ...plexNfs,
    ...ripNfs,
    ...tautulli,
    ...nextcloud,
    ...monero,
    certManagerNs,
    ...syncthing,
    ...(await spotifyd()),
    await fluxGitAuth(),
    ...blog,
    ...fralexLife,
    StagingAcme(issuers.staging.name, 'staging-issuer-account-key', email),
    ProductionAcme(issuers.prod.name, 'prod-issuer-account-key', email),
  ];

  // handle this by exporting a function as default
  const manifests = valuesForGenerate(resources);

  return manifests;
};

export default cluster;
