#!/bin/bash
set -x
image_name=cald_frontend_v2

docker build -t $image_name:`git rev-parse HEAD` . --build-arg GIT_COMMIT_HASH=`git rev-parse HEAD`

final_tag="registry.gitlab.hrajfrisbee.cz/yellow-fever/$image_name:`git rev-parse HEAD`"
docker tag $image_name:`git rev-parse HEAD` $final_tag
docker push $final_tag
echo "Container has been pushed as: ${final_tag}"
