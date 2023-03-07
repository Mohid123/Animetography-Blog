import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { TuiAvatarModule, TuiBadgedContentModule, TuiInputModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiDropdownModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { TuiTabsModule } from '@taiga-ui/kit/components/tabs';
import { BlogPostSkeletonComponent } from 'src/@core/standalones/blog-post-skeleton/blog-post-skeleton.component';
import { FavoritePostComponent } from 'src/@core/standalones/favorite-post/favorite-post.component';
import { TuiLoaderModule } from '@taiga-ui/core';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    TuiBadgedContentModule,
    TuiAvatarModule,
    TuiButtonModule,
    TuiCheckboxModule,
    ReactiveFormsModule,
    TuiTabsModule,
    TuiSvgModule,
    BlogPostSkeletonComponent,
    FavoritePostComponent,
    TuiDropdownModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiLoaderModule
  ]
})
export class ProfileModule { }
