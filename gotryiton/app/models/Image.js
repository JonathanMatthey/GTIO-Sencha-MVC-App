Ext.regModel("Image", {
    fields: [
        {name: "name", type: "string"},
        {name: "size", type: "string"},
        {name: "date", type: "string"},
        {name: "path", type: "string"},
        {name: "thumb", type: "string"},
    ],
    proxy: {
        type: 'ajax',
		    url: 'get-file.php',
        reader: {
            root: 'files',
            type: 'json'
        }
    }
});
