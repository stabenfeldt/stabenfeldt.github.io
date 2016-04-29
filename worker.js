importScripts('serviceworker-cache-polyfill.js');
importScripts('service-composer.js');

serviceComposer.compose([
  {
        name: 'images',
        version: 1,
        matcher: 'https://stabenfeldt.github.io/images',
        type: serviceComposer.types.CACHE_ALWAYS
    },
    {
        name: 'others',
        version: 1,
        type: serviceComposer.types.CACHE_OFFLINE,
        onSuccess: function(response, cache, event, config) {
            if(event.request.url.indexOf('page=') > -1) {
                prefetchImages(response.clone());
            }
        }
    }
]);

function prefetchImages(response) {
    response.json().then(function(json) {
        var urls = json.map(function(obj) {
            return obj.localImages.medPath;
        });

        caches.open('images-1').then(function(cache) {
            cache.addAll(urls);
        });
    });
}
