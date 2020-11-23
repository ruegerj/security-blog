import app from './app';
import { NodeConfigResolver } from './infrastructure/config';

const configResolver = new NodeConfigResolver();
const config = configResolver.resolve(process.env);

console.log(config);
