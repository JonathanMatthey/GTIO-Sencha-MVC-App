Ext.regController('Home', {
 
    // index action
	index: function(options)
    {
        if ( ! this.indexView)
        {
            this.indexView = this.render({
                xtype: 'HomeIndex',
								listeners: {
				            dataView: {
				                itemtap: function(list, index) {
				                    var imgdata = this.indexView.dataView.store.data.items;
				                    this.viewCarousel(list, imgdata, index);
				                },
				                // itemswipe: function(list, index) {
				                //     var imgdata = lookView.dataView.store.data.items;
				                //     lookView.update(
				                //         '<div style="background:url(' +
				                //             imgdata[index].data.path + ') no-repeat;'+
				                //             'width:320px;height:640px;"></div>'
				                //     );
				                // },
				                scope: this
				            }
				        }
            });
				    // 
				    // this.indexView.query('#homeButton')[0].on({
				    //     tap: this.index,
				    //     scope: this
				    // });
				    // 
				    // lookView.query('#albumToolbar')[0].setTitle(record.data.name);
				    // 

		        App.viewport.setActiveItem(this.indexView, options.animation);

        }
				else{
			        App.viewport.setActiveItem(this.indexView, {
			            type: 'slide',
			            direction: 'right'
			        });
				}
    },
    
    // about action
    about: function(options)
    {
        if ( ! this.aboutView)
        {
            this.aboutView = this.render({
                xtype: 'HomeAbout',
            });
        }
     
        App.viewport.setActiveItem(this.aboutView, options.animation);
    },


    // uploads action
    uploads: function(options)
    {
        if ( ! this.uploadsView)
        {
            this.uploadsView = this.render({
                xtype: 'HomeUploads',
            });
						
				    this.uploadsView.query('#homeButton')[0].on({
				        tap: this.index,
				        scope: this
				    });
        }

        App.viewport.setActiveItem(this.uploadsView, options.animation);
    },

    
    // stylists action
    stylists: function(options)
    {
        if ( ! this.stylistsView)
        {
            this.stylistsView = this.render({
                xtype: 'HomeStylists',
            });
        }
     
        App.viewport.setActiveItem(this.stylistsView, options.animation);
    },

    
    // todos action
    todos: function(options)
    {
        if ( ! this.todosView)
        {
            this.todosView = this.render({
                xtype: 'HomeTodos',
            });
        }
     
        App.viewport.setActiveItem(this.todosView, options.animation);
    },


		
    // browse action
    browse: function(options)
    {
        if ( ! this.browseView)
        {
            this.browseView = this.render({
                xtype: 'HomeBrowse',
            });
        }
     
        App.viewport.setActiveItem(this.browseView, options.animation);
    },

    // viewCarousel controller - third screen (image view)
		viewCarousel: function(list, imgdata, index) {
			
        if ( ! this.lookCarouselView)
        {
				    this.lookCarouselView = this.render({
				        xtype: 'LookCarouselPanel',
				        listeners: {
				            deactivate: function(localLookCarouselView) {
				            }
				        }
				    });
				    // for(i=0; i<imgdata.length; i++) {
				    // SPEED UP - limit to 10
				 		for(i=0; i<10; i++) {
										// Version 1 : very simple - add the html and the buttons in html then position using css absolutes
										
										// 				        this.lookCarouselView.carousel.add({
										// 				            html: '<div class="img" style="background: url('+imgdata[i].data.path+');">'
										// +'<div id="review-text"></div><div id="review-icon"></div><div id="left-arrow"></div><div id="right-arrow"></div> <div id="wearit" class="wearit-changeit-btns">wear it</div><div id="changeit" class="wearit-changeit-btns">change it</div></div>'
										// + ''
										// 				        });
										
										// version 2 creates the buttons and panels on the fly.
										// more correct solution but does it lagggg ??
										this.lookCarouselView.carousel.add(new Ext.Panel({
												layout: {
										        type: 'vbox',
										        pack: 'center',
										        align: 'stretch'
										    },
												items: [
													App.views.LookPanelTopButtons
													,
						            {
						                html: '2',
						                flex: 1
						            },
													App.views.LookPanelBottomButtons
												],
												style: 'background: url(\'' + imgdata[i].data.path + '\');background-position:center;background-repeat:no-repeat;'
											}));
											
										
				    }
				    
				    this.lookCarouselView.query('#homeButton')[0].on({
				        tap: this.index,
				        scope: this
				    });
				    // 
				    // this.lookCarouselView.query('#wearit')[0].on({
				    // 			        	tap: function()
				    // 								{
				    // 									alert('increment wearit count');
				    // 								},
				    //     scope: this
				    // });
				
				    App.viewport.setActiveItem(this.lookCarouselView, 'slide');
				    this.lookCarouselView.carousel.setActiveItem(index);
				}
				else{
				    App.viewport.setActiveItem(this.lookCarouselView, 'slide');
				    this.lookCarouselView.carousel.setActiveItem(index);
				}
				
		}


});