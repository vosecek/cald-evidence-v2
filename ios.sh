#!/bin/zsh
# ios build

node ./version.js

enviroment=$(basename "$PWD")


mode='debug';

if [ "$1" ]
	then
	mode=$1;
fi

echo -e "\e[32mZahajuji build pro iOS"
echo -e "\e[39m"

if [ ${mode} = "production" ]
	then
    ionic cordova build ios --aot --minifyjs --minifycss --optimizejs --verbose -- --buildFlag="-UseModernBuildSystem=0"
fi

if [ ${mode} = "debug" ]
	then
    ionic cordova build ios --debug --verbose
fi

./fixes/fixit.sh


echo -e "\e[91mBuild pro iOS vytvoren, pokracuj z XCode"

echo -e "\e[39m"
# rm config.xml
