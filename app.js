(function($) {

  // Backbone.sync = function(method, model, success, error) {
  //   success();
  // }

  //
  // Models + Collections
  //

  var IconModel = Backbone.Model.extend({

    defaults: {
      icon: null,
      title: null,
      index: null,
    },

  });

  var LaundryCollection = Backbone.Collection.extend({

    model: IconModel,
    parse: function(response) {
      data = response.results;
      console.log(data);
      extracted = [];
      _.each(data, function(big) {
        for (var i=0; i<big.length; i++) {
          extracted.push(big[i]);
        }
      });
      return extracted
    },

  });

  //
  // Views
  //
  
  var IconView = Backbone.View.extend({
    
    tagName: 'div',
    className: 'item',
    template: _.template($('#icon-template').html()),

    events: {
      'mouseover': 'showTip',
      'click': 'highlight',
      'mouseout': 'resetTip',
    },

    initialize: function() {
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    showTip: function() {
      var tip = $('.tip');
      tip.text(this.model.get('title'));
    },

    resetTip: function() {
      var tip = $('.tip');
      tip.text('Laundry Symbols');
    },

    highlight: function() {
      this.$el.toggleClass('highlighted');
    },

  });

  var LaundryView = Backbone.View.extend({
    
    el: '.collection',

    events: {
    },

    initialize: function() {
      var self = this;
      this.listenTo(this.collection, 'sync', this.render);
    },

    render: function() {
      var $list = this.$el.add('ul');

      this.collection.each(function(model) {
        var item = new IconView({model: model});
        $list.append(item.render().$el);
      }, this); 

      return this;
    },

    showTip: function() {
    },

  });

  //
  // R U N
  //
  
  var items = new LaundryCollection();
  var itemsView = new LaundryView({collection: items});
  items.fetch({
    url: "wikidata.json",
  });

})(jQuery);
