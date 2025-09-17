import { PluginObj } from '@babel/core';
import * as t from '@babel/types';

interface BabelAPI {
  types: typeof t;
}

declare function babelPluginFunctionFrames(babel: BabelAPI): PluginObj;

export = babelPluginFunctionFrames;