App.views.viewportTopToolbar = new Ext.Toolbar({
    title: 'Jonathan Matthey',
    items: [
				{ xtype : "container", cls: "user-avatar" },
			
        // {
        //     text: 'Home',
        //     ui: 'back',
        //     handler: function () {
        //         // TODO: Transition to the notes list view.
        //     }
        // },
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
});

TabBarMvc = Ext.extend(Ext.TabBar, {
	dock: 'bottom',
	ui: 'dark',
	layout: {
		pack: 'center'
	},
	
	
		items: [
			{
       	text: 'Community',
       	iconCls: 'team',
       	route: 'Home/index', // custom property of the TabBarMvc component
       },
       {
       	text: 'Uploads',
       	iconCls: 'uploads',
       	route: 'Home/uploads', // custom property of the TabBarMvc component
       },
       {
       	text: 'To-do\'s',
       	iconCls: 'todos',
       	route: 'Home/todos', // custom property of the TabBarMvc component
				badgeText: '4'
       },
			{
				text: 'Stylists',
       	iconCls: 'stylists',
				route: 'Home/stylists', // custom property of the TabBarMvc component
			},
			{
				text: 'Browse',
       	iconCls: 'search',
				route: 'Home/browse', // custom property of the TabBarMvc component
			}	,
			{
				text: 'Settings',
       	iconCls: 'settings',
				route: 'Home/aboutt', // custom property of the TabBarMvc component
			}
  ],

	
	initComponent: function()
	{
		var thisComponent = this;
		this.previousTabIndex = 0;
		
		// iterate through all the items
		Ext.each(this.items, function(item)
		{
			// add a handler function for the tab button
			item.handler = function(){
				thisComponent.tabButtonHandler(this);
			};
			
		}, this);
		
		// detect when the route changed
		Ext.Dispatcher.on('dispatch', function(interaction)
		{
			var tabs = this.query('.tab');
			
			var action = interaction.action;
			var controller = interaction.controller.id;
			
			Ext.each(tabs, function(item)
			{
				if ( ! item.route)
					return;
				
				var dispatchOptions = Ext.Router.recognize(item.route);
				//
				var itemAction = dispatchOptions.action;
				var itemController = dispatchOptions.controller;
				
				if (itemController == controller && itemAction == action)
				{
					this.setActiveTab(item);
					
					this.previousTabIndex = this.items.indexOf(item);
					
					return false;
				}
			}, this);
			
		}, this);
		
		// switch animation
		if ( ! this.switchAnimation)
		{
			this.switchAnimation = {type: 'slide'};
		}
		else if (Ext.isString(this.switchAnimation))
		{
			this.switchAnimation = {type: this.switchAnimation};
		}
		
		TabBarMvc.superclass.initComponent.apply(this, arguments);
	},
	
	// function called on tab button tap
	tabButtonHandler: function(tab)
	{
		var tabIndex = this.items.indexOf(tab);
		
		this.setActiveTab(tab);
		
		if ( ! Ext.isEmpty(tab.route))
		{
			var anim = {};
			anim = Ext.apply(anim, this.switchAnimation);
			
			if (tabIndex != -1 && tabIndex < this.previousTabIndex)
			{
				anim.reverse = true;
			}

			var dispatchOptions = Ext.Router.recognize(tab.route);
			dispatchOptions.animation = anim;
			//
			Ext.dispatch(dispatchOptions);
		}
		
		this.previousTabIndex = tabIndex;
	},
	
	setActiveTab: function(tab)
	{ 
		var tabs = this.query('.tab');
	   
		Ext.each(tabs, function(item, index){
			item.removeCls('x-tab-active');
		}, this);
		
		tab.addCls('x-tab-active');
	}
	
});

Ext.reg('TabBarMvc', TabBarMvc);

App.views.Viewport = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    cardSwitchAnimation: 'slide',
		xtype: 'TabBarMvc',

    dockedItems: [
            //App.views.viewportTopToolbar,
            TabBarMvc
        ],
		
});
