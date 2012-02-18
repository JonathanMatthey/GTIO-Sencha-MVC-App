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
