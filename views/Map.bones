// Map
// ---
// View for exploring a single Map. Provides a fullscreen map client with HUD
// panels for info, download, etc.
view = views.HUD.extend({
    initialize: function(options) {
        views.HUD.prototype.initialize.call(this, options);
        _.bindAll(this, 'render', 'format');
        this.render().trigger('attach');
    },
    format: function(type, value) {
        switch (type) {
        case 'deg':
            return parseInt(value * 100, 10) / 100;
            break;
        case 'url':
            var id = this.model.id;
            return _.map(value, function(layer) {
                return layer + '1.0.0/' + id + '/{z}/{x}/{y}.png';
            });
            break;
        case 'download':
            return this.options.tileHost[0] + 'download/' + this.model.id + '.mbtiles';
            break;
        case 'size':
            return (Math.ceil(parseInt(value) / 1048576)) + ' MB';
            break;
        }
    },
    render: function() {
        $(this.el).html(templates.Map(_({
            breadcrumb: [{
                href: this.model.options.basepath + 'map/' + this.model.get('id'),
                title: this.model.get('name')
            }],
            buttons: [
                {id:'info', title:'Info'},
                {id:'download', title:'Download'}
            ],
            basepath: this.model.options.basepath,
            format: this.format
        }).extend(this.model)));
        this.map = new views.MapClient({model: this.model});
        this.bind('ready', this.map.ready);
        $(this.el).append(this.map.el);
        return this;
    }
});
