new Ext.data.Store({
    model: 'Stylist',
		storeId: 'stylistsStore',
    data : [
			{name: 'Anna',		thumb: 'resources/img/looks/thumbs/thumb-look1.jpg'},
			{name: 'Claire',	thumb: 'resources/img/looks/thumbs/thumb-look2.jpg'},
			{name: 'Kimi',		thumb: 'resources/img/looks/thumbs/thumb-look3.jpg'},
			{name: 'Theresa',	thumb: 'resources/img/looks/thumbs/thumb-look4.jpg'},
			{name: 'Claire',	thumb: 'resources/img/looks/thumbs/thumb-look2.jpg'},
			{name: 'Kimi',		thumb: 'resources/img/looks/thumbs/thumb-look3.jpg'},
			{name: 'Theresa',	thumb: 'resources/img/looks/thumbs/thumb-look4.jpg'},
			{name: 'Claire',	thumb: 'resources/img/looks/thumbs/thumb-look2.jpg'},
			{name: 'Kimi',		thumb: 'resources/img/looks/thumbs/thumb-look3.jpg'},
			{name: 'Theresa',	thumb: 'resources/img/looks/thumbs/thumb-look4.jpg'}
    ]
});
new Ext.data.Store({
    model: 'Stylist',
		storeId: 'stylistsStore2',
    data : [
			{name: 'Dom',		thumb: 'resources/img/looks/thumbs/thumb-look5.jpg'},
			{name: 'Mark',	thumb: 'resources/img/looks/thumbs/thumb-look4.jpg'},
			{name: 'Anthony',		thumb: 'resources/img/looks/thumbs/thumb-look7.jpg'},
			{name: 'Jack',	thumb: 'resources/img/looks/thumbs/thumb-look1.jpg'},
			{name: 'Mark',	thumb: 'resources/img/looks/thumbs/thumb-look4.jpg'},
			{name: 'Anthony',		thumb: 'resources/img/looks/thumbs/thumb-look7.jpg'},
			{name: 'Jack',	thumb: 'resources/img/looks/thumbs/thumb-look1.jpg'},
			{name: 'Mark',	thumb: 'resources/img/looks/thumbs/thumb-look4.jpg'},
			{name: 'Anthony',		thumb: 'resources/img/looks/thumbs/thumb-look7.jpg'},
			{name: 'Jack',	thumb: 'resources/img/looks/thumbs/thumb-look1.jpg'}
    ]
});
new Ext.data.Store({
    model: 'Stylist',
		storeId: 'stylistsStore3',
    data : [
			{name: 'Burke',		thumb: 'resources/img/looks/thumbs/thumb-look8.jpg'},
			{name: 'Plato',	thumb: 'resources/img/looks/thumbs/thumb-look9.jpg'},
			{name: 'Locke',		thumb: 'resources/img/looks/thumbs/thumb-look11.jpg'},
			{name: 'Bacon',	thumb: 'resources/img/looks/thumbs/thumb-look10.jpg'},
			{name: 'Plato',	thumb: 'resources/img/looks/thumbs/thumb-look9.jpg'},
			{name: 'Locke',		thumb: 'resources/img/looks/thumbs/thumb-look11.jpg'},
			{name: 'Bacon',	thumb: 'resources/img/looks/thumbs/thumb-look10.jpg'},
			{name: 'Plato',	thumb: 'resources/img/looks/thumbs/thumb-look9.jpg'},
			{name: 'Locke',		thumb: 'resources/img/looks/thumbs/thumb-look11.jpg'},
			{name: 'Bacon',	thumb: 'resources/img/looks/thumbs/thumb-look10.jpg'}
    ]
});

App.views.HomeStylists =  Ext.extend(Ext.Panel, {
    layout: 'card',
    title: 'stylists',
    layout: 'fit',
		
    items: [
            {
                // the list card
                id: 'listCard',
                layout: 'fit',
                dockedItems: [{
                    // main top toolbar
                    dock : 'top',
                    xtype: 'toolbar',
                    title: 'Stylists' // will get added once loaded
                }],
                items: {
                    // the list itself, gets bound to the store programmatically once it's loaded
                    id: 'dataList',
                    xtype: 'list',
                    store: 'stylistsStore',
                    itemTpl:
                        '<img class="photo" src="{thumb}" width="40" height="40"/>' +
                        '{name}<br/>' +
                        '<small>small text here</small>',
                    listeners: {
                        selectionchange: function (selectionModel, records) {
                            // if selection made, slide to detail card
                            if (records[0]) {
                                cb.cards.setActiveItem(cb.cards.detailCard);
                                cb.cards.detailCard.update(records[0].data);
                            }
                        }
                    }
                },
            },
						{
                // the details card
                id: 'detailCard',
                xtype: 'tabpanel',
                dockedItems: [{
                    // also has a toolbar
                    dock : 'top',
                    xtype: 'toolbar',
                    title: '',
                    items: [{
                        // containing a back button that slides back to list card
                        text: 'Back',
                        ui: 'back',
                        listeners: {
                            tap: function () {
                                cb.cards.setActiveItem(
                                    cb.cards.listCard,
                                    {type:'slide', direction: 'right'}
                                );
                            }
                        }
                    }]
                }],
                tabBar: {
                    // the detail card contains two tabs: address and map
                    dock: 'top',
                    ui: 'light',
                    layout: { pack: 'center' }
                },
                items: [
                    {
                        // textual detail
                        title: 'Contact',
                        styleHtmlContent: true,
                        cls: 'detail',
                        tpl: [
                            '<img class="photo" src="{photo_url}" width="100" height="100"/>',
                            '<h2>{name}</h2>',
                            '<div class="info">',
                                '{address1}<br/>',
                                '<img src="{rating_img_url_small}"/>',
                            '</div>',
                            '<div class="phone x-button">',
                                '<a href="tel:{phone}">{phone}</a>',
                            '</div>',
                            '<div class="link x-button">',
                                '<a href="{mobile_url}">Read more</a>',
                            '</div>'
                        ]
                    },
                    {
                        // map detail
                        title: 'Map',
                        xtype: 'map',
                        
                    }
                ],
                update: function(data) {
                    // updating card cascades to update each tab
                    Ext.each(this.items.items, function(item) {
                        item.update(data);
                    });
                    this.getDockedItems()[0].setTitle(data.name);
                }
            }],
						listeners: {
                // 'afterrender': function () {
                //                     // when the viewport loads, we go through a callback-centric sequence to load up:
                //                     // a) the name of the nearest city
                //                     // b) the local businesses from Yelp
                //     
                //                     //some useful references
                //                     var cards = this;
                //                     cards.listCard = cards.getComponent('listCard');
                //                     cards.dataList = cards.listCard.getComponent('dataList');
                //                     cards.detailCard = cards.getComponent('detailCard');
                // 
                //                     cards.setLoading(true); // get the spinner going
                //     
                //                     // get the city, then...
                //                     cb.getCity(function (city) {
                //                         
                //                         // update status bar
                //                         cards.listCard.getDockedItems()[0].setTitle(city + ' ' + BUSINESS_TYPE);
                // 
                //                         // then use Yelp to get the businesses
                //                         cb.getBusinesses(city, function (store) {
                // 
                //                             // then bind data to list and show it
                //                             cards.dataList.bindStore(store);
                //                             cards.setActiveItem(cards.listCard);
                // 
                //                             cards.setLoading(false); // hide the spinner
                // 
                //                         });
                //                     });
                // 
                //                 }
            },

});


Ext.reg('HomeStylists', App.views.HomeStylists);