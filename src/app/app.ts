import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './shared/components/loader/loader.component';
import { LoaderService } from './shared/components/loader/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  loading = inject(LoaderService).loading;
}
