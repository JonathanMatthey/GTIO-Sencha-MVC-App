App.views.HomeIndex = Ext.extend(Ext.Panel, {
    layout: 'fit',
    html: '<div style="width:320px;height:480px;background:#000;"></div>',
    initComponent: function() {
        this.store = new Ext.data.Store({
            autoLoad: true,
            model: 'Image'
        });
        
        this.dockedItems = [
		        {
            xtype: 'toolbar',
            dock: 'top',
						title: 'Jonathan Matthey',
            itemId: 'albumToolbar',
            items: [{ xtype : "container", cls: "user-avatar" },
								{ xtype: 'spacer' },
								{
				            ui: 'action',
										iconCls: 'action',
										iconMask: true,
				            handler: function () {
				                // TODO: Save current note.
				            }
				        }
							]
        }];

        this.xtpl = new Ext.XTemplate(
            '<div style="padding:10px 5px 5px 5px;">',
            '<tpl for=".">',
                '<div class="node" style="background:url({thumb});">',
                '</div>',
            '</tpl>',
            '</div>'
        );

        this.dataView = new Ext.DataView({
            store: this.store,
            tpl: this.xtpl,
            itemSelector: 'div.node'
        });

        this.items = [this.dataView];

        App.views.HomeIndex.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('HomeIndex', App.views.HomeIndex);
