App.views.HomeUploads = Ext.extend(Ext.Panel, {
	
    html: '<h3>1. TAKE A PHOTO</h3><p>choose a saved photo or snap a new one</p>'
			+ '<h3>2. TELL US ABOUT IT</h3><p>give us some details: where you\'re going, what brands you\'re wearing</p>'
			+ '<h3>3. SHARE</h3><p> get opinions! share with everyone, or just your friends!</p>',
	
	
    styleHtmlContent: true,
    style: 'background: pink',

		
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
        }

				];

				
        App.views.HomeTodos.superclass.initComponent.apply(this, arguments);

			}

});
Ext.reg('HomeUploads', App.views.HomeUploads);