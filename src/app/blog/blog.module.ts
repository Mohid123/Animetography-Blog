import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog.component';
import { BlogRoutingModule } from './blog-routing.module';
import { ViewBlogComponent } from './pages/view-blog/view-blog.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';



@NgModule({
  declarations: [
    BlogComponent,
    ViewBlogComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
