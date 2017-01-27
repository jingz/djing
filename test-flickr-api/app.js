(function() {

// App global object
window.App = {
    // config & constant ----------------------------------------
    config: {
        getMapDefaultPosition: function  () {
             // Bangkok, Thailand
            return new google.maps.LatLng(13.7563, 100.5018);
        },
        getMapDefaultOptions: function() {
            return {
                center: App.config.getMapDefaultPosition(),
                zoom: 13,
                streetViewControl: false,
                mapTypeControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        },
        getMapDefaultArea: function() {
            return new google.maps.Circle({
                center: App.config.getMapDefaultPosition(),
                radius: 5000, // default flickr radius
                strokeColor:"#0000FF",
                strokeOpacity: 0.3,
                strokeWeight: 1,
                fillOpacity: 0.1
            });
        },
        defaultMarkerIcon: "./images/gmarker-azure-icon.png",
        activeMarkerIcon: "./images/gmarker-green-icon.png",
        photoFetchUri:"https://api.flickr.com/services/rest/",
        photoFetchOptions: { // api docs: https://www.flickr.com/services/api/flickr.photos.search.html
            method: "flickr.photos.search",
            api_key: "3f7b1b52ff73fa574c1fc94895d7b54e",
            format: "json",
            nojsoncallback: 1,
            text: "history",
            radius: 2.5,
            radius_units: 'km',
            extras: "geo, original_format, description, date_upload, date_taken, last_update, machine_tag, o_dims, views, media",
            per_page: 30
        },
        mouseHoldingTimeForChangeMapPosition: 500, // ms
        photoPaningTime: 250,
        movingPositionHelpMessage: 'You can change search area on the map by click-and-hold for a second on any position. or search location above'
    },

    // VARS & CACHING -------------------------------------

    // Map variables ------------------------------------
    map: null,
    mapEl: document.getElementById('map'),
    mapSearchingRadiusArea: null,
    mapSearchLocationBox: null,
    mapCenterMarker: null,

    _imageLoader: new Image(), // for single thread image load.
    isCancelImageLoading: false, // flag for prevent multiple images loading

    // original image dialog cached elements
    jqOriginalImageContainer: $("#original-image-container"),
    jqOriginalImageWrapper: $("#original-image-wrapper"),
    jqOriginalImage: $("#original-image"),
    jqOriginalImageDetails: $("#original-image-detail"),
    jqOriginalImageLoader: $('#original-image-loader'),

    // photo elements caching
    photoGalleryEl: document.getElementById('image-gallery'),

    // store photos from fetched 
    photos: [],
    pagination: {}, // photo pagination

    // inputs
    jqPhotoTitleInput: $('#photo-title'),
    jqPhotoLocationInput: $('#photo-location'),
    jqPhotoSearchBtn: $('#search-btn'),
    jqSearchForm: $('#search-form'),

    // photo actions
    jqNoPhotoNotify: $('#photo-info'),
    jqMorePhotoBtn: $('#more-photo'),
    jqMorePhotoBtnText: $('#more-photo p'),
    jqClearPhotoBtn: $('#clear-photo'),

    // !!! initialize application setup -----------------------------
    init: function(){
        var self = this;

        // Original image loader callback
        this._imageLoader.onload = function(){
            if(!self.isCancelImageLoading){
                self.jqOriginalImage.attr('src', self._imageLoader.src);

                var photo = self.jqOriginalImageContainer.data('photo');

                self.jqOriginalImageDetails.html(photo.displayDetail());
                self.jqOriginalImageContainer.css({visibility: 'visible'});
                photo.stopBlinking();

                setTimeout(function(){
                    photo.hlPosition();
                }, 50);
            }
        }

        // disable form submit prevent refreshing page
        self.jqSearchForm.submit(function(){
            return false;
        });

        // enter to fetch photos
        self.jqPhotoLocationInput.keydown(function(e){
            if(e.keyCode == 13 && $(this).val() == ''){
                self.fetchPhotos();
                return false;
            }
        });

        // fetch photos when click search button
        self.jqPhotoSearchBtn.mouseup(function(){
            self.fetchPhotos();
            return false;
        });

        // enter for fetch photos
        self.jqPhotoTitleInput.keydown(function(e) {
            if(e.keyCode == 13){
                self.fetchPhotos();
                return false;
            }
        });

        // searching more photo
        self.jqMorePhotoBtn.click(function(){
            self.fetchMorePhotos();
            return false;
        });

        // refresh controls in photos
        self.refreshPhotoActions();
    },

    // methods & utils ------------------------------------
    // google map callback
    createMap: function(){
        var self = this;

        // create map elements
        var defaultPosition = self.config.getMapDefaultPosition();

        // default map options
        var mapOptions = self.config.getMapDefaultOptions();

        // map instant
        self.map = new google.maps.Map(self.mapEl, mapOptions);

        // searching radius instant
        self.mapSearchingRadiusArea = self.config.getMapDefaultArea();
        
        // center marker inst
        self.mapCenterMarker = new google.maps.Marker({ position: defaultPosition });

        // search location box inst
        self.mapSearchLocationBox = new google.maps.places.SearchBox(self.jqPhotoLocationInput[0]);

        // init events to all map elements
        self.map.addListener("bounds_changes", function(){
           self.mapSearchLocationBox.setBounds(self.map.getBounds());
        });

        self.mapCenterMarker.addListener('mouseup', function() {
            alert(self.config.movingPositionHelpMessage); 
        });

        // init re-center action by holding mouse down for a sec
        self._dropPinTimeout = null; // timeout
        [self.map, self.mapSearchingRadiusArea].forEach(function(inst){
            inst.addListener("mousedown", function(e){
                self._dropPinTimeout = setTimeout(function(){
                    self.changePositionInMapTo(e.latLng, function  () {
                        self.fetchPhotos();
                    })
                }, self.config.mouseHoldingTimeForChangeMapPosition);
            });

            inst.addListener("mouseup", function(e){
                window.clearTimeout(self._dropPinTimeout);
            });

            inst.addListener("mousemove", function(e){
                window.clearTimeout(self._dropPinTimeout);
            });
        });

        // selecting a place from autocomplete locations
        self.mapSearchLocationBox.addListener('places_changed', function(){
            var places = self.mapSearchLocationBox.getPlaces();
            if(places.length == 0) return;
            var place = places[0];
            if(place.geometry){
                // self.map.panTo(place.geometry.location);
                self.changePositionInMapTo(place.geometry.location, function  () {
                    self.fetchPhotos();
                });
            }
            return false;
        });

        // set all elements into the map
        self.mapSearchingRadiusArea.setMap(self.map);
        self.mapCenterMarker.setMap(self.map);
    },
    changePositionInMapTo: function(latLng, cb){
        var self = this;
        self.mapCenterMarker.setPosition(latLng);
        // self.mapCenterMarker.setMap(self.map);
        self.mapSearchingRadiusArea.setCenter(latLng);
        // self.mapSearchingRadiusArea.setMap(self.map);
        
        // delay to pan to new center;
        setTimeout(function(){
            self.map.panTo(latLng);
            if(typeof cb == 'function'){ cb(); }
        }, 100);
    },
    addPhoto: function(photo){
        var p = new Photo(photo);

        // TODO append when image is ready
        this.photoGalleryEl.appendChild(p.getElement());

        // create marker in the map
        p.marker.setMap(this.map);
        this.photos.push(p);
    },
    panToPhoto: function(photo){
        var t = photo.getElement().offsetTop - this.photoGalleryEl.offsetHeight/2;
        photo.flashImage();
        $(this.photoGalleryEl).animate({ scrollTop: t }, this.config.photoPaningTime);
        // this.photoGalleryEl.scrollTop = photo.getElement().offsetTop - this.photoGalleryEl.offsetHeight/2;
    },
    showOriginalImage: function(photo){
        this.isCancelImageLoading = false;

        // stop loading if loading another
        var oldPhoto = this.jqOriginalImageContainer.data('photo');
        if(oldPhoto) oldPhoto.stopBlinking();

        // store photo data for use in close action
        this.jqOriginalImageContainer.data('photo', photo);

        // loading indicator
        photo.blinking();

        // start loading image
        this._imageLoader.src = photo.originalUri;
    },
    fetchPhotos: function(){
        var self = this;
        self.clearAllPhotos();
        var text = self.jqPhotoTitleInput.val().trim();
        if(!text){
            alert("Please enter the photo title");
            return;
        }
        var opt = $.extend({}, App.config.photoFetchOptions);
        opt.page = 1;
        opt.text = text;
        opt.lat = this.mapCenterMarker.position.lat();
        opt.lon = this.mapCenterMarker.position.lng();

        $.ajax({
            url: App.config.photoFetchUri,
            beforeSend: function() { 
                self.disablePhotoSearchability(); 
                self.notify("Loading ...");
            },
            data: opt
        })
        .done(function(response) {
            if(response.photos.total == 0){
                self.notify("Not found photo in this area!");
            }
            // prevent doublick searching
            self.enablePhotoSearchability();
            self._savePaginationState(response, opt);
            for(var i=0; i < response.photos.total; i++){
                // create and append image into gallery.
                var photo = response.photos.photo[i];
                if(photo) self.addPhoto(photo);
            }

            self.refreshPhotoActions();
        });
    },
    fetchMorePhotos: function() {
        var self = this;
        var opt = $.extend({}, this.pagination.qryOptions);
        opt.page = this.pagination.page + 1; // next page
        var moreText = self.jqMorePhotoBtnText.text();

        $.ajax({
            url: App.config.photoFetchUri,
            beforeSend: function() { 
                self.disablePhotoSearchability(); 
                self.jqMorePhotoBtn.addClass('is-loading');
                // self.jqMorePhotoBtnText.text(moreText + ' ...');
            },
            data: opt
        })
        .done(function(response) {
            self.jqMorePhotoBtn.css({'pointer-events': 'auto'});
            self.jqMorePhotoBtn.removeClass('is-loading');
            // self.jqMorePhotoBtnText.text(moreText);

            // prevent doublick searching
            self.enablePhotoSearchability();
            self._savePaginationState(response, opt);

            for(var i=0; i < response.photos.total; i++){
                // create and append image into gallery.
                var photo = response.photos.photo[i];
                if(photo) self.addPhoto(photo);
            }

            self.refreshPhotoActions();
        });

    },
    _savePaginationState: function(response, qryOptions) {
        this.pagination = {
            total: +response.photos.total,
            page: +response.photos.page,
            pages: +response.photos.pages,
            perpage: +response.photos.perpage,
            qryOptions: qryOptions
        };
        // update text more btn
        var text = this.jqMorePhotoBtnText.text();
        var fetched = this.pagination.page * this.pagination.perpage;
        this.jqMorePhotoBtnText.html(`<big>+</big> ${this.config.photoFetchOptions.per_page}<br/> PHOTOS (${fetched}/${this.pagination.total})`);
    },
    enablePhotoSearchability: function(){
        this.jqPhotoSearchBtn.css({ 'pointer-events': 'auto' });
    },
    disablePhotoSearchability: function(){
        this.jqPhotoSearchBtn.css({ 'pointer-events': 'none' });
    },
    clearAllPhotos: function(){
        while(this.photos.length > 0){
           this.photos.pop().remove();
        }
        this._clearPagination();
        this.notify("Search Photo There &rarr;");
        this.refreshPhotoActions();
    },
    _clearPagination: function(){
        this.pagination = {};
    },
    notify: function(text) {
        this.jqNoPhotoNotify.find('p').html(text);
    },
    canFetchMorePhotos: function(){
        return (this.pagination.page && this.pagination.pages) &&
               (this.pagination.page < this.pagination.pages)
    },
    refreshPhotoActions: function(){
       if(this.photos.length > 0){
           this.jqNoPhotoNotify.hide();
           this.jqClearPhotoBtn.show();
       } else { 
           this.jqNoPhotoNotify.show();
           this.jqClearPhotoBtn.hide();
       }

       if(this.canFetchMorePhotos()){
           this.jqMorePhotoBtn.show();
       } else {
           this.jqMorePhotoBtn.hide();
       }
    }
};


// Photo Class
// photo data from flickr.
// cb is callback when thumb image is loaded.
function Photo(photo, cb) {
    var self = this;

    // simply store photo data from flickr
    this._data = photo;

    // basic photo template
    this.imageWrapperEl = document.createElement('div');
    this.imageWrapperEl.classList.add("image-wrapper");
    this.imageWrapperEl.id = photo.id;

    this.imageEl = document.createElement('img');

    // compose image src flickr format
    this.thumbUri = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
    this.originalUri = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.originalsecret}_o.jpg`;

    // for dev reduce load time
    // this.originalUri = "./images/learning_to_fly.jpg"
    var _thumbImg = new Image();
    _thumbImg.onload = function(){
        if(typeof cb == 'function') cb(self);
    }

    // start loading thumb
    _thumbImg.src = this.thumbUri;
    this.imageEl.src = this.thumbUri;
    this.imageEl.classList.add('t');
    this.imageEl.title = photo.title;
    this.imageWrapperEl.appendChild(this.imageEl);

    // Set Marker
    this.position = new google.maps.LatLng(+photo.latitude, +photo.longitude);
    this.marker = new google.maps.Marker({ position: this.position, 
                                           title: photo.title,
                                           icon: App.config.defaultMarkerIcon});


    // init photo events
    var self = this;
    this.imageWrapperEl.addEventListener('mouseover', function(){
        // highlight photo marker 
        self.hlPosition()
    });

    this.imageWrapperEl.addEventListener('mouseout', function(){
        self.unHlPosition();
    });

    this.imageWrapperEl.addEventListener('click', function(ev){
        self.showOriginal(ev);
    });
    
    this.marker.addListener('mouseover', function(){
        self.hlPhoto();
        self.hlPosition()
        App.panToPhoto(self);
    });

    this.marker.addListener('mouseout', function(){
        self.unHlPosition();
        self.unHlPhoto();
    });

    this.marker.addListener('click', function(ev){
        self.showOriginal(ev);
    });
}

// Photo methods
Photo.prototype.hlPosition = function(){
    this.marker.setOptions({ icon: App.config.activeMarkerIcon});
    this.marker.setZIndex(999);

    // TODO make decision for pan to this position
    // App.map.panTo(this.position);
}

Photo.prototype.unHlPosition = function(){
    this.marker.setOptions({ icon: App.config.defaultMarkerIcon });
    this.marker.setZIndex(0);
}

Photo.prototype.hlPhoto = function(){
    this.imageWrapperEl.classList.add('hl');
}

Photo.prototype.unHlPhoto = function(){
    this.imageWrapperEl.classList.remove('hl');
}

Photo.prototype.offsetTop = function(){
    return this.imageWrapperEl.offsetTop;
}

Photo.prototype.getElement = function(){
    return this.imageWrapperEl;
}

Photo.prototype.appendTo = function(el){
    el.appendChild(this.getElement());
}

Photo.prototype.getImageElement = function(){
    return this.imageEl;
}

Photo.prototype.showOriginal = function(ev){
    App.showOriginalImage(this)
}

Photo.prototype.flash = function(){
    this.flashImage();
    this.flashMarker();
}

Photo.prototype.flashImage = function  () {
    $(this.imageEl).hide().fadeIn();
}

Photo.prototype.flashMarker = function  () {
    var self = this;
    this.marker.setAnimation(google.maps.Animation.DROP);
    this.hlPosition();
    setTimeout(function(){
        self.marker.setAnimation(null);
        self.unHlPosition();
    }, 750)
}

Photo.prototype.getOffsetScreen = function(){
    var left = this.imageWrapperEl.offsetLeft;
    var top = this.imageWrapperEl.offsetTop;
    var scrollTop = App.photoGalleryEl.scrollTop;
    return [left, top - scrollTop];
}

Photo.prototype.displayDetail = function(){
   return `<h3 class='heading'>${this._data.title}</h3>
    <div><img src="${this.thumbUri}" width='100px;'/></div>
    <p>${this._data.description._content}<br/>
        <small>Taken @ ${this._data.datetaken}<small></p>`;
}

Photo.prototype.remove = function(){
    // destroy element;
    this.getElement().remove();
    this.marker.setMap(null);
    delete this;
}

Photo.prototype.blinking = function(){
    this.imageWrapperEl.classList.add('is-loading');
}

Photo.prototype.stopBlinking = function(){
    this.imageWrapperEl.classList.remove('is-loading');
}
// End Photo Class ----------------------------------
})();
