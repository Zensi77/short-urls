export default [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-panel.component').then(
        (m) => m.AdminPanelComponent
      ),
  },
  // {
  //   path: 'users',
  // },
  // {
  //   path: 'users/:id',
  // },
  // {
  //   path: 'subscriptions',
  // },
  // {
  //   path: 'subscriptions/:id',
  // },
  // {
  //   path: 'stadistics',
  // },
];
