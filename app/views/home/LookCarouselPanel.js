
App.views.LookPanelTopButtons = Ext.extend(Ext.Panel,{
	defaults: { flex: 1},
	dock: 'top',
	layout: {
      type: 'hbox',
			align: 'center'
  },
	// html: 'top buttons here',
	items: [
		{ 
			itemId: 'reviewTextButton',
			xtype: 'button',
			text: 'Im the one in the right. What do you think of the dress it is for a thanks giving dinner',
			flex: 9
		},
		{ 
			itemId: 'reviewIconButton',
			xtype: 'button',
			iconCls: 'home',
			iconMask: true,
			width: 50,
			ui: 'normal',
		}
	],
	
});
Ext.reg('LookPanelTopButtons', App.views.LookPanelTopButtons);


App.views.LookPanelBottomButtons = Ext.extend(Ext.Panel,{
	defaults: { flex: 1},
	dock: 'bottom',
	layout: {
      type: 'hbox',
      pack: 'center',
      align: 'stretch'
  },
	// html: 'top buttons here',
	items: [
		{ 
			itemId: 'wearItButton',
			xtype: 'button',
			text: 'wear it'
		},
		{ 
			itemId: 'changeItButton',
			xtype: 'button',
			text: 'change it'
		}
	],
	
});
Ext.reg('LookPanelBottomButtons', App.views.LookPanelBottomButtons);

App.views.LookCarouselPanel = Ext.extend(Ext.Panel, {
    layout: 'fit',
    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                    itemId: 'backButton',
                    ui: 'back',
                    text: 'home',
                    iconMask: true
                }, {
                    itemId: 'homeButton',
                    iconCls: 'home',
                    iconMask: true
                }
            ]
        }];

        this.carousel = new Ext.Carousel({
            indicator: false,
            defaults: {
                scroll: 'vertical'
            }
        });

        this.items = [this.carousel];

        App.views.LookCarouselPanel.superclass.initComponent.apply(this, arguments);
    }

});

Ext.reg('LookCarouselPanel', App.views.LookCarouselPanel);
