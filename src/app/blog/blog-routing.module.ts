import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { AddBlogComponent } from './pages/add-blog/add-blog.component';
import { ReadBlogComponent } from './pages/read-blog/read-blog.component';
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
      {
        path: 'add-posts',
        component: AddBlogComponent,
      },
      {
        path: 'edit-post/:id',
        component: AddBlogComponent,
      },
      {
        path: 'read-post/:id',
        component: ReadBlogComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
