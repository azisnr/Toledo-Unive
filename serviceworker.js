var CACHE_NAME = 'toledo-university-web-cache-v1';
var urlsToCache = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/images//logo.png',
  '/js/jquery.min.js',
  '/serviceworker.js',
  'manifest.json',
  '/css/bootstrap.css'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('service worker do install..',cache);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);

  if (url.origin == location.origin){
    event.respondWith(
      caches.match(request).then(function(response){
        return response || fetch(request);
      })
    )
  }else{
    event.respondWith(
      caches.open('list-mahasiswa-cache-v1')
      .then(function (cache){
        return fetch(request).then(function(liveRequest){
          cache.put(request, liveRequest.clone());
          return liveRequest;
        }).catch(function(){
          return caches.match(request)
          .then(function (response){
            if(response) return response;
            return caches.match('/fallback.json');
          })
        })
      })
    )
  }

    // event.respondWith(
    //   caches.match(event.request)
    //     .then(function(response) {
    //       // Cache hit - return response
    //       if (response) {
    //         return response;
    //       }
    //       return fetch(event.request);
    //     }
    //   )
    // );
  });

self.addEventListener('notificationClose', function (n){
    var notification = n.notification;
    var primaryKey = notification.data.primaryKey;

    console.log('Close Notification : ' + primaryKey);
});


self.addEventListener('notificationclick', function (n){
    var notification = n.notification;
    var primaryKey = notification.data.primaryKey;
    var action = n.action;

    if(action === 'close'){
        notification.close();
    }else{
        clients.openWindow('https://github.com/azisnr');
        notification.close();
    }

});

self.addEventListener('activate', function(event) {  
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName){
              return cacheName != CACHE_NAME
          }).map(function(cacheName){
              return caches.delete(cacheName)
          })
        );
      })
    );
});

self.addEventListener('sync', function(event){
  console.log('firing sync');
  if (event.tag == 'image-fetch'){
    console.log('sync event fired');
    event.waitUntil(fetchImage());
  }
});

function fetchImage() {
  console.log('firng : doSomeStuff()');
  fetch('/images//logo.png').then(function(response){
    return response;
  }).then(function(text){
    console.log('Request Success ', text);
  }).catch(function(err){
    console.log('Request failed', err);
  });
}