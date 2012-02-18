App.views.LooksList =  Ext.extend(Ext.Panel, {
		layout: 'card',
		xtype: 'panel',
		title: 'stlists',
    items:[ {
        // the list card
        id: 'listCard',
        layout: 'fit',
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

Ext.reg('LooksList', App.views.LooksList);