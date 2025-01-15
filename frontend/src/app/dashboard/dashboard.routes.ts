import { LinkResolver } from './resolvers/liks.resolver';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    resolve: {
      // Se ejecuta antes de cargar el componente
      links: LinkResolver,
    },
  },
];
