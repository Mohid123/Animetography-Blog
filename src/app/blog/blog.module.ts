import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BlogComponent } from './blog.component';
import { BlogRoutingModule } from './blog-routing.module';
import { ViewBlogComponent } from './pages/view-blog/view-blog.component';
import { HeaderComponent } from './components/header/header.component';
import {TuiSidebarModule} from '@taiga-ui/addon-mobile';
import {TuiActiveZoneModule, TuiLetModule} from '@taiga-ui/cdk';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { TuiInputModule, TuiTextAreaModule, TuiAvatarModule, TuiInputFilesModule, TuiTabsModule } from '@taiga-ui/kit';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TuiDropdownModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { DateFilterComponent } from './components/date-filter/date-filter.component';
import { TuiButtonModule, TuiCalendarModule, TuiDataListModule } from '@taiga-ui/core/components';
import { SortComponent } from './components/sort/sort.component';
import { TopPostComponent } from './components/top-post/top-post.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { AddBlogComponent } from './pages/add-blog/add-blog.component';
import { TuiEditorModule, TuiEditorSocketModule } from '@taiga-ui/addon-editor';
import { ReadBlogComponent } from './pages/read-blog/read-blog.component';
import { ExampleTuiYoutubeToolModule } from './pages/add-blog/youtube-tool/youtube-tool.module';
import { BlurhashComponent } from 'src/@core/standalones/blurhash/blurhash.component';
import { TopPostSkeletonComponent } from 'src/@core/standalones/top-post-skeleton/top-post-skeleton.component';
import { BlogPostSkeletonComponent } from 'src/@core/standalones/blog-post-skeleton/blog-post-skeleton.component';
import { TuiLoaderModule } from '@taiga-ui/core';



@NgModule({
  declarations: [
    BlogComponent,
    ViewBlogComponent,
    HeaderComponent,
    SearchbarComponent,
    DateFilterComponent,
    SortComponent,
    TopPostComponent,
    BlogPostComponent,
    AddBlogComponent,
    ReadBlogComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    NgOptimizedImage,
    TuiSidebarModule,
    TuiActiveZoneModule,
    TuiInputModule,
    ReactiveFormsModule,
    FormsModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    TuiDropdownModule,
    TuiCalendarModule,
    TuiDataListModule,
    TuiLetModule,
    TuiAvatarModule,
    TuiTextAreaModule,
    TuiEditorModule,
    TuiInputFilesModule,
    ExampleTuiYoutubeToolModule,
    TuiTabsModule,
    BlurhashComponent,
    TopPostSkeletonComponent,
    BlogPostSkeletonComponent,
    TuiLoaderModule,
    TuiEditorSocketModule
  ]
})
export class BlogModule { }
