App.views.HomeAbout = Ext.extend(Ext.Panel, {
	
    html: '<h3>about</h3>',
    
    styleHtmlContent: true,
    style: 'background: #d8efed',
		
});
Ext.reg('HomeAbout', App.views.HomeAbout);