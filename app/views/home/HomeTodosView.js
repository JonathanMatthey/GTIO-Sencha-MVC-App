App.views.todosView = Ext.extend(Ext.TabPanel, {
		tabBar: {
	      dock: 'top',
	      layout: {
	          pack: 'center'
	      }
	  },
	  fullscreen: true,
		cls:'todotabbar',
    type: 'dark',
    sortable: true,
    items: [
		 {
			layout: 'card',
			xtype: 'panel',
			title: 'i style',
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
		}   
    , {
       layout: 'card',
			xtype: 'panel',
			title: 'community',
	    items:[ {
	        // the list card
	        id: 'listCard',
	        layout: 'fit',
	        items: {
	            // the list itself, gets bound to the store programmatically once it's loaded
	            id: 'dataList',
	            xtype: 'list',
	            store: 'stylistsStore2',
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
    }, {
       layout: 'card',
			xtype: 'panel',
			title: 'my reviews',
	    items:[ {
	        // the list card
	        id: 'listCard',
	        layout: 'fit',
	        items: {
	            // the list itself, gets bound to the store programmatically once it's loaded
	            id: 'dataList',
	            xtype: 'list',
	            store: 'stylistsStore3',
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
    }]
});

Ext.reg('todosView', App.views.todosView);

App.views.HomeTodos = Ext.extend(Ext.Panel, {
	
    
    style: 'background: green',
    
    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [ {
                    itemId: 'homeButton',
                    iconCls: 'home',
                    iconMask: true
                }
            ]
        },
				App.views.todosView

				];

				
        App.views.HomeTodos.superclass.initComponent.apply(this, arguments);

			}

});
Ext.reg('HomeTodos', App.views.HomeTodos);