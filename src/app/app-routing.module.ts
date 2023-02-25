import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { IsNotLoginGuard } from "./guards/is-not-login.guard";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: 'user-sign/:type',
    loadChildren: () =>
      import("./pages/user-sign/user-sign.module").then(
        (m) => m.UserSignPageModule
      ),
  },
  {
    path: "categories",
    loadChildren: "./pages/categories/categories.module#CategoriesPageModule",
  },
  {
    path: "registry",
    loadChildren: "./pages/registry/registry.module#RegistryPageModule",
  },
  {
    path: "list/:occupationId",
    loadChildren: "./pages/list/list.module#ListPageModule",
  },
  {
    path: "profile/:occupationId/:workerId",
    loadChildren: "./pages/profile/profile.module#ProfilePageModule",
  },
  {
    path: "new-order",
    loadChildren: "./pages/new-order/new-order.module#NewOrderPageModule",
  },
  {
    path: "results",
    loadChildren: "./pages/results/results.module#ResultsPageModule",
  },
  {
    path: "subcategories/:categoryId",
    loadChildren:
      "./pages/subcategories/subcategories.module#SubcategoriesPageModule",
  },
  { path: "map", loadChildren: "./pages/map/map.module#MapPageModule" },
  {
    path: "login",
    loadChildren: "./pages/login/login.module#LoginPageModule",
  },
  {
    path: "login/:order/:tempId/:workersNumber/:amount",
    loadChildren: "./pages/login/login.module#LoginPageModule",
  },
  {
    path: "login/:nextStep",
    loadChildren: "./pages/login/login.module#LoginPageModule",
  },
  {
    path: "order-history/:clientId",
    canActivate: [AuthGuard],
    loadChildren:
      "./pages/order-history/order-history.module#OrderHistoryPageModule",
  },
  {
    path: "order-details",
    loadChildren:
      "./pages/order-history/order-details/order-details.module#OrderDetailsPageModule",
  },
  {
    path: "register-user/:order/:tempId",
    loadChildren:
      "./pages/register-user/register-user.module#RegisterUserPageModule",
  },
  {
    path: "payments",
    loadChildren: "./pages/orders/payments/payments.module#PaymentsPageModule",
  },
  {
    path: "selection",
    canActivate: [AuthGuard],
    loadChildren: "./pages/orders/selection/selection.module#SelectionPageModule",
  },
  {
    path: "summary-review",
    canActivate: [AuthGuard],
    loadChildren:
      "./pages/orders/summary-review/summary-review.module#SummaryReviewPageModule",
  },
  {
    path: 'register-user2/:type',
    loadChildren:
      "./pages/register-user2/register-user2.module#RegisterUser2PageModule"
  },
  { path: 'address-selector/:code', 
    loadChildren: 
      './pages/address-selector/address-selector.module#AddressSelectorPageModule' },
  {
    path: "list-workers-map",
    canActivate: [AuthGuard],
    loadChildren:
      () => import('./pages/orders/list-workers-map/list-workers-map.module').then(m => m.ListWorkersMapPageModule)
    // path: "list-workers-map",
    // canActivate: [AuthGuard],
    // loadChildren: () =>
    //   import("./pages/list-workers-map/list-workers-map.module").then(
    //     (m) => m.ListWorkersMapPageModule
    //   ),
  },
  { path: 'forgot-mail', loadChildren: './pages/forgot-mail/forgot-mail.module#ForgotMailPageModule' },
  { path: 'welcome', loadChildren: './pages/welcome/welcome.module#WelcomePageModule' },
  { 
    path: 'home', 
    canActivate: [AuthGuard],
    loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'order-detail', loadChildren: './pages/order-detail/order-detail.module#OrderDetailPageModule' },
  // { path: 'user-sign/:type', loadChildren: './pages/users-sign/users-sign.module#UsersSignPageModule' },
  // { path: 'user-information', loadChildren: './pages/user-information/user-information.module#UserInformationPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
