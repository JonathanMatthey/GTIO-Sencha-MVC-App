<?php
$dir = $_GET['path'] . "resources/img/looks/";

$dh = opendir($dir);
$files = array();
while (($file = readdir($dh)) !== false ) {
    if ($file != '.' AND $file != '..' AND $file[0] != '.') {
        if (filetype($dir . $file) == 'file') {
            $files[] = array(
                'name' => $file,
                'size' => filesize($dir . $file). ' bytes',
                'date' => date("F d Y H:i:s", filemtime($dir . $file)),
                'path' => $dir . $file,
                'thumb' => $dir . 'thumbs/thumb-' . $file
            );
        }
    }
}
closedir($dh);

echo(json_encode(array('files' => $files)));
?>
