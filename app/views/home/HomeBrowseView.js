// Ext.regModel('Contact', {
//     fields: ['firstName', 'lastName']
// });
// 
// App.ListStore = new Ext.data.Store({
//     model: 'Contact',
//     sorters: 'firstName',
//     getGroupString : function(record) {
//         return record.get('firstName')[0];
//     },
//     data: [
//         {firstName: 'Julio', lastName: 'Benesh'},
//         {firstName: 'Julio', lastName: 'Minich'},
//         {firstName: 'Tania', lastName: 'Ricco'},
//         {firstName: 'Odessa', lastName: 'Steuck'},
//         {firstName: 'Nelson', lastName: 'Raber'},
//         {firstName: 'Tyrone', lastName: 'Scannell'},
//         {firstName: 'Allan', lastName: 'Disbrow'},
//         {firstName: 'Cody', lastName: 'Herrell'},
//         {firstName: 'Julio', lastName: 'Burgoyne'},
//         {firstName: 'Jessie', lastName: 'Boedeker'},
//         {firstName: 'Allan', lastName: 'Leyendecker'},
//         {firstName: 'Javier', lastName: 'Lockley'},
//         {firstName: 'Guy', lastName: 'Reasor'},
//         {firstName: 'Jamie', lastName: 'Brummer'},
//         {firstName: 'Jessie', lastName: 'Casa'},
//         {firstName: 'Marcie', lastName: 'Ricca'},
//         {firstName: 'Gay', lastName: 'Lamoureaux'},
//         {firstName: 'Althea', lastName: 'Sturtz'},
//         {firstName: 'Kenya', lastName: 'Morocco'},
//         {firstName: 'Rae', lastName: 'Pasquariello'},
//         {firstName: 'Ted', lastName: 'Abundis'},
//         {firstName: 'Jessie', lastName: 'Schacherer'},
//         {firstName: 'Jamie', lastName: 'Gleaves'},
//         {firstName: 'Hillary', lastName: 'Spiva'},
//         {firstName: 'Elinor', lastName: 'Rockefeller'},
//         {firstName: 'Dona', lastName: 'Clauss'},
//         {firstName: 'Ashlee', lastName: 'Kennerly'},
//         {firstName: 'Alana', lastName: 'Wiersma'},
//         {firstName: 'Kelly', lastName: 'Holdman'},
//         {firstName: 'Mathew', lastName: 'Lofthouse'},
//         {firstName: 'Dona', lastName: 'Tatman'},
//         {firstName: 'Clayton', lastName: 'Clear'},
//         {firstName: 'Rosalinda', lastName: 'Urman'},
//         {firstName: 'Cody', lastName: 'Sayler'},
//         {firstName: 'Odessa', lastName: 'Averitt'},
//         {firstName: 'Ted', lastName: 'Poage'},
//         {firstName: 'Penelope', lastName: 'Gayer'},
//         {firstName: 'Katy', lastName: 'Bluford'},
//         {firstName: 'Kelly', lastName: 'Mchargue'},
//         {firstName: 'Kathrine', lastName: 'Gustavson'},
//         {firstName: 'Kelly', lastName: 'Hartson'},
//         {firstName: 'Carlene', lastName: 'Summitt'},
//         {firstName: 'Kathrine', lastName: 'Vrabel'},
//         {firstName: 'Roxie', lastName: 'Mcconn'},
//         {firstName: 'Margery', lastName: 'Pullman'},
//         {firstName: 'Avis', lastName: 'Bueche'},
//         {firstName: 'Esmeralda', lastName: 'Katzer'},
//         {firstName: 'Tania', lastName: 'Belmonte'},
//         {firstName: 'Malinda', lastName: 'Kwak'},
//         {firstName: 'Tanisha', lastName: 'Jobin'},
//         {firstName: 'Kelly', lastName: 'Dziedzic'},
//         {firstName: 'Darren', lastName: 'Devalle'},
//         {firstName: 'Julio', lastName: 'Buchannon'},
//         {firstName: 'Darren', lastName: 'Schreier'},
//         {firstName: 'Jamie', lastName: 'Pollman'},
//         {firstName: 'Karina', lastName: 'Pompey'},
//         {firstName: 'Hugh', lastName: 'Snover'},
//         {firstName: 'Zebra', lastName: 'Evilias'}
//     ]
// });
// 
// App.views.HomeBrowseList = new Ext.TabPanel ({
//     items: [{
//         title: 'Simple',
//         layout: 'fit',
//         cls: 'demo-list',
//         items: [{
//             width:  300,
//             height: 500,
//             xtype: 'list',
//             store: App.ListStore,
//             itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>'
//         }]
// 		}]
// });

App.views.HomeBrowse = Ext.extend(Ext.Panel, {
    layout: 'card',

    initComponent: function(){
        
        this.list = new Ext.List({
            itemTpl: '<div class="page">{title}</div>',
            ui: 'round',
            store: new Ext.data.Store({
                fields: ['name', 'card'],
                data:[{
		                title: 'Best Ever',
		                card: {
		                    xtype: 'htmlpage',
		                    url: 'about.html'
		                }
		            }, {
		                title: 'Brands',
		                card: {
		                    xtype: 'htmlpage',
		                    url: 'about2.html'
		                }
										
		            }, {
		                title: 'Models',
		                card: {
		                    xtype: 'htmlpage',
		                    url: 'about2.html'
		                }
										
		            }, {
		                title: 'Trending',
		                card: {
		                    xtype: 'htmlpage',
		                    url: 'about2.html'
		                }
										
		            }, {
		                title: 'Bah bah black sheep',
		                card: {
		                    xtype: 'htmlpage',
		                    url: 'about2.html'
		                }
		            }]
            }),
            listeners: {
                selectionchange: {fn: this.onSelect, scope: this}
            },
            title: 'About'
        });
        
        this.listpanel = new Ext.Panel({
            title: 'About',
            items: this.list,
            layout: 'fit',
            dockedItems: {
                xtype: 'toolbar',
                title: 'About'
            }
        })
        
        this.listpanel.on('activate', function(){
            this.list.getSelectionModel().deselectAll();
        }, this);
        
        this.items = [this.listpanel];
        
        App.views.HomeBrowse.superclass.initComponent.call(this);
    },
    
    onSelect: function(sel, records){
        if (records[0] !== undefined) {
            var newCard = Ext.apply({}, records[0].data.card, { 
                prevCard: this.listpanel,
                title: records[0].data.title
            });
            
            this.setActiveItem(Ext.create(newCard), 'slide');
        }
    }
});


Ext.reg('HomeBrowse', App.views.HomeBrowse);