<h1> Node Js CLI </h1>


search directory --DIR (required) base lookup directory

--TYPE (optional) [D|F] D - directory, F - file

--PATTERN (optional) regular expression to test file/directory name

--MIN-SIZE (optional) minimum file size [B|K|M|G], should be skipped for directories

--MAX-SIZE (optional) maximum file size [B|K|M|G], should be skipped for directories (B - bytes, K - kilobytes, M - megabytes, G - gigabytes)

Parameters order is not strict! Any order should work!  

<h2>Install</h2>

[sudo] npm install -g nick_clisearch

<h2>Use</h2>

nick_clisearch --DIR="/usr/bin/directory" etc.



