import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { ViewBlogComponent } from './pages/view-blog/view-blog.component';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      {
        path: '',
        redirectTo: 'view-posts',
        pathMatch: 'full',
      },
      {
        path: 'view-posts',
        component: ViewBlogComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
