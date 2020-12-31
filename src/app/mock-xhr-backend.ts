import { HttpEvent, HttpRequest, HttpResponse, HttpBackend } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';

export class MockXHRBackend implements HttpBackend {
  private mediaItems = [
    {
      id: 1,
      name: 'Vietnam',
      visited: false,
      category: 'Asia',
      isFavorite: true,
      //image: "https://www.state.gov/wp-content/uploads/2019/04/Vietnam-2522x1406.jpg"
    },
    {
      id: 2,
      name: 'Canada',
      visited: false,
      category: 'North America',
      isFavorite: false
    }, {
      id: 3,
      name: 'England',
      category: 'Europe',
      visited: false,
      isFavorite: false
    }, {
      id: 4,
      name: 'Greece',
      medium: 'Yes',
      category: 'Europe',
      watchedOn: 1564650000000,
      isFavorite: true
     }//, {
    //   id: 5,
    //   name: 'Happy Joe: Cheery Road',
    //   medium: 'Movies',
    //   category: 'Action',
    //   year: 2015,
    //   watchedOn: 1457166565384,
    //   isFavorite: false
    // }
  ];

  handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return new Observable((responseObserver: Observer<HttpResponse<any>>) => {
      let responseOptions;
      switch (request.method) {
        case 'GET':
          if (request.urlWithParams.indexOf('mediaitems?medium=') >= 0 || request.url === 'mediaitems') {
            let medium;
            if (request.urlWithParams.indexOf('?') >= 0) {
              medium = request.urlWithParams.split('=')[1];
              if (medium === 'undefined') { medium = ''; }
            }
            let mediaItems;
            if (medium) {
              mediaItems = this.mediaItems.filter(i => i.medium === medium);
            } else {
              mediaItems = this.mediaItems;
            }
            responseOptions = {
              body: {mediaItems: JSON.parse(JSON.stringify(mediaItems))},
              status: 200
            };
          } else {
            let mediaItems;
            const idToFind = parseInt(request.url.split('/')[1], 10);
            mediaItems = this.mediaItems.filter(i => i.id === idToFind);
            responseOptions = {
              body: JSON.parse(JSON.stringify(mediaItems[0])),
              status: 200
            };
          }
          break;
        case 'POST':
          const mediaItem = request.body;
          mediaItem.id = this._getNewId();
          this.mediaItems.push(mediaItem);
          responseOptions = {status: 201};
          break;
        case 'DELETE':
          const id = parseInt(request.url.split('/')[1], 10);
          this._deleteMediaItem(id);
          responseOptions = {status: 200};
      }

      const responseObject = new HttpResponse(responseOptions);
      responseObserver.next(responseObject);
      responseObserver.complete();
      return () => {
      };
    });
  }

  _deleteMediaItem(id) {
    const mediaItem = this.mediaItems.find(i => i.id === id);
    const index = this.mediaItems.indexOf(mediaItem);
    if (index >= 0) {
      this.mediaItems.splice(index, 1);
    }
  }

  _getNewId() {
    if (this.mediaItems.length > 0) {
      return Math.max.apply(Math, this.mediaItems.map(mediaItem => mediaItem.id)) + 1;
    } else {
      return 1;
    }
  }
}
