import { Component } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router, Event } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
          // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
          // Hide loading indicator
          //detects navigation
          let timeout = Number.parseInt(localStorage.getItem('active_timer')??'0');
          clearTimeout(timeout);
          if(event.url=='/menu'){
            let timeoutMinutes = Number.parseInt(localStorage.getItem('active_timer_minutes')??'0');
            clearTimeout(timeoutMinutes);
          }
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
      }
  });
  }

}
