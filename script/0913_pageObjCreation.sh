sh cloneDBtoDevDB.sh 
source env.sh 
./node_modules/babel-cli/bin/babel-node.js --presets node6 script/createPageByJson.js
./node_modules/babel-cli/bin/babel-node.js --presets node6 script/countVideosOfPage.js