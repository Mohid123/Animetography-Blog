import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BlogComponent } from './blog.component';
import { BlogRoutingModule } from './blog-routing.module';
import { ViewBlogComponent } from './pages/view-blog/view-blog.component';
import { HeaderComponent } from './components/header/header.component';
import {TuiSidebarModule} from '@taiga-ui/addon-mobile';
import {TuiActiveZoneModule} from '@taiga-ui/cdk';



@NgModule({
  declarations: [
    BlogComponent,
    ViewBlogComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    NgOptimizedImage,
    TuiSidebarModule,
    TuiActiveZoneModule
  ]
})
export class BlogModule { }
