/**
 * This module defines what will be gnerated by `jkcfg`
 */
import homestar from './cluster';
// import patches from 'shimmerjs/k8s/patches';

export default async function () {
  const cluster = await homestar();
  return [...cluster];
}
