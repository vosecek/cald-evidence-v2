#!/bin/zsh
# vytvori build pro Android

rm -fr www

while echo $1 | grep -q ^-; do
    eval $( echo $1 | sed 's/^-//' )=$2
    shift
    shift
done

#node ./version.js

if [ -z ${password+x} ]
	then
	echo -n "Put password for Android keystore: ";
	read password;
fi

mode='debug';

if [ "$1" ]
	then
	mode=$1;
fi

enviroment="freebike";

echo -e "\e[32mZahajuji build pro Android"
echo -e "\e[39m"
rm apk/$enviroment.apk

if [ "$mode" = "production" ]
	then
	rm platforms/android/app/build/outputs/app-unsigned-aligned.apk
	rm platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
	ionic cordova build android --release --prod --aot
	zipalign -v -p 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk platforms/android/app/build/outputs/app-unsigned-aligned.apk
fi

if [ "$mode" = "debug" ]
	then
	rm platforms/android/app/build/outputs/apk/debug/app-debug.apk
    rm platforms/android/app/build/outputs/app-unsigned-aligned.apk
	ionic cordova build android --debug
	zipalign -v -p 4 platforms/android/app/build/outputs/apk/debug/app-debug.apk platforms/android/app/build/outputs/app-unsigned-aligned.apk
fi

apksigner sign --ks ~/ionic/secret/vosecek.keystore --ks-pass pass:$password --out apk/$enviroment.apk platforms/android/app/build/outputs/app-unsigned-aligned.apk
apksigner verify apk/$enviroment.apk

echo -e "\e[91mBuild pro Android vytvoren, nahraj do zarizeni a vyzkousej"

echo -e "\e[39m"