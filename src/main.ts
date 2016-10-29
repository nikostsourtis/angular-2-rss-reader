import {bootstrap} from '@angular/platform-browser-dynamic';
import {Component, Input} from '@angular/core';
import {NgFor} from '@angular/common';
import 'rxjs/add/operator/map';
import {HTTP_PROVIDERS, Http} from '@angular/http';

class FeedService {
	private feeds =  [
		"http://angular-craft.com/feed/",
		"https://www.smashingmagazine.com/feed/",
		"http://feeds.feedburner.com/thoughtram"
	];

	getUserFeeds() {
		return this.feeds
	}
}

@Component({
	selector: 'feed',
	directives: [NgFor],
	template: `
		<div class="feed">
	      <h3>{{data?.title}}</h3>
	      <h3>{{data?.url}}</h3>
	      <ul>
	        <li *ngFor="let entry of data?.entries">
	          <a href="{{entry.link}}">
	            {{entry.title}}
	          </a>
	        </li>
	      </ul>
	    </div>
	`
})
class FeedComponent {
	@Input() url;

	constructor(private http:Http) {	
  	}

  	ngOnInit() {
  		console.log("salut");
  		this.http.get('http://demos.angular-craft.com/rss_service.php?url='+this.url)
  		.map(res => res.json())
      	.subscribe(res => {
      		this.data = res.responseData.feed;
        	console.log(res);
      	});
  	}
}

@Component({
	selector: 'dashboard',
	template: `
		<h3>The dashboard</h3>
		<hr>
		<div *ngFor="let feed of feeds">
			<feed [url]="feed"></feed>
		</div>
	`,
    directives: [FeedComponent, NgFor]
})
class DashboardComponent {
	constructor(private feedService: FeedService) {
		this.feeds = feedService.getUserFeeds();
	}
}


@Component({
    selector: 'app',
    template: `
    	<h1>My RSS Reader</h1>
    	<dashboard></dashboard>
    `,
    directives: [DashboardComponent]
})
class AppComponent {
}

bootstrap(AppComponent, [HTTP_PROVIDERS, FeedService]);
