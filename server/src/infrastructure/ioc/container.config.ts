import 'reflect-metadata';
import { Container } from 'inversify';
import { ControllerBase } from '../../controllers';
import { NodeConfigResolver } from '../config';
import { IConfig } from '../config/interfaces';
import { TypeMap } from './typeMap';
import { App } from '../../app';

const container = new Container();

// Register config
const configResolver = new NodeConfigResolver();
const config = configResolver.resolve(process.env);

container.bind<IConfig>(TypeMap.IConfig).toConstantValue(config);

// Register controllers

// Register app
container.bind<App>(TypeMap.App).to(App);

export { container };
