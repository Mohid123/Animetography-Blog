import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BlogComponent } from './blog.component';
import { BlogRoutingModule } from './blog-routing.module';
import { ViewBlogComponent } from './pages/view-blog/view-blog.component';
import { HeaderComponent } from './components/header/header.component';
import {TuiSidebarModule} from '@taiga-ui/addon-mobile';
import {TuiActiveZoneModule, TuiLetModule} from '@taiga-ui/cdk';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { TuiInputModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiDropdownModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { DateFilterComponent } from './components/date-filter/date-filter.component';
import { TuiButtonModule, TuiCalendarModule, TuiDataListModule } from '@taiga-ui/core/components';
import { SortComponent } from './components/sort/sort.component';
import { TopPostComponent } from './components/top-post/top-post.component';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { BlogPostComponent } from './components/blog-post/blog-post.component';



@NgModule({
  declarations: [
    BlogComponent,
    ViewBlogComponent,
    HeaderComponent,
    SearchbarComponent,
    DateFilterComponent,
    SortComponent,
    TopPostComponent,
    BlogPostComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    NgOptimizedImage,
    TuiSidebarModule,
    TuiActiveZoneModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    TuiDropdownModule,
    TuiCalendarModule,
    TuiDataListModule,
    TuiLetModule,
    TuiAvatarModule
  ]
})
export class BlogModule { }
