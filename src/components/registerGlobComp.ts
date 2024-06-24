import type { App } from 'vue';
import { Button } from './Button';
import { Input, Layout } from 'ant-design-vue';
import VXETable from 'vxe-table';

export function registerGlobComp(app: App) {
  // .use(Button)
  // .use(Input)
  app.use(Layout).use(VXETable);
}
