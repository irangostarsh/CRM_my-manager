const cacheName = "panel-v1";


const files = [

"dashboard.html",
"style.css",
"dashboard.js",
"manifest.json"

];



self.addEventListener(
"install",
event=>{

event.waitUntil(

caches.open(cacheName)
.then(cache=>{

return cache.addAll(files);

})

);


});





self.addEventListener(
"fetch",
event=>{


event.respondWith(


caches.match(event.request)

.then(response=>{


return response || fetch(event.request);


})


);


});